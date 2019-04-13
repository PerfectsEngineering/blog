import React from 'react';
import { Col, Row } from 'antd';

const layout = {
  sm: {
    span: 24
  },
  md: {
    span: 20,
    offset: 1,
  },
  lg: {
    span: 18,
    offset: 2
  }
};

export function ContentContainer({ children }) {
  return (
    <Row type="flex">
      <Col {...layout}>
        {children}
      </Col>
    </Row>
  );
}