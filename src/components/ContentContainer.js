import React from 'react'
import { Col, Row } from 'antd'

const defaultLayout = {
  sm: {
    span: 24,
  },
  md: {
    span: 20,
    offset: 2,
  },
  lg: {
    span: 18,
    offset: 3,
  },
}

export function ContentContainer({ children, col, row }) {
  const colLayout = col || defaultLayout
  return (
    <Row type="flex" {...row}>
      <Col {...colLayout}>{children}</Col>
    </Row>
  )
}
