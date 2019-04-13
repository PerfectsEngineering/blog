import React from 'react';
import { Link } from 'gatsby';

import { Card, Col, Icon, Row } from 'antd';

// Utility
import { getFeatureImage } from '../utils/posts';

// Components
import { Tags } from '../components/Tags';
 
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

function ExcerptBody({ post }) {
  const title = post.frontmatter.title || post.fields.slug;
  const maxHeight = '20rem';
  return (
    
    <div style={{ height: maxHeight, maxHeight, verticalAlign: 'middle' }}>
      <h3> 
        
          {title}
        
      </h3>
      <p dangerouslySetInnerHTML={{ __html: post.excerpt }} />
      <Icon type="calendar" /> <small>{post.frontmatter.date}</small>
      {/* <Tags tags={post.frontmatter.tags} /> */}
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
        <Row type="flex">
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