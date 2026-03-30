import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Post } from '../types';
import { getPostById } from '../utils/posts';
import { useTheme } from '../hooks/useTheme';
import { ArrowLeft } from 'lucide-react';
import Mermaid from '../components/Mermaid';
import '../styles/PostContent.css';

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchPost = async () => {
      if (id) {
        const p = await getPostById(id);
        setPost(p || null);
      }
    };
    fetchPost();
  }, [id]);

  if (!post) {
    return <div className="container">Post not found</div>;
  }

  const syntaxTheme = theme === 'dark' ? vscDarkPlus : prism;
  const mermaidTheme = theme === 'dark' ? 'dark' : 'default';

  return (
    <article className="post-detail">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} /> Back to posts
      </Link>
      <header className="post-header">
        <span className="post-category">{post.category}</span>
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <time>{post.date}</time>
        </div>
      </header>
      <div className="post-content">
        <ReactMarkdown
          components={{
            code({ node, inline, className, children, ...props }: any) {
              const match = /language-(\w+)/.exec(className || '');
              const language = match ? match[1] : '';

              if (!inline && language === 'mermaid') {
                return <Mermaid chart={String(children).replace(/\n$/, '')} theme={mermaidTheme} />;
              }

              return !inline && match ? (
                <SyntaxHighlighter
                  style={syntaxTheme as any}
                  language={match[1]}
                  PreTag="div"
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              ) : (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default PostDetail;
