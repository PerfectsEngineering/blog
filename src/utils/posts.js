import React from 'react';
import Img from 'gatsby-image';
import get from 'lodash/get';
import trimStart from 'lodash/trimStart';

import defaultPostImage from '../img/black-image-icons.jpg';
import { withBaseUrl } from './app';

const style = {
  width: '100%',
  aspectRatio: '7/3',
}

export function getFeatureImage(postNode, extraStyle = {}) {
  const image = get(postNode, 'frontmatter.featureImage');
  if (image) {
    return <Img
    {...image.childImageSharp}
    alt={`${get(postNode, 'frontmatter.title')}`}
    style={{
      ...style,
      ...extraStyle
    }}
  />;
  }

  return <img 
    src={defaultPostImage}
    alt={`${get(postNode, 'frontmatter.title')}`}
    style={{
      ...style,
      ...extraStyle
    }} 
  />
}

export function getPostUrl(postNode) {
  return withBaseUrl(`/${trimStart(postNode.frontmatter.slug, '/')}`);
}
