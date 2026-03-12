import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

const TableOfContents = ({ items }) => {
  const [activeHeading, setActiveHeading] = React.useState('');
  
  // 生成唯一的锚点ID
  const getAnchorId = (text) => {
    return text
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  };

  React.useEffect(() => {
    if (!items) return;
    
    // 为所有标题添加 id
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach((heading) => {
      if (!heading.id) {
        heading.id = getAnchorId(heading.textContent);
      }
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.textContent);
          }
        });
      },
      {
        rootMargin: '-20% 0% -35% 0%',
        threshold: 0
      }
    );

    headings.forEach((heading) => {
      observer.observe(heading);
    });

    return () => {
      headings.forEach((heading) => {
        observer.unobserve(heading);
      });
    };
  }, [items]);
  
  if (!items) return null;
  
  return (
    <nav className="hidden md:block sticky top-[120px]">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">目录</h2>
      <div className="max-h-[calc(100vh-10rem)] overflow-y-auto pr-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <ul className="space-y-2 text-sm">
          {items.map((item, index) => {
            const anchorId = getAnchorId(item.value);
            return (
              <li 
                key={index} 
                className={`
                  ${item.depth === 1 ? 'ml-0' : ''}
                  ${item.depth === 2 ? 'ml-4' : ''}
                  ${item.depth === 3 ? 'ml-8' : ''}
                  list-none
                `}
              >
                <button 
                  onClick={() => {
                    const element = document.getElementById(anchorId);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`
                    w-full text-left block py-1 px-2 rounded transition-colors duration-200
                    ${activeHeading === item.value 
                      ? 'text-blue-600 bg-blue-50 font-medium' 
                      : 'text-gray-600 hover:text-blue-600'
                    }
                  `}
                >
                  {item.value}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

const BlogPostTemplate = ({ data, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const { previous, next } = data

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      
      {/* Main Container with Grid */}
      <div className="grid grid-cols-[minmax(0,1fr),400px] gap-8">
        {/* Article Container */}
        <div>
          <article
            className="prose lg:prose-lg mx-auto"
            itemScope
            itemType="http://schema.org/Article"
          >
            {/* Article Header */}
            <header className="mb-8 text-center">
              <h1
                itemProp="headline"
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
              >
                {post.frontmatter.title}
              </h1>
              <div className="flex items-center justify-center space-x-4 text-gray-600">
                <time className="text-sm">
                  {post.frontmatter.date}
                </time>
              </div>
            </header>

            {/* Article Content */}
            <section
              dangerouslySetInnerHTML={{ __html: post.html }}
              itemProp="articleBody"
              className="mt-8"
            />

            {/* Article Footer */}
            <footer className="mt-12 pt-6 border-t border-gray-200">
              <Bio />
            </footer>
          </article>

          {/* Navigation */}
          <nav className="mt-12 mb-8">
            <ul className="flex flex-wrap justify-between gap-4">
              <li className="flex-1 min-w-[45%]">
                {previous && (
                  <Link
                    to={previous.fields.slug}
                    rel="prev"
                    className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
                  >
                    <span className="text-sm text-gray-500 block mb-1">← 上一篇</span>
                    <span className="font-medium text-gray-900">{previous.frontmatter.title}</span>
                  </Link>
                )}
              </li>
              <li className="flex-1 min-w-[45%]">
                {next && (
                  <Link
                    to={next.fields.slug}
                    rel="next"
                    className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-right"
                  >
                    <span className="text-sm text-gray-500 block mb-1">下一篇 →</span>
                    <span className="font-medium text-gray-900">{next.frontmatter.title}</span>
                  </Link>
                )}
              </li>
            </ul>
          </nav>
        </div>

        {/* TOC Sidebar */}
        <aside className="order-first sm:order-last">
          <TableOfContents items={post.headings} />
        </aside>
      </div>
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug(
    $id: String!
    $previousPostId: String
    $nextPostId: String
  ) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      headings {
        id
        value
        depth
      }
      frontmatter {
        title
        date(formatString: "YYYY/MM/DD")
        description
      }
    }
    previous: markdownRemark(id: { eq: $previousPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
    next: markdownRemark(id: { eq: $nextPostId }) {
      fields {
        slug
      }
      frontmatter {
        title
      }
    }
  }
`
