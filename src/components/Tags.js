import React from 'react';
import get from 'lodash/get'
import kebabCase from "lodash/kebabCase"

import { Link } from "gatsby"

import '../less/Tags.less';

export function Tags(props) {
 return (<div className="tags-container">
   {get(props, 'tags', []).map(tag => (<TagLink tag={tag}><span className="tag">
     #{tag}
     </span></TagLink>)
    )}
 </div>);
}

export function TagLink({ children, tag}) {
  return (
    <Link to={`/tags/${kebabCase(tag)}`}>
      {children}
    </Link>
  );
}