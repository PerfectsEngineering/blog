import React, { Fragment } from 'react';
import { Link } from 'gatsby';
import first from 'lodash/first';
import upperCase from 'lodash/upperCase';
import truncate from 'lodash/truncate';

import { Card, Col, Icon, Row } from 'antd';

// Utility
import { getFeatureImage } from '../utils/posts';

// Components
import { TagLink } from '../components/Tags';
 
const featuredPostExcerptLayout = {
  sm: {
    span: 24
  },
  md: {
    span: 24,
  },
  lg: {
    span: 11
  }
};

export const postsExcerptLayout = {
  sm: {
    span: 24
  },
  md: {
    span: 12,
  },
  lg: {
    span: 8
  }
};

function ExcerptBody({ post }) {
  const title = post.frontmatter.title || post.fields.slug;
  const maxHeight = '20rem';
  return (
    <div style={{ height: maxHeight, maxHeight, verticalAlign: 'middle' }}>
      <div style={{ margin: '1.5rem 0', fontWeight: 800, fontSize: '1rem' }}>
        <PostReadTime post={post} />
      </div>
      <h3 title={title} style={{ marginBottom: '2rem' }}> 
        {truncate(title, { length: '55' })}
      </h3>
      <p dangerouslySetInnerHTML={{ __html: post.excerpt }} />
      <PostDate post={post} />
    </div>
  );
}

/**
 * Node is a markdown post node. 
 * 
 * @param {{ node: Ojbect }} props
 */
export function PostExcerpt({ node }) {
  
  return (
    <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
      <Card
        key={node.fields.slug}
        bordered={false}
        cover={getFeatureImage(node)}
        style={{marginBottom: '2rem' }}
        hoverable="true"
      >
        <ExcerptBody post={node} />
      </Card>
    </Link>
  )
}

export function FeaturedPostExcerpt({ node }) {
  return (
    <Link style={{ boxShadow: `none` }} to={node.fields.slug}>
      <Card
        key={node.fields.slug}
        style={{marginBottom: '2rem' }}
        bordered={false}
        bodyStyle={{
          padding: '0 0'
        }}
        hoverable="true"
      >
        <Row type="flex" className="featured-post">
          <Col {...featuredPostExcerptLayout}>
            {getFeatureImage(node, { height: '30rem' })}
          </Col>
          <Col
            {...featuredPostExcerptLayout}
            style={{ padding: '2.5rem' }}
          >
            <ExcerptBody post={node} />
          </Col>
        </Row>      
      </Card>
    </Link>
  )
}

export function PostReadTime({ post }) {
  const firstTag = first(post.frontmatter.tags);
  return (
    <Fragment className='post-read-time'>
      <TagLink tag={firstTag}>{upperCase(firstTag)}</TagLink> . {upperCase(post.fields.readingTime.text)}
    </Fragment>
  );
}

export function PostDate({ post }) {
  return (
    <Fragment>
      <Icon type="calendar" /> <small>{post.frontmatter.date}</small>
    </Fragment>
  );
}