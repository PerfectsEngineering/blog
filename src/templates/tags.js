import React from 'react'
import { Row, Col } from 'antd'
import { graphql } from 'gatsby'
import _ from 'lodash'

import { Bio } from '../components/Bio'
import { Layout } from '../components/Layout'
import { SEO } from '../components/seo'
import { PostExcerpt, postsExcerptLayout } from '../components/PostExcerpt'
import { ContentContainer } from '../components/ContentContainer'

class TagPosts extends React.Component {
  render() {
    const { data, pageContext } = this.props
    const { tag } = pageContext
    const siteTitle = data.site.siteMetadata.title
    const posts = _.get(data, 'allMarkdownRemark.edges', [])
    const totalCount = data.allMarkdownRemark.totalCount
    const tagHeader = `${totalCount} post${
      totalCount === 1 ? '' : 's'
    } tagged with "${tag}"`

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO title={`Posts tagged ${tag}`} description={tagHeader} />
        <Row type="flex">
          <Col span={24}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
              {tagHeader}
            </h2>
          </Col>
        </Row>
        <div className="content-container">
          <div>
            <ContentContainer>
              <Row
                className="container"
                type="flex"
                justify="space-between"
                gutter={{ xs: 0, sm: 0, md: 16, lg: 24 }}
              >
                {posts.map(post => (
                  <Col {...postsExcerptLayout}>
                    <PostExcerpt {...post} />
                  </Col>
                ))}
              </Row>
            </ContentContainer>
          </div>
        </div>
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
