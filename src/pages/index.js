import React from 'react'
import { Link, graphql } from 'gatsby'
import _ from 'lodash'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import { rhythm } from '../utils/typography'

class BlogIndex extends React.Component {
  renderPost(node) {
    const title = node.frontmatter.title || node.fields.slug
    return (
      <div key={node.fields.slug}>
        <h3
          style={{
            marginBottom: rhythm(1 / 4),
          }}
        >
          <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
            {title}
          </Link>
        </h3>
        <small>{node.frontmatter.date}</small>
        <p dangerouslySetInnerHTML={{ __html: node.excerpt }} />
      </div>
    )
  }
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = _.get(data, 'allMarkdownRemark.edges', []);
    const welcomePost = _.get(data, 'welcome.edges', []);

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
        <Bio />
        {posts.map(({ node }) => this.renderPost(node))}
        {/* Welcome post always shows at the bottom */}
        {welcomePost.map(({ node }) => this.renderPost(node))}
      </Layout>
    )
  }
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    welcome: allMarkdownRemark(filter: { frontmatter: { title : { eq: "Welcome" }} }) {
      edges {
          node {
            excerpt
            fields {
              slug
            }
            frontmatter {
              date(formatString: "MMMM DD, YYYY")
              title
            }
          }
        }
    }
    allMarkdownRemark(filter: { frontmatter: { title : { ne: "Welcome" }} }, sort: { fields: [frontmatter___date], order: DESC }) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
          }
        }
      }
    }
  }
`
