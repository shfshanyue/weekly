import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import SEO from "../components/seo"

const ColumnList = ({ children }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
      <Link to="/week" className="transform hover:-translate-y-1 transition-all duration-200">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md">
          <div className="flex flex-col items-center">
            <div className="text-gray-800 text-lg font-medium mb-3">发布周刊</div>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-blue-600 mr-1">30</span>
              <span className="text-gray-600">期</span>
            </div>
          </div>
        </div>
      </Link>

      <Link to="/package" className="transform hover:-translate-y-1 transition-all duration-200">
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 shadow-sm hover:shadow-md">
          <div className="flex flex-col items-center">
            <div className="text-gray-800 text-lg font-medium mb-3">有趣的库</div>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-green-600 mr-1">29</span>
              <span className="text-gray-600">个</span>
            </div>
          </div>
        </div>
      </Link>

      <Link to="/tool" className="transform hover:-translate-y-1 transition-all duration-200">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 shadow-sm hover:shadow-md">
          <div className="flex flex-col items-center">
            <div className="text-gray-800 text-lg font-medium mb-3">开发利器</div>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-purple-600 mr-1">27</span>
              <span className="text-gray-600">个</span>
            </div>
          </div>
        </div>
      </Link>

      <Link to="/article" className="transform hover:-translate-y-1 transition-all duration-200">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-6 shadow-sm hover:shadow-md">
          <div className="flex flex-col items-center">
            <div className="text-gray-800 text-lg font-medium mb-3">文章精选</div>
            <div className="flex items-baseline">
              <span className="text-4xl font-bold text-orange-600 mr-1">29</span>
              <span className="text-gray-600">篇</span>
            </div>
          </div>
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
      
      {/* Site Description */}
      <div className="max-w-2xl mx-auto text-center my-8">
        <p className="text-xl text-gray-600">{siteDescription}</p>
      </div>

      <ColumnList />

      {/* Article List - Updated UI */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-8">文章集合</h2>
        <div className="space-y-6">
          {posts.filter(post => {
            const slug = post.fields.slug
            return slug.includes('week') || slug.includes('/release/') || slug.includes('/article/')
          }).map(post => {
            const title = post.frontmatter.title || post.fields.slug
            const date = post.frontmatter.date || new Date()

            return (
              <div key={post.fields.slug} 
                   className="group hover:bg-gray-50 rounded-xl p-5 -mx-4 transition-all duration-200 border border-transparent hover:border-gray-100 hover:shadow-sm">
                <article
                  className="flex justify-between items-center"
                  itemScope
                  itemType="http://schema.org/Article"
                >
                  <Link 
                    to={post.fields.slug} 
                    itemProp="url"
                    className="flex-1"
                  >
                    <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                      <time className="text-sm text-gray-500 font-mono bg-gray-50 px-3 py-1 rounded-full">
                        {new Date(date).toJSON().slice(0, 10)}
                      </time>
                      <h3 className="text-lg font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                        {title}
                      </h3>
                    </div>
                  </Link>
                  <div className="text-gray-400 group-hover:text-blue-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      </div>
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
