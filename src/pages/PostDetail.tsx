import React, { useEffect, useState, type ComponentProps } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { Post } from '../types';
import { getPostById } from '../utils/posts';
import { useTheme } from '../hooks/useTheme';
import { ArrowLeft } from 'lucide-react';
import Mermaid from '../components/Mermaid';
import '../styles/PostContent.css';

type MarkdownCodeProps = ComponentProps<'code'> & {
  inline?: boolean;
  node?: unknown;
};

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

  const syntaxTheme = (theme === 'dark' ? vscDarkPlus : prism) as {
    [key: string]: React.CSSProperties;
  };
  const mermaidTheme = theme === 'dark' ? 'dark' : 'default';
  const markdownComponents: Components = {
    code({ inline, className, children }: MarkdownCodeProps) {
      const match = /language-(\w+)/.exec(className || '');

      if (!inline && match?.[1] === 'mermaid') {
        return <Mermaid chart={String(children).replace(/\n$/, '')} theme={mermaidTheme} />;
      }

      if (!inline && match?.[1]) {
        return (
          <SyntaxHighlighter style={syntaxTheme} language={match[1]} PreTag="div">
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        );
      }

      return (
        <code className={className}>
          {children}
        </code>
      );
    },
  };

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
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
};

export default PostDetail;
