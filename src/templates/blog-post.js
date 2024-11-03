import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

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
      
      {/* Article Container */}
      <div className="max-w-3xl mx-auto px-4">
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

        {/* Related Posts or Comments Section could be added here */}
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
