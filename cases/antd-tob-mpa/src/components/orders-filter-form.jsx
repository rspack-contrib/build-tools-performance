import React from 'react';
import { Card, Form, Input, Select, DatePicker, Space, Button } from 'antd';

export default function OrdersFilterForm({ statusOptions }) {
  return (
    <Card>
      <Form layout="inline" initialValues={{ status: '全部' }}>
        <Form.Item name="keyword" label="关键词">
          <Input placeholder="订单号 / 客户名" allowClear style={{ width: 220 }} />
        </Form.Item>
        <Form.Item name="status" label="状态">
          <Select style={{ width: 140 }} options={statusOptions.map((s) => ({ label: s, value: s }))} />
        </Form.Item>
        <Form.Item name="dateRange" label="日期">
          <DatePicker.RangePicker />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary">查询</Button>
            <Button>重置</Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}
