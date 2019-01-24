import React from 'react'
import { Link } from 'gatsby'

// Utility
import { rhythm } from '../utils/typography'

// Components
import Tags from '../components/Tags';

/**
 * Node is a markdown post node. 
 * 
 * @param {{ node: Ojbect }} props
 */
export default function PostExcerpt({ node }) {
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
      <Tags tags={node.frontmatter.tags} />
    </div>
  )
}