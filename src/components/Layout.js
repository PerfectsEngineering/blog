import React from 'react'
import { Affix, Layout as AntLayout } from 'antd'

import { Header } from './Header'

const { Content, Footer } = AntLayout
const AntHeader = AntLayout.Header

export class Layout extends React.Component {
  render() {
    const { children } = this.props

    return (
      <AntLayout>
        <Affix>
          <AntHeader>
            <Header {...this.props} />
          </AntHeader>
        </Affix>
        <Content>
          {children}
        </Content>
        {/* <Footer>
          © {new Date().getFullYear()}, Perfects.Engineering
        </Footer> */}
      </AntLayout>
    )
  }
}
