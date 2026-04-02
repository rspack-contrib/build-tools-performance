import React from 'react';
import { Card, Table, Typography } from 'antd';

export default function CartPreview({ items }) {
  const total = items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <Card title="订单商品清单">
      <Table
        rowKey="key"
        dataSource={items}
        pagination={false}
        columns={[
          { title: '商品', dataIndex: 'name' },
          { title: 'SKU', dataIndex: 'sku', width: 150 },
          { title: '数量', dataIndex: 'qty', width: 90 },
          { title: '单价', dataIndex: 'price', width: 120, render: (v) => `¥${v}` },
          {
            title: '小计',
            key: 'subtotal',
            width: 120,
            render: (_, row) => `¥${row.qty * row.price}`,
          },
        ]}
      />
      <Typography.Title level={4} style={{ textAlign: 'right', marginTop: 16 }}>
        合计：¥{total}
      </Typography.Title>
    </Card>
  );
}
