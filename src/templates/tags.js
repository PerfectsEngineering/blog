import React from 'react'
import { graphql } from 'gatsby'
import _ from 'lodash'

import Bio from '../components/Bio'
import Layout from '../components/Layout'
import SEO from '../components/seo'
import PostExcerpt from '../components/PostExcerpt';

class TagPosts extends React.Component {
  render() {
    const { data, pageContext } = this.props
    const { tag } = pageContext
    const siteTitle = data.site.siteMetadata.title
    const posts = _.get(data, 'allMarkdownRemark.edges', []);
    const totalCount = data.allMarkdownRemark.totalCount
    const tagHeader = `${totalCount} post${
      totalCount === 1 ? "" : "s"
    } tagged with "${tag}"`

    return (
      <Layout location={this.props.location} title={siteTitle}>
        <SEO
          title={`Posts tagged ${tag}`}
          description={tagHeader}
        />
        <h1>{tagHeader}</h1>
        <Bio />
        {posts.map(PostExcerpt)}
      </Layout>
    )
  }
}

export default TagPosts

export const pageQuery = graphql`
  query($tag: String) {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(
      limit: 2000
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            tags
          }
        }
      }
    }
  }
`










// import React from "react"

// // Components
// import { Link, graphql } from "gatsby"

// const Tags = ({ pageContext, data }) => {
//   const { tag } = pageContext
//   const { edges, totalCount } = data.allMarkdownRemark
//   const tagHeader = `${totalCount} post${
//     totalCount === 1 ? "" : "s"
//   } tagged with "${tag}"`

//   return (
//     <div>
//       <h1>{tagHeader}</h1>
//       <ul>
//         {edges.map(({ node }) => {
//           const { title } = node.frontmatter
//           const path = `/${node.fields.slug}`
//           return (
//             <li key={path}>
//               <Link to={path}>{title}</Link>
//             </li>
//           )
//         })}
//       </ul>
//       {/*
//               This links to a page that does not yet exist.
//               We'll come back to it!
//             */}
//       <Link to="/tags">All tags</Link>
//     </div>
//   )
// }

// export default Tags

// export const pageQuery = graphql`
//   query($tag: String) {
//     allMarkdownRemark(
//       limit: 2000
//       sort: { fields: [frontmatter___date], order: DESC }
//       filter: { frontmatter: { tags: { in: [$tag] } } }
//     ) {
//       totalCount
//       edges {
//         node {
//           fields {
//             slug
//           }
//           frontmatter {
//             title
//           }
//         }
//       }
//     }
//   }
// `