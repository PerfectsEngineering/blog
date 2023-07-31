import React from 'react'
import { Button, Col, Form, Input, Row } from 'antd'

const FormItem = Form.Item

export function SubscriptionForm() {
  return (
    <form
      action="https://engineering.us18.list-manage.com/subscribe/post?u=873b69653f5285d85916d6c66&amp;id=3d889e9f35"
      method="post"
    >
      <div style={{ marginBottom: '1rem' }}>Get updates about new articles:</div>
      <Row>
        <Col span={24}>
          <FormItem name="email" type="email">
            <Input name="EMAIL" placeholder="Enter your email address" type='email' />
          </FormItem>
        </Col>
      </Row>
      <input
        type="text"
        name="b_873b69653f5285d85916d6c66_3d889e9f35"
        tabIndex="-1"
        value=""
        readOnly
        hidden
      />
      <Button type="primary" htmlType="submit" style={{ float: 'right' }}>
        Subscribe
      </Button>
    </form>
  )
}

export default SubscriptionForm
