import * as React from "react"
import { Link, graphql } from "gatsby"

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="周刊汇总" />
      <ol style={{ listStyle: `none` }}>
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug} className="mb-2">
              <article
                className=""
                itemScope
                itemType="http://schema.org/Article"
              >
                <Link to={post.fields.slug} itemProp="url">
                  <span className="mr-1">
                    第 {post.frontmatter.release.toString().padStart(2, '0')} 期：
                  </span>
                  <span itemProp="headline">{title}</span>
                </Link>
                <span className="ml-2 text-sm italic text-gray-600">{post.frontmatter.date}</span>
              </article>
            </li>
          )
        })}
      </ol>
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
        description
      }
    }
    allMarkdownRemark(
      sort: {frontmatter: { date: DESC }}
      filter: {fields: {slug: {glob: "/week-*"}}}
    ) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "YYYY/MM/DD")
          title
          description
          release
        }
      }
    }
}
`
