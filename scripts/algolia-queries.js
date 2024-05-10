const blogPostQuery = `{
  allMarkdownRemark {
    nodes {
      id
      title 
      frontmatter {
        date
        title
      }
      excerpt
      internal {
        contentDigest
      }
      fields {
        slug
      }
      headings {
        value
      }
    }
  }
}`;

const queries = [
  {
    query: blogPostQuery,
    transformer: ({ data }) => data.allMarkdownRemark.nodes,
    indexName: "weekly", // 使用环境变量来定义索引名
  }
];

module.exports = queries;
