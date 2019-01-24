import React from 'react'
import PropTypes from 'prop-types'
import { Link, graphql } from 'gatsby'

// Utilities
import kebabCase from 'lodash/kebabCase'
import { rhythm } from '../utils/typography'

// Components
import Layout from '../components/Layout'
import SEO from '../components/seo'
import Bio from '../components/Bio'

// Styles
import '../less/Tags.less'

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
    site: {
      siteMetadata: { title },
    },
  },
  location
}) => (
  <Layout location={location} title={title}>
    <SEO title="Tags" description="Post Tags/Categories" />
    <h1>List of Post Tags</h1>
    <div className="tags-container">
      {group.map(tag => (
        <Link to={`/tags/${kebabCase(tag.fieldValue)}/`}>
          <span className="tag" key={tag.fieldValue}>
            {tag.fieldValue} ({tag.totalCount})
          </span>
        </Link>
      ))}
      </div>
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
    allMarkdownRemark(
      limit: 2000
    ) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`