import React from 'react';
import { Layout, Menu, Avatar, Badge, Typography, Space } from 'antd';

const { Header, Sider, Content } = Layout;

const navItems = [
  {
    key: 'dashboard',
    icon: '📊',
    label: <a href="./dashboard.html">Dashboard</a>,
  },
  {
    key: 'orders',
    icon: '🧾',
    label: <a href="./orders.html">订单页</a>,
  },
  {
    key: 'product-detail',
    icon: '📦',
    label: <a href="./product-detail.html">商品详情页</a>,
  },
  {
    key: 'create-order',
    icon: '✍️',
    label: <a href="./create-order.html">下单页</a>,
  },
  {
    key: 'charts',
    icon: '📈',
    label: <a href="./charts.html">图表页</a>,
  },
];

export default function AppLayout({ title, currentKey, children }) {
  return (
    <Layout className="app-layout">
      <Sider width={220} className="app-sider">
        <div className="logo">ToB Admin Console</div>
        <Menu
          mode="inline"
          selectedKeys={[currentKey]}
          items={navItems}
          className="app-menu"
        />
      </Sider>
      <Layout>
        <Header className="app-header">
          <Typography.Title level={4} style={{ margin: 0 }}>
            {title}
          </Typography.Title>
          <Space size={18}>
            <Badge count={5} size="small">
              <span className="header-icon">🔔</span>
            </Badge>
            <Space>
              <Avatar size="small">管</Avatar>
              <Typography.Text>运营管理员</Typography.Text>
            </Space>
          </Space>
        </Header>
        <Content className="page-content">{children}</Content>
      </Layout>
    </Layout>
  );
}
