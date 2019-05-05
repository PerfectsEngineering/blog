import React from 'react'
import { Row, Col } from 'antd'
import { graphql } from 'gatsby'
import _ from 'lodash'

import { Layout } from '../components/Layout'
import { SEO } from '../components/seo'
import {
  FeaturedPostExcerpt,
  PostExcerpt,
  postsExcerptLayout,
} from '../components/PostExcerpt'
import { ContentContainer } from '../components/ContentContainer'
import SubscriptionForm from '../components/SubscriptionForm';

const featuredPostExcerptLayout = {
  sm: {
    span: 24,
  },
  md: {
    span: 24,
  },
  lg: {
    span: 24,
  },
}

class BlogIndex extends React.Component {
  render() {
    const { data } = this.props
    const siteTitle = data.site.siteMetadata.title
    const posts = _.get(data, 'allMarkdownRemark.edges', [])

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <Row
          className="container"
          type="flex"
          style={{ marginBottom: '10rem' }}
        >
          <Col md={{ span: 18, offset: 3 }} xs={24}>
            <Row className="container" type="flex" justify="space-between">
              <Col lg={12} md={24} xs={24} style={{ marginBottom: '5rem' }}>
                <h1 style={{ fontSize: '4rem' }}>
                  Perfects.
                  <br />
                  Engineering
                </h1>
                Perfect's tip and tricks on different topics in Software
                Engineering
              </Col>
              <Col lg={12} md={24} xs={24} style={{ marginBottom: '5rem' }}>
                <SubscriptionForm />
              </Col>
            </Row>
          </Col>
        </Row>

        <div style={{ position: 'absolute' }} className="content-container">
          <div style={{ marginTop: '-10rem', position: 'relative' }}>
            <ContentContainer>
              {/* <Row type="flex" justify="space-around" className="navigation-tabs">
              <Col sm={0} mm={0} lg={{span: 3, offset: 1}}><TagLink tag={'android'}>ANDROID</TagLink></Col>
              <Col sm={0} mm={0} lg={3}><TagLink tag={'blockchain'}>BLOCKCHAIN</TagLink></Col>
              <Col sm={0} mm={0} lg={6}><TagLink tag={'engineering'}>SOFTWARE ENGINEERING</TagLink></Col>
              <Col sm={0} mm={0} lg={2}><TagLink tag={'node.js'}>NODE.JS</TagLink></Col>
              <Col sm={0} mm={0} lg={3}><TagLink tag={'algorithms'}>ALGORITHMS</TagLink></Col>
            </Row> */}

              <Row
                className="container"
                type="flex"
                justify="center"
                gutter={{ xs: 0, sm: 0, md: 16, lg: 24 }}
              >
                <Col {...featuredPostExcerptLayout}>
                  {_.first(posts) && (
                    <FeaturedPostExcerpt {..._.first(posts)} />
                  )}
                </Col>
              </Row>

              <Row
                className="container"
                type="flex"
                justify="space-between"
                gutter={{ xs: 0, sm: 0, md: 16, lg: 24 }}
              >
                {_.slice(posts, 1).map(post => (
                  <Col key={post.node.fields.slug} {...postsExcerptLayout}>
                    <PostExcerpt {...post} />
                  </Col>
                ))}
              </Row>
            </ContentContainer>
          </div>
        </div>

        <SEO
          title="All posts"
          keywords={[`blog`, `gatsby`, `javascript`, `react`]}
        />
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
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
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
                fluid(maxWidth: 630) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
          }
        }
      }
    }
  }
`
