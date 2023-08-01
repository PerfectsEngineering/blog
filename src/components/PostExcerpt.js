import React, { Fragment } from 'react'
import { Link } from 'gatsby'
import first from 'lodash/first'
import upperCase from 'lodash/upperCase'
import truncate from 'lodash/truncate'

import { Card, Col, Icon, Row } from 'antd'

// Utility
import { getFeatureImage } from '../utils/posts'

// Components
import { TagLink } from '../components/Tags'

const featuredPostExcerptLayout = {
  xs: {
    span: 24,
  },
  sm: {
    span: 24,
  },
  md: {
    span: 24,
  },
  lg: {
    span: 11,
  },
}

export const postsExcerptLayout = {
  sm: {
    span: 24,
  },
  md: {
    span: 12,
  },
  lg: {
    span: 12,
  },
}

function ExcerptBody({ post }) {
  const title = post.frontmatter.title || post.frontmatter.slug
  const maxHeight = '22rem'
  return (
    <div style={{ height: maxHeight, maxHeight, verticalAlign: 'middle' }}>
      <div style={{ margin: '1.5rem 0', fontWeight: 800, fontSize: '1rem' }}>
        <PostReadTime post={post} />
      </div>
      <h3 title={title} style={{ marginBottom: '2rem' }}>
        <Link style={{ boxShadow: 'none' }} to={post.frontmatter.slug}>
          {truncate(title, { length: '55' })}
        </Link>
      </h3>
      <p className="post-excerpt">
        <span dangerouslySetInnerHTML={{ __html: post.excerpt }} />{' '}
        <Link to={post.frontmatter.slug}>Read more</Link>
      </p>

      <PostDate post={post} />
    </div>
  )
}

/**
 * Node is a markdown post node.
 *
 * @param {{ node: Ojbect }} props
 */
export function PostExcerpt({ node }) {
  const cover = (
    <Link style={{ boxShadow: `none` }} to={node.frontmatter.slug}>
      {getFeatureImage(node, { height: '20rem' })}
    </Link>
  )
  return (
    <Card
      key={node.frontmatter.slug}
      bordered={false}
      cover={cover}
      style={{ marginBottom: '2rem' }}
    >
      <ExcerptBody post={node} />
    </Card>
  )
}

export function FeaturedPostExcerpt({ node }) {
  return (
    <Card
      key={node.fields.slug}
      style={{ marginBottom: '2rem' }}
      bordered={false}
      bodyStyle={{
        padding: '0 0',
      }}
    >
      <Row type="" className="featured-post">
        <Col {...featuredPostExcerptLayout}>
          <Link style={{ boxShadow: `none` }} to={node.frontmatter.slug}>
            {getFeatureImage(node, { height: '30rem' })}
          </Link>
        </Col>
        <Col {...featuredPostExcerptLayout} style={{ padding: '2.5rem' }}>
          <ExcerptBody post={node} />
        </Col>
      </Row>
    </Card>
  )
}

export function PostReadTime({ post }) {
  const firstTag = first(post.frontmatter.tags)
  return (
    <span className="post-read-time">
      <TagLink tag={firstTag}>{upperCase(firstTag)}</TagLink> 
    </span>
  )
}

export function PostDate({ post }) {
  return (
    <Fragment>
      <Icon type="calendar" /> <small>{post.frontmatter.date}</small>
    </Fragment>
  )
}
