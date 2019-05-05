import React from 'react'
import { Col, Row } from 'antd'
import {
  FacebookShareButton,
  FacebookIcon,
  LinkedinShareButton,
  LinkedinIcon,
  RedditShareButton,
  RedditIcon,
  TwitterShareButton,
  TwitterIcon,
} from 'react-share'
import { getPostUrl } from '../utils/posts'

/**
 * Component to build relevant social media share button for a post
 *
 */
export const SocialShare = ({ post }) => {
  const url = getPostUrl(post)
  const message = `I just read this article '${
    post.frontmatter.title
  }', you should read it too`
  return (
    <Row type="flex" justify="end">
      <Col span={24} style={{ textAlign: 'end' }}>
        Share this article:
        <TwitterShareButton url={url} title={message}>
          <TwitterIcon size={32} round={true} />
        </TwitterShareButton>
        <FacebookShareButton url={url} quote={message}>
          <FacebookIcon size={32} round={true} />
        </FacebookShareButton>
        <LinkedinShareButton url={url} title={post.frontmatter.title} description={post.excerpt}>
          <LinkedinIcon size={32} round={true} />
        </LinkedinShareButton>
        <RedditShareButton url={url} title={message}>
          <RedditIcon size={32} round={true} />
        </RedditShareButton>
      </Col>
    </Row>
  )
}
