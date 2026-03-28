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
        <div className="post-meta">
          <time className="post-date">{post.date}</time>
        </div>
      </Link>
    </article>
  );
};

export default PostCard;
