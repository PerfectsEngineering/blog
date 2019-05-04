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
    span: 8,
  },
}

function ExcerptBody({ post }) {
  const title = post.frontmatter.title || post.fields.slug
  const maxHeight = '22rem'
  return (
    <div style={{ height: maxHeight, maxHeight, verticalAlign: 'middle' }}>
      <div style={{ margin: '1.5rem 0', fontWeight: 800, fontSize: '1rem' }}>
        <PostReadTime post={post} />
      </div>
      <h3 title={title} style={{ marginBottom: '2rem' }}>
        <Link style={{ boxShadow: 'none' }} to={post.fields.slug}>
          {truncate(title, { length: '55' })}
        </Link>
      </h3>
      <p className="post-excerpt">
        <span dangerouslySetInnerHTML={{ __html: post.excerpt }} />{' '}
        <Link to={post.fields.slug}>Read more</Link>
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
    <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
      {getFeatureImage(node)}
    </Link>
  )
  return (
    <Card
      key={node.fields.slug}
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
          <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
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
      <TagLink tag={firstTag}>{upperCase(firstTag)}</TagLink> .{' '}
      {upperCase(post.fields.readingTime.text)}
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
