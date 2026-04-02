import React from 'react';
import ReactDOM from 'react-dom/client';
import { Col, Row } from 'antd';
import AppLayout from '../../layouts/app-layout';
import PageHeader from '../../components/page-header';
import OverviewCards from '../../components/overview-cards';
import OrdersFilterForm from '../../components/orders-filter-form';
import OrdersTable from '../../components/orders-table';
import { dashboardMetrics, orderStatusOptions, orders } from '../../mock/data';
import '../../styles/global.css';

function OrdersPage() {
  return (
    <AppLayout title="订单运营中心" currentKey="orders">
      <PageHeader
        title="订单页"
        actionText="新建订单"
        breadcrumbItems={[{ title: '首页' }, { title: '订单管理' }]}
      />
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <OverviewCards metrics={dashboardMetrics.slice(0, 3)} />
        </Col>
        <Col span={24}>
          <OrdersFilterForm statusOptions={orderStatusOptions} />
        </Col>
        <Col span={24}>
          <OrdersTable data={orders} />
        </Col>
      </Row>
    </AppLayout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<OrdersPage />);
