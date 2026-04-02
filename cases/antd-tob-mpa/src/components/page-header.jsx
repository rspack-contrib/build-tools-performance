import React from 'react';
import { Breadcrumb, Button, Space, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

export default function PageHeader({ title, breadcrumbItems, actionText }) {
  return (
    <div className="page-header">
      <Space direction="vertical" size={8} style={{ width: '100%' }}>
        <Breadcrumb items={breadcrumbItems} />
        <div className="page-header-main">
          <Typography.Title level={3} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
          {actionText ? (
            <Button type="primary" icon={<PlusOutlined />}>
              {actionText}
            </Button>
          ) : null}
        </div>
      </Space>
    </div>
  );
}
