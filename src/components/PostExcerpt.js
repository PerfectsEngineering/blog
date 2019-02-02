import React from 'react';
import { Link } from 'gatsby';
import Img from 'gatsby-image';

// Utility
import { rhythm } from '../utils/typography';

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
    <div key={node.fields.slug} style={{ padding: '1rem', border: 'black 1px solid', marginBottom: '2rem' }}>
      <h3
        style={{
          marginBottom: rhythm(1 / 4),
          marginTop: 0
        }}
      >
        {node.frontmatter.featureImage && <Img {...node.frontmatter.featureImage.childImageSharp} style={{marginBottom: '1rem'}} />}
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