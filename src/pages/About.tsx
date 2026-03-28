import React from 'react';

const About: React.FC = () => {
  return (
    <div className="about-page" style={{ maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 800 }}>About Me</h1>
      <section className="about-content">
        <p style={{ marginBottom: '1.5rem', fontSize: '1.125rem' }}>
          Hello! I'm a software engineer passionate about building great products and sharing knowledge.
        </p>
        <h2 style={{ fontSize: '1.5rem', margin: '2rem 0 1rem' }}>My Background</h2>
        <p style={{ marginBottom: '1.5rem' }}>
          I specialize in frontend development with React, but I also enjoy working with Node.js and other backend technologies.
        </p>
        <h2 style={{ fontSize: '1.5rem', margin: '2rem 0 1rem' }}>Connect</h2>
        <p>
          You can find me on <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)', fontWeight: 600 }}>GitHub</a> or follow me on other social media.
        </p>
      </section>
    </div>
  );
};

export default About;
