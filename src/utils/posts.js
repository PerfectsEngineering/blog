import React from 'react';
import Img from 'gatsby-image';
import get from 'lodash/get';

import defaultPostImage from '../img/black-image-icons.jpg';

const style = {
  width: '100%',
  height: '20rem'
}

export function getFeatureImage(postNode, extraStyle = {}) {
  const image = get(postNode, 'frontmatter.featureImage');
  if (image) {
    return <Img
    {...postNode.frontmatter.featureImage.childImageSharp}
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
