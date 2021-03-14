import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const ColumnList = ({ children }) => {
  return (
    <div className="summary grid grid-cols-2 gap-4" style={{ marginTop: '2rem' }}>
      <Link to="/week">
        <div className="column flex justify-center items-center h-32 flex-col text-lg cursor-pointer">
          <div>发布周刊</div>
          <span className="number text-2xl">3</span>
        期
      </div>
      </Link>
      <Link to="/package">
        <div className="column flex justify-center items-center h-32 flex-col text-lg cursor-pointer">
          <div>有趣的库</div>
          <span className="number text-2xl">11</span>
        个
      </div>
      </Link>
      <Link to="/tool">
        <div className="column flex justify-center items-center h-32 flex-col text-lg cursor-pointer">
          <div>开发利器</div>
          <span className="number text-2xl">7</span>
        个
      </div>
      </Link>
      <Link to="/article">
        <div className="column flex justify-center items-center h-32 flex-col text-lg cursor-pointer">
          <div>文章精选</div>
          <span className="number text-2xl">11</span>
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
      <h2>周刊</h2>
      {posts.map(post => {
        const title = post.frontmatter.title || post.fields.slug

        return (
          <div key={post.fields.slug}>
            <article
              className="post-list-item"
              itemScope
              itemType="http://schema.org/Article"
            >
              <header>
                <h3>
                  <Link to={post.fields.slug} itemProp="url">
                    <span itemProp="headline">{title}</span>
                  </Link>
                </h3>
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
      sort: {fields: [frontmatter___date], order: DESC}
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
        }
      }
    }
  }
`
