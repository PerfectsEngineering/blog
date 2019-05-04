import React from 'react';
import get from 'lodash/get'
import kebabCase from "lodash/kebabCase"

import { Link } from "gatsby"

export function Tags(props) {
 return (<div className="tags-container">
   {get(props, 'tags', []).map(tag => (<TagLink key={tag} tag={tag}><span className="tag">
     #{tag}
     </span></TagLink>)
    )}
 </div>);
}

export function TagLink({ children, tag}) {
  return (
    <Link to={`/tags/${kebabCase(tag)}`} style={{color: '#73D9B1'}}>
      {children}
    </Link>
  );
}