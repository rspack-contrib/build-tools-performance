import React from 'react';
import { Card, Table } from 'antd';

export default function ProductSkuTable({ skus }) {
  return (
    <Card title="SKU 列表">
      <Table
        rowKey="key"
        dataSource={skus}
        pagination={false}
        columns={[
          { title: '规格名称', dataIndex: 'name' },
          { title: 'SKU 编码', dataIndex: 'code' },
          { title: '单价', dataIndex: 'price', render: (v) => `¥${v}` },
          { title: '库存', dataIndex: 'stock' },
        ]}
      />
    </Card>
  );
}
