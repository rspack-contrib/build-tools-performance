import React from 'react';
import ReactDOM from 'react-dom/client';
import { Card, Col, Row } from 'antd';
import AppLayout from '../../layouts/app-layout';
import PageHeader from '../../components/page-header';
import ProductSummary from '../../components/product-summary';
import ProductSkuTable from '../../components/product-sku-table';
import { product } from '../../mock/data';
import '../../styles/global.css';

function ProductDetailPage() {
  return (
    <AppLayout title="商品中心" currentKey="product-detail">
      <PageHeader
        title="商品详情页"
        breadcrumbItems={[{ title: '首页' }, { title: '商品管理' }, { title: '详情' }]}
      />
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <ProductSummary product={product} />
        </Col>
        <Col span={24}>
          <ProductSkuTable skus={product.skus} />
        </Col>
        <Col xs={24} xl={8}>
          <Card title="经营数据">累计销量：{product.sold}，近 7 日访客转化率：12.8%。</Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card title="售后概况">近 30 天售后申请 12 单，平均处理时长 3.2 小时。</Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card title="采购建议">建议补货 100 台增强版，避免大促期间缺货。</Card>
        </Col>
      </Row>
    </AppLayout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ProductDetailPage />);
