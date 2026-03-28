import type { Post } from '../types';

export function parseFrontmatter(content: string) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    return { data: {}, content };
  }

  const yamlBlock = match[1];
  const markdownContent = match[2];
  const data: Record<string, any> = {};

  yamlBlock.split('\n').forEach((line) => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      data[key.trim()] = valueParts.join(':').trim();
    }
  });

  return { data, content: markdownContent };
}

export async function getAllPosts(): Promise<Post[]> {
  const modules = import.meta.glob('../posts/*.md', { 
    query: '?raw', 
    import: 'default', 
    eager: true 
  });
  
  const posts = Object.entries(modules).map(([path, content]) => {
    const id = path.split('/').pop()?.replace('.md', '') || '';
    const { data, content: markdownContent } = parseFrontmatter(content as string);
    
    return {
      id,
      title: data.title || 'Untitled',
      date: data.date || '',
      category: data.category || 'General',
      excerpt: data.excerpt || '',
      content: markdownContent,
      tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()) : [],
    } as Post;
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.id === id);
}
