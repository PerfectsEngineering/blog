import React from 'react'
import { Layout as AntLayout } from 'antd'

import { Header } from './Header'
import { rhythm } from '../utils/typography'

const { Content, Footer } = AntLayout
const AntHeader = AntLayout.Header

export class Layout extends React.Component {
  render() {
    const { children } = this.props

    return (
      <AntLayout
        style={{
          marginLeft: `auto`,
          marginRight: `auto`,
          maxWidth: rhythm(24),
          padding: `${rhythm(1.5)} ${rhythm(3 / 4)}`,
        }}
      >
        <AntHeader>
          <Header {...this.props} />
        </AntHeader>
        <Content>
        {children}
        </Content>
        <Footer>
          © {new Date().getFullYear()}, Built with
          {` `}
          <a href="https://www.gatsbyjs.org">Gatsby</a>
        </Footer>
      </AntLayout>
    )
  }
}
