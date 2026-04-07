import type { Post } from '../types';

export function parseFrontmatter(content: string) {
  // 프론트매터가 없는 경우 대비
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);

  if (!match) {
    // 프론트매터가 없으면 전체 내용을 content로 반환
    return { data: {}, content };
  }

  const yamlBlock = match[1];
  const markdownContent = match[2];
  const data: Record<string, any> = {};

  yamlBlock.split('\n').forEach((line) => {
    const separatorIndex = line.indexOf(':');
    if (separatorIndex !== -1) {
      const key = line.slice(0, separatorIndex).trim();
      const value = line.slice(separatorIndex + 1).trim();
      if (key) data[key] = value;
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

  return posts.sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    // 유효하지 않은 날짜의 경우 뒤로 보냄
    if (isNaN(dateA)) return 1;
    if (isNaN(dateB)) return -1;
    
    // 내림차순 정렬 (최신글이 앞)
    return dateB - dateA;
  });
}

export async function getPostById(id: string): Promise<Post | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.id === id);
}
