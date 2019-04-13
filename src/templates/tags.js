import React from 'react'
import { graphql } from 'gatsby'
import _ from 'lodash'

import { Bio } from '../components/Bio'
import { Layout } from '../components/Layout'
import { SEO } from '../components/seo'
import { PostExcerpt } from '../components/PostExcerpt';

class TagPosts extends React.Component {
  render() {
    const { data, pageContext } = this.props
    const { tag } = pageContext
    const siteTitle = data.site.siteMetadata.title
    const posts = _.get(data, 'allMarkdownRemark.edges', []);
    const totalCount = data.allMarkdownRemark.totalCount
    const tagHeader = `${totalCount} post${
      totalCount === 1 ? "" : "s"
    } tagged with "${tag}"`

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={`Posts tagged ${tag}`}
          description={tagHeader}
        />
        <h1>{tagHeader}</h1>
        <Bio />
        {posts.map(PostExcerpt)}
      </Layout>
    )
  }
}

export default TagPosts

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
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
            featureImage {
              childImageSharp {
                sizes(maxWidth: 630) {
                  ...GatsbyImageSharpSizes
                }
              }
            }
          }
        }
      }
    }
  }
`
