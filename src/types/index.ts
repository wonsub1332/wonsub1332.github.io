export interface Post {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  content: string;
  tags?: string[];
  thumbnail?: string;
}
