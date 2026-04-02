import React from 'react';
import ReactDOM from 'react-dom/client';
import { Col, Row, Card, Steps } from 'antd';
import AppLayout from '../../layouts/app-layout';
import PageHeader from '../../components/page-header';
import CreateOrderForm from '../../components/create-order-form';
import CartPreview from '../../components/cart-preview';
import { cartItems, orderFormDefaults } from '../../mock/data';
import '../../styles/global.css';

function CreateOrderPage() {
  return (
    <AppLayout title="下单中心" currentKey="create-order">
      <PageHeader
        title="下单页"
        breadcrumbItems={[{ title: '首页' }, { title: '订单管理' }, { title: '创建订单' }]}
      />
      <Card style={{ marginBottom: 16 }}>
        <Steps
          current={1}
          items={[{ title: '选择商品' }, { title: '填写信息' }, { title: '确认支付' }, { title: '下单完成' }]}
        />
      </Card>
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <CreateOrderForm defaults={orderFormDefaults} />
        </Col>
        <Col xs={24} xl={10}>
          <CartPreview items={cartItems} />
        </Col>
      </Row>
    </AppLayout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<CreateOrderPage />);
