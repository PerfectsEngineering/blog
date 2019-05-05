import React from 'react'
import Disqus from 'disqus-react'
import { getPostUrl } from '../utils/posts'

/**
 * Component to display comments for a particular post
 * For now it loads discuss
 *
 */
export const Comments = ({ post }) => {
  const disqusShortname = 'perfects-engineering'
  const disqusConfig = {
    url: getPostUrl(post),
    identifier: post.fields.slug,
    title: post.frontmatter.title,
  }

  return (
    <Disqus.DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
  )
}
