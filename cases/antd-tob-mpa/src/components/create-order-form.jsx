import React from 'react';
import { Card, DatePicker, Form, Input, Select, Button, Row, Col, Space } from 'antd';

export default function CreateOrderForm({ defaults }) {
  return (
    <Card title="客户与收货信息">
      <Form layout="vertical" initialValues={defaults}>
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="customerName" label="客户名称">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="contact" label="联系人">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="phone" label="联系电话">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="region" label="所属区域">
              <Select
                options={['华东', '华南', '华北', '华中', '西南'].map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="address" label="详细地址">
              <Input.TextArea rows={2} />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="payMethod" label="支付方式">
              <Select
                options={['对公转账', '账期结算', '在线支付'].map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="deliveryDate" label="期望交付日期">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Space>
          <Button type="primary">提交订单</Button>
          <Button>保存草稿</Button>
        </Space>
      </Form>
    </Card>
  );
}
