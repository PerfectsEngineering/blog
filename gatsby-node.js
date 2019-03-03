const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const _ = require('lodash');


function createBlogPostPages(posts, createPage) {
  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  posts.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node;
    const next = index === 0 ? null : posts[index - 1].node;
    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        previous,
        next,
      },
    });
  });
}

function createTagPages(posts, createPage) {
  const rejectEmpty = _.partialRight(_.reject, _.isEmpty)
  const fetchTags = _.flow(_.flatMap, _.uniq, rejectEmpty)
  const tags = fetchTags(posts, post => _.get(post, `node.frontmatter.tags`, ``))
  
  const tagTemplate = path.resolve(`./src/templates/tags.js`)
  tags.forEach(tag => {
    createPage({
      path: `/tags/${_.kebabCase(tag)}/`,
      component: tagTemplate,
      context: {
        tag,
      },
    })
  })
}

exports.createPages = ({ graphql, actions }) => {
  const { createPage } = actions

  return graphql(
    `
      {
        allMarkdownRemark(
          sort: { fields: [frontmatter___date], order: DESC }
          limit: 1000
        ) {
          edges {
            node {
              fields {
                slug
              }
              frontmatter {
                title,
                tags
              }
            }
          }
        }
      }
    `
  ).then(result => {
    if (result.errors) {
      throw result.errors
    }
    const posts = result.data.allMarkdownRemark.edges;
    createBlogPostPages(posts, createPage)
    createTagPages(posts, createPage)
  })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
};

exports.onCreateBabelConfig = ({ actions }) => {
  const { setBabelPlugin } = actions
  setBabelPlugin({
    name: 'babel-plugin-import',
    options: {
      libraryName: 'antd',
      libraryDirectory: 'es',
      style: true
    }
  })
}