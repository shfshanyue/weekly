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
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">周刊汇总</h1>
        <p className="text-gray-600">这里收录了所有已发布的周刊内容</p>
      </div>

      <ol style={{ listStyle: `none` }} className="space-y-4">
        {posts.map(post => {
          const title = post.frontmatter.title || post.fields.slug

          return (
            <li key={post.fields.slug} className="group hover:bg-gray-50 rounded-lg transition-colors">
              <article
                className="flex items-center justify-between"
                itemScope
                itemType="http://schema.org/Article"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-gray-500 shrink-0">
                    第 <span className="font-mono font-medium text-gray-800">
                      {post.frontmatter.release.toString().padStart(2, '0')}
                    </span> 期
                  </span>
                  <Link 
                    to={post.fields.slug} 
                    itemProp="url"
                    className="hover:text-blue-600 font-medium"
                  >
                    <span itemProp="headline">{title}</span>
                  </Link>
                </div>
                <time className="text-sm text-gray-500">{post.frontmatter.date}</time>
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
