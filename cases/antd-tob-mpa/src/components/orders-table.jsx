import React from 'react';
import { Card, Table, Tag, Space, Button } from 'antd';

const statusColorMap = {
  待支付: 'default',
  待发货: 'processing',
  运输中: 'blue',
  已完成: 'success',
  已取消: 'error',
};

export default function OrdersTable({ data }) {
  const columns = [
    { title: '订单号', dataIndex: 'id', width: 180, fixed: 'left' },
    { title: '客户', dataIndex: 'customer', width: 160 },
    { title: '区域', dataIndex: 'region', width: 100 },
    { title: '商品数量', dataIndex: 'count', width: 100 },
    { title: '订单金额', dataIndex: 'amount', width: 140, render: (v) => `¥${v}` },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (status) => <Tag color={statusColorMap[status]}>{status}</Tag>,
    },
    { title: '创建时间', dataIndex: 'createdAt', width: 180 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right',
      width: 180,
      render: () => (
        <Space>
          <Button type="link" size="small">查看</Button>
          <Button type="link" size="small">备注</Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 8, showSizeChanger: false }}
        scroll={{ x: 1200 }}
      />
    </Card>
  );
}
