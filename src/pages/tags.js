import React from 'react'
import { Row, Col } from 'antd'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'

// Utilities
import kebabCase from 'lodash/kebabCase'
import { rhythm } from '../utils/typography'

// Components
import { Layout } from '../components/Layout'
import { SEO } from '../components/seo'
import { Bio } from '../components/Bio'

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
  location,
}) => (
  <Layout location={location} title={title}>
    <SEO title="Tags" description="Post Tags/Categories" />
    <Row type="flex">
      <Col span={20} offset={1}>
        <h1 style={{ textAlign: 'center' }} >List of Post Tags</h1>
        <div className="tags-container">
          {group.map(tag => (
            <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
              <span className="tag" key={tag.fieldValue}>
                {tag.fieldValue} ({tag.totalCount})
              </span>
            </Link>
          ))}
        </div>  
      </Col>
    </Row>
    
    <hr
      style={{
        marginBottom: rhythm(1),
      }}
    />
    <Bio />
  </Layout>
)

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string.isRequired,
      }),
    }),
  }),
}

export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 200000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`
