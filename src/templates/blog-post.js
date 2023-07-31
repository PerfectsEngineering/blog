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
import { SocialShare } from '../components/SocialShare'
import { withBaseUrl } from '../utils/app'
import { Comments } from '../components/Comments'

// styles

const postsLayout = {
  xs: {
    span: 24,
  },
  sm: {
    span: 24,
  },
  md: {
    span: 18,
    offset: 3,
  },
  lg: {
    span: 10,
    offset: 7,
  },
}

const buildSeoImageMeta = (post) => {
  const seoImagePath = get(
    post,
    'frontmatter.featureImage.childImageSharp.sizes.src'
  )

  if (!seoImagePath) {
    return []
  }

  const twitterImage = {
    name: 'twitter:image',
    content: withBaseUrl(seoImagePath),
  }

  const facebookImage = {
    name: 'og:image',
    content: withBaseUrl(seoImagePath),
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
        
        <div
          className="article-content-container"
        >
          <ContentContainer
            col={{
              ...postsLayout,
              className: 'article-content-container',
              style: {
                borderRadius: '1rem',
                padding: '1rem 2rem',
              },
            }}
          >
            <div style={{ marginBottom: '1rem' }}>
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
            {getFeatureImage(post, {
              marginBottom: '4rem',
              aspectRatio: '7/3',
            })}
            <div
              className="blog-post-content"
              dangerouslySetInnerHTML={{ __html: post.html }}
            />
            <Tags tags={post.frontmatter.tags} />
            <SocialShare post={post} />

            <Divider />
            <Row type="flex" justify="center">
              <Col xs={24} md={24}>
                <SubscriptionForm />
              </Col>
            </Row>

            <br />
            <br />

            <Divider />
            <Comments post={post} />

            <Divider />

            <h3
              style={{
                marginTop: '4rem',
                marginBottom: '4rem',
                textAlign: 'center',
                fontWeight: '800',
              }}
            >
              ALSO, YOU SHOULD READ THESE ARTICLES
            </h3>
            <Row
              type="flex"
              justify="space-between"
              gutter={{ xs: 0, sm: 0, md: 16, lg: 16 }}
            >
              {similarPosts.map((similarPost, i) => (
                <Col {...postsExcerptLayout} key={i}>
                  <PostExcerpt {...similarPost} />
                </Col>
              ))}
            </Row>
           
          </ContentContainer>
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
        slug
      }
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        tags
        slug
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
`
