import React from 'react';
import get from 'lodash/get'
import kebabCase from "lodash/kebabCase"

import { Link } from "gatsby"

import '../less/Tags.less';

function Tags(props) {
 return (<div className="tags-container">
   {get(props, 'tags', []).map(tag => (<Link to={`/tags/${kebabCase(tag)}`}><span className="tag">
     #{tag}
     </span></Link>)
    )}
 </div>)
}

export default Tags