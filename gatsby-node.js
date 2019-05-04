const path = require(`path`)
const { createFilePath } = require(`gatsby-source-filesystem`)
const _ = require('lodash');


/**
 * Is supposed to generate similar posts to the current post,
 * but life give you lemons and you make lemonade, so we just pick randomly.
 * If post has `followUpPosts we make those first
 * 
 * @param {Post[]} posts 
 * @param {Post} currentPost
 * @param {number} count Number of top similar posts to return
 * @retuns {Post[]} similar posts
 */
function similarPosts(posts, currentPost, count = 3) {
  const followUpPosts = _.map(
    _.defaultTo(
      _.get(
        currentPost,
        'node.frontmatter.followUpPosts'
      ),
      []
    ),
    followUpPostSlug => _.find(posts, p => _.includes(p.node.fields.slug, followUpPostSlug))
  ).filter(_.identity);

  if (followUpPosts.length >= count) {
    return _.take(followUpPosts, count);
  }
    
  const nonFollowUpPost = _.differenceBy(
    posts,
    followUpPosts,
    'node.fields.slug'
  );

  const filterUnique = _.filter(
    nonFollowUpPost,
    input => {
      const notCurrentPost = input.node.fields.slug !== currentPost.node.fields.slug;
      const notFollowUpPosts = followUpPosts.map
      return notCurrentPost && notFollowUpPosts;
    }
  );

  // pick remaining similar posts
  const similarPosts = _.sampleSize(filterUnique, count - followUpPosts.length);
  return _.concat(followUpPosts, similarPosts);
}

function createBlogPostPages(posts, createPage) {
  const blogPost = path.resolve(`./src/templates/blog-post.js`)
  posts.forEach(post => {
    createPage({
      path: post.node.fields.slug,
      component: blogPost,
      context: {
        slug: post.node.fields.slug,
        similarPosts: similarPosts(posts, post)
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
              excerpt
              fields {
                slug
                readingTime {
                  text
                }
              }
              frontmatter {
                date(formatString: "MMMM DD, YYYY")
                title
                tags
                followUpPosts
                featureImage {
                  childImageSharp {
                    fluid (maxWidth:630) {
                      src
                      srcSet
                      aspectRatio
                      sizes
                      base64
                    }
                  }
                }
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