import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const ColumnList = ({ children }) => {
  return (
    <div className="grid grid-cols-2 gap-4 summary" style={{ marginTop: '2rem' }}>
      <Link to="/week">
        <div className="flex flex-col items-center justify-center h-32 text-lg cursor-pointer column">
          <div>发布周刊</div>
          <span className="text-2xl number">
            30
          </span>
        期
      </div>
      </Link>
      <Link to="/package">
        <div className="flex flex-col items-center justify-center h-32 text-lg cursor-pointer column">
          <div>有趣的库</div>
          <span className="text-2xl number">29</span>
        个
      </div>
      </Link>
      <Link to="/tool">
        <div className="flex flex-col items-center justify-center h-32 text-lg cursor-pointer column">
          <div>开发利器</div>
          <span className="text-2xl number">27</span>
        个
      </div>
      </Link>
      <Link to="/article">
        <div className="flex flex-col items-center justify-center h-32 text-lg cursor-pointer column">
          <div>文章精选</div>
          <span className="text-2xl number">29</span>
        篇
      </div>
      </Link>
    </div>
  )
}

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const siteDescription = data.site.siteMetadata?.description || ''
  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="首页" />
      <div>
        {siteDescription}
      </div>
      <ColumnList />
      <h2>文章集合</h2>
      {posts.filter(post => {
        const slug = post.fields.slug
        return slug.includes('week') || slug.includes('/release/') || slug.includes('/article/')
      }).map(post => {
        const title = post.frontmatter.title || post.fields.slug
        const date = post.frontmatter.date || new Date()

        return (
          <div key={post.fields.slug}>
            <article
              className="post-list-item"
              itemScope
              itemType="http://schema.org/Article"
            >
              <header>
                <div className="text-xl font-bold">
                  <Link to={post.fields.slug} itemProp="url">
                    <span className="mr-2 font-mono">{new Date(date).toJSON().slice(0, 10)}</span>
                    <span itemProp="headline">{title}</span>
                  </Link>
                </div>
              </header>
            </article>
          </div>
        )
      })}
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
      sort: { frontmatter: { date: DESC } }
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
        }
      }
    }
  }
`
