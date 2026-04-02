import React from 'react';
import { Card, Col, Row, Statistic, Tag } from 'antd';

export default function OverviewCards({ metrics }) {
  return (
    <Row gutter={[16, 16]}>
      {metrics.map((metric) => (
        <Col xs={24} sm={12} xl={6} key={metric.title}>
          <Card>
            <Statistic
              title={metric.title}
              value={metric.value}
              prefix={metric.prefix}
              suffix={metric.suffix}
            />
            <Tag color={metric.trend.startsWith('+') ? 'green' : 'orange'}>
              {metric.trend}
            </Tag>
          </Card>
        </Col>
      ))}
    </Row>
  );
}
