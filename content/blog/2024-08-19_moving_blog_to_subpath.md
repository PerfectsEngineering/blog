---
title: I moved my Blog from Subdomain to Subpath. Here is how I did it
date: 2024-08-19T09:00:00.00Z
tags:
  - tutorial
slug: /moving_blog_to_subpath
featureImage: ../assets/2024_03_09/banner.jpg
---
As a software engineer, I'm always looking for ways to optimize my online presence. Recently, I decided to make a significant change to my website structure: moving my blog from a subdomain (`blog.perfects.engineering`) to a subpath (`perfects.engineering/blog`) where you are reading this article now. 
In this article, I'll share why I made this decision and the technical steps I took to implement it.

## Why Make the Move?

My blog at `blog.perfects.engineering` has been gaining traction, attracting a good amount of traffic. However, my main website at `perfects.engineering` wasn't seeing the same level of engagement. With plans to launch additional content in the future, I wanted to consolidate everything under the same top-level domain. This move would allow me to:

1. Centralize my content
2. Improve overall domain authority
3. Simplify future content expansion

## The Migration Process

### Step 1: Planning the Move

Before diving into the technical details, I had to plan the migration carefully. My setup was as follows:

- Main website: Static HTML, CSS, and JavaScript
- Blog: Gatsby-powered static site
- Hosting: Both sites deployed on Netlify
- Source code: Available on GitHub (https://github.com/perfectsengineering)

### Step 2: Configuring Nginx

The core of this migration involved setting up Nginx to handle the routing. Here's the configuration I used:

```nginx
location /blog/ {
    if ($request_uri ~ ^/blog/(.+)/$) {
        return 301 $scheme://$host/blog/$1;
    }

    rewrite ^/blog/(.*) /$1 break;
    proxy_pass https://perfects-engineering-blog.netlify.app;
    proxy_set_header Host perfects-engineering-blog.netlify.app;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

This configuration does a few key things:

1. Redirects requests with trailing slashes to their non-trailing slash equivalents
2. Removes the `/blog` prefix when proxying to the Netlify-hosted Gatsby site
3. Sets the appropriate headers for the proxy request

### Step 3: Handling Gatsby's Routing

Initially, I tried to use only URL rewrites to redirect requests to the `/blog` subpath. However, I encountered 404 errors because either Gatsby or Netlify was redirecting back to the base URL of the domain.

To fix this, I updated the Gatsby build configuration to use the `PREFIX_PATHS` flag. This ensures that Gatsby builds all its content on the `/blog/` path. Here's how I modified my Gatsby configuration:

```javascript
// In gatsby-config.js
module.exports = {
  pathPrefix: `/blog`,
  // ... other configurations
}
```

And then in my build command:

```bash
gatsby build --prefix-paths
```

This change allowed me to simply route the paths to the domain without any additional URL manipulation.

### Step 4: Testing and Deployment

Before going live, I thoroughly tested the new setup to ensure:

1. All existing blog posts were accessible at their new URLs
2. Internal links within the blog were updated to the new structure
3. The main website and blog coexisted without conflicts

Once testing was complete, I deployed the changes and monitored the site for any issues.

## Conclusion

Moving my blog from a subdomain to a subpath was a strategic decision to consolidate my online presence. While it presented some technical challenges, particularly with routing and Gatsby configuration, the end result is a more cohesive and manageable website structure.

This migration sets the stage for future content expansion and should contribute to improved SEO performance across my entire domain. If you're considering a similar move, remember to plan carefully, test thoroughly, and be prepared to dive into the intricacies of your web server and static site generator configurations.

Happy coding, and may your websites always return 200 OK!