import React from 'react';
import get from 'lodash/get'

import '../less/Tags.less';

function Tags(props) {
 return (<div className="tags-container">
   {get(props, 'tags', []).map(tag => (<a href=""><span className="tag">
     #{tag}
     </span></a>)
    )}
 </div>)
}

export default Tags