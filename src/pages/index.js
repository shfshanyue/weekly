import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const Column = () => {
  return (
    <Link to="/week">
      <div className="column flex justify-center items-center h-32 flex-col text-lg cursor-pointer">
        <div>周刊</div>
        <span className="number text-2xl">2</span>
        期
      </div>
    </Link>
  )
}

const ColumnList = ({ children }) => {
  return (
    <div className="grid grid-cols-2 gap-4" style={{ marginTop: '2rem' }}>
      { children }
    </div>
  )
}

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const siteDescription = data.site.siteMetadata?.description || ''
  const posts = data.allMarkdownRemark.nodes

  return (
    <Layout location={location} title={siteTitle}>
      <SEO title="All posts" />
      <div>
        { siteDescription }
      </div>
      <ColumnList>
        <Column />
        <Column />
        <Column />
        <Column />
      </ColumnList>
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
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`
