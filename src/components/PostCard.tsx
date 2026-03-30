import React from 'react';
import { Link } from 'react-router-dom';
import type { Post } from '../types';
import '../styles/PostCard.css';

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  return (
    <article className="post-card">
      <Link to={`/posts/${post.id}`}>
        <span className="post-category">{post.category}</span>
        <h2 className="post-title">{post.title}</h2>
        <p className="post-excerpt">{post.excerpt}</p>
        <div className="post-tags" style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {post.tags?.map((tag) => (
            <span key={tag} style={{ fontSize: '0.75rem', color: 'var(--text-muted)', backgroundColor: 'var(--card-bg)', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', border: '1px solid var(--card-border)' }}>
              #{tag}
            </span>
          ))}
        </div>
        <div className="post-meta">
          <time className="post-date">{post.date}</time>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
