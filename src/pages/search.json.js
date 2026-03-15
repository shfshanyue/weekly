import { getCollection } from 'astro:content';

export async function GET() {
  const posts = await getCollection('blog');
  const searchIndex = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description,
    slug: post.id,
  }));
  return new Response(JSON.stringify(searchIndex), {
    headers: { 'Content-Type': 'application/json' },
  });
}
