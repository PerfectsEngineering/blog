import React from 'react'
import { Button, Col, Form, Input, Row } from 'antd'

const FormItem = Form.Item;

class SubscriptionForm extends React.Component {
  constructor(props) {
    super(props);

    this.onSubmitSubscription = this.onSubmitSubscription.bind(this);
  }

  onSubmitSubscription(_ev) {
    // not doing anything but required for antd form to submit
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Form
        action="https://engineering.us18.list-manage.com/subscribe/post?u=873b69653f5285d85916d6c66&amp;id=3d889e9f35"
        method="post"
        onSubmit={this.onSubmitSubscription}
      >
        <div>Get updates about new articles.</div>
        <Row>
          <Col span={24}>
          <FormItem>
            {getFieldDecorator('EMAIL', {
              type: 'email'
            })(
              <Input name="EMAIL" placeholder="Enter your email address" />
            )}
          
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
      </Form>
    )
  }
}

export default Form.create()(SubscriptionForm);