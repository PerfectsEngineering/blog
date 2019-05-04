import React from 'react'
import { Col, Divider, Row } from 'antd'
import { graphql } from 'gatsby'
import { get } from 'lodash'

import { Layout } from '../components/Layout'
import { SEO } from '../components/seo'
import { rhythm, scale } from '../utils/typography'
import { Tags } from '../components/Tags'
import {
  PostDate,
  PostExcerpt,
  postsExcerptLayout,
  PostReadTime,
} from '../components/PostExcerpt'
import { ContentContainer } from '../components/ContentContainer'
import SubscriptionForm from '../components/SubscriptionForm'
import { getFeatureImage } from '../utils/posts'

// styles

const postsLayout = {
  xs: {
    span: 24,
  },
  sm: {
    span: 24,
  },
  md: {
    span: 20,
    offset: 1,
  },
  lg: {
    span: 18,
    offset: 2,
  },
}

const buildSeoImageMeta = post => {
  const seoImageSrc = get(
    post,
    'frontmatter.featureImage.childImageSharp.sizes.src'
  )
  
  if (!seoImageSrc) {
    return []
  }

  const websiteUrl = process.env.WEBSITE_URL || 'https://perfects.engineering'

  const twitterImage = {
    name: 'twitter:image',
    content: `${websiteUrl}${seoImageSrc}`,
  }

  const facebookImage = {
    name: 'og:image',
    content: `${websiteUrl}${seoImageSrc}`,
  }

  return [twitterImage, facebookImage]
}

class BlogPostTemplate extends React.Component {
  render() {
    const post = this.props.data.markdownRemark
    const siteTitle = this.props.data.site.siteMetadata.title
    const { similarPosts } = this.props.pageContext

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={post.frontmatter.title}
          description={post.excerpt}
          keywords={post.frontmatter.tags || []}
          meta={buildSeoImageMeta(post)}
        />
        {getFeatureImage(post, {
          marginBottom: '1rem',
          height: '70vh',
        })}
        <div
          style={{ position: 'absolute' }}
          className="article-content-container"
        >
          <div style={{ marginTop: '-10rem', position: 'relative' }}>
            <ContentContainer
              col={{
                ...postsLayout,
                className: 'article-content-container',
                style: {
                  borderRadius: '1rem',
                  padding: '2rem 2rem',
                },
              }}
            >
              <div style={{ marginBottom: '3rem' }}>
                <PostReadTime post={post} />
              </div>
              <h1 className="post-title">{post.frontmatter.title}</h1>
              <p
                style={{
                  ...scale(1 / 2),
                  display: `block`,
                  marginBottom: rhythm(1),
                }}
              >
                <PostDate post={post} />
              </p>
              <div
                class="blog-post-content"
                dangerouslySetInnerHTML={{ __html: post.html }}
              />
              <Tags tags={post.frontmatter.tags} />
              <Divider />
              <Row type="flex" justify="center">
                <Col xs={24} md={12}>
                  <SubscriptionForm />
                </Col>
              </Row>

              <br />
              <br />

              <Divider />

              <h3
                style={{
                  marginTop: '4rem',
                  marginBottom: '4rem',
                  textAlign: 'center',
                }}
              >
                ALSO, YOU SHOULD READ THESE POSTS
              </h3>
              <Row
                type="flex"
                justify="space-between"
                gutter={{ xs: 0, sm: 0, md: 16, lg: 24 }}
              >
                {similarPosts.map((post, i) => (
                  <Col {...postsExcerptLayout} key={i}>
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

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
        author
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      fields {
        readingTime {
          text
        }
      }
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
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
`
