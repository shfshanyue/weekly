import { getCollection } from 'astro:content';

function excerpt(body, limit = 4000) {
  if (!body) return '';
  // Strip markdown links/images/code fences lightly for searchable plain text
  const plain = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`~]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return plain.slice(0, limit);
}

export async function GET() {
  const posts = await getCollection('blog');
  const searchIndex = posts.map((post) => ({
    title: post.data.title,
    description: post.data.description ?? '',
    slug: post.id,
    content: excerpt(post.body),
  }));
  return new Response(JSON.stringify(searchIndex), {
    headers: { 'Content-Type': 'application/json' },
  });
}
