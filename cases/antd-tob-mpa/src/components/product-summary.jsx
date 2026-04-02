import React from 'react';
import { Card, Col, Descriptions, Image, Row, Space, Tag, Typography } from 'antd';

export default function ProductSummary({ product }) {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={10}>
        <Card>
          <Image src={product.gallery[0]} alt={product.name} className="product-cover" />
          <Space wrap style={{ marginTop: 12 }}>
            {product.tags.map((tag) => (
              <Tag color="blue" key={tag}>
                {tag}
              </Tag>
            ))}
          </Space>
        </Card>
      </Col>
      <Col xs={24} xl={14}>
        <Card>
          <Typography.Title level={4}>{product.name}</Typography.Title>
          <Typography.Paragraph>{product.desc}</Typography.Paragraph>
          <Descriptions column={2} bordered size="small">
            <Descriptions.Item label="商品编码">{product.id}</Descriptions.Item>
            <Descriptions.Item label="品牌">{product.brand}</Descriptions.Item>
            <Descriptions.Item label="类目">{product.category}</Descriptions.Item>
            <Descriptions.Item label="评分">{product.rating}</Descriptions.Item>
            <Descriptions.Item label="基础价格">¥{product.price}</Descriptions.Item>
            <Descriptions.Item label="当前库存">{product.stock}</Descriptions.Item>
          </Descriptions>
        </Card>
      </Col>
    </Row>
  );
}
