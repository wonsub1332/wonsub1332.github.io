import React, { useEffect, useState } from 'react';
import type { Post } from '../types';
import { getAllPosts } from '../utils/posts';
import PostCard from '../components/PostCard';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
    };
    fetchPosts();
  }, []);

  const allTags = Array.from(new Set(posts.flatMap((post) => post.tags || [])));

  const filteredPosts = selectedTag
    ? posts.filter((post) => post.tags?.includes(selectedTag))
    : posts;

  return (
    <div className="home-page">
      <section className="hero">
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontWeight: 800 }}>Tech Insights</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', marginBottom: '2rem' }}>
          Thoughts, tutorials and snippets for developers.
        </p>
      </section>

      <div className="tags-container" style={{ marginBottom: '3rem', display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <button
          onClick={() => setSelectedTag(null)}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '2rem',
            fontSize: '0.875rem',
            backgroundColor: selectedTag === null ? 'var(--primary)' : 'var(--card-bg)',
            color: selectedTag === null ? '#fff' : 'var(--text-color)',
            border: '1px solid var(--card-border)',
            fontWeight: 600
          }}
        >
          All
        </button>
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              fontSize: '0.875rem',
              backgroundColor: selectedTag === tag ? 'var(--primary)' : 'var(--card-bg)',
              color: selectedTag === tag ? '#fff' : 'var(--text-color)',
              border: '1px solid var(--card-border)',
              fontWeight: 600
            }}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className="post-list">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        ) : (
          <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
            No posts found for tag: {selectedTag}
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
