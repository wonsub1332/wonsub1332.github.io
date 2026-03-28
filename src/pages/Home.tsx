import React, { useEffect, useState } from 'react';
import type { Post } from '../types';
import { getAllPosts } from '../utils/posts';
import PostCard from '../components/PostCard';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getAllPosts();
      console.log('Loaded posts:', allPosts);
      setPosts(allPosts);
    };
    fetchPosts();
  }, []);

  return (
    <div className="home-page">
      <section className="hero">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>Tech Insights</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '3rem' }}>
          Thoughts, tutorials and snippets for developers.
        </p>
      </section>
      <div className="post-list">
        {posts.length > 0 ? (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No posts found. Please check src/posts/ folder.
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
