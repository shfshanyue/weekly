const blogPostQuery = `{
  allMarkdownRemark {
    nodes {
      id
      frontmatter {
        date
        title
      }
      excerpt
    }
  }
}`;

const queries = [
  {
    query: blogPostQuery,
    transformer: ({ data }) => data.allMarkdownRemark.nodes.map(node => ({
      objectID: node.id,
      date: node.frontmatter.date,
      title: node.frontmatter.title,
      excerpt: node.excerpt,
    })),
    indexName: "weekly", // 使用环境变量来定义索引名
  }
];

module.exports = queries;
