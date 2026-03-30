import React, { useEffect, useState } from 'react';
import type { Post } from '../types';
import { getAllPosts } from '../utils/posts';
import PostCard from '../components/PostCard';

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isTagsExpanded, setIsTagsExpanded] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      const allPosts = await getAllPosts();
      setPosts(allPosts);
    };
    fetchPosts();
  }, []);

  // 태그 빈도수 계산 및 정렬
  const tagCounts = posts.flatMap((post) => post.tags || []).reduce((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

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

      <div className="tags-wrapper" style={{ marginBottom: '3rem' }}>
        <div 
          className="tags-container" 
          style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '0.75rem',
            height: isTagsExpanded ? 'auto' : '45px',
            overflow: 'hidden',
            transition: 'height 0.3s ease'
          }}
        >
          <button
            onClick={() => setSelectedTag(null)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '2rem',
              fontSize: '0.875rem',
              backgroundColor: selectedTag === null ? 'var(--primary)' : 'var(--card-bg)',
              color: selectedTag === null ? '#fff' : 'var(--text-color)',
              border: '1px solid var(--card-border)',
              fontWeight: 600,
              height: '36px'
            }}
          >
            All
          </button>
          {sortedTags.map((tag) => (
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
                fontWeight: 600,
                height: '36px'
              }}
            >
              #{tag} ({tagCounts[tag]})
            </button>
          ))}
        </div>
        {sortedTags.length > 5 && (
          <button 
            onClick={() => setIsTagsExpanded(!isTagsExpanded)}
            style={{ 
              marginTop: '0.75rem', 
              fontSize: '0.875rem', 
              color: 'var(--primary)', 
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            {isTagsExpanded ? '접기' : '모든 태그 보기...'}
          </button>
        )}
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
