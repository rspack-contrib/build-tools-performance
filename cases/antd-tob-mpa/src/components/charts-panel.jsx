import React from 'react';
import { Card, Col, Row } from 'antd';
import { Line, Pie, Column, Radar } from '@ant-design/charts';

export default function ChartsPanel({ monthlySales, categoryShare, regionPerformance }) {
  const lineConfig = {
    data: monthlySales,
    xField: 'month',
    yField: 'value',
    smooth: true,
    point: { size: 4 },
    style: { lineWidth: 3 },
  };

  const pieConfig = {
    data: categoryShare,
    angleField: 'value',
    colorField: 'type',
    label: { text: 'type', position: 'outside' },
  };

  const columnConfig = {
    data: regionPerformance,
    xField: 'region',
    yField: 'revenue',
    label: { text: 'revenue' },
  };

  const radarData = regionPerformance.flatMap((item) => [
    { region: item.region, indicator: '营收指数', score: item.revenue / 2 },
    { region: item.region, indicator: '满意度', score: item.satisfaction },
    { region: item.region, indicator: '履约效率', score: item.delivery },
  ]);

  const radarConfig = {
    data: radarData,
    xField: 'indicator',
    yField: 'score',
    colorField: 'region',
    area: { style: { fillOpacity: 0.12 } },
  };

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} xl={12}>
        <Card title="月度销售趋势">
          <Line {...lineConfig} />
        </Card>
      </Col>
      <Col xs={24} xl={12}>
        <Card title="品类占比">
          <Pie {...pieConfig} />
        </Card>
      </Col>
      <Col xs={24} xl={12}>
        <Card title="区域营收对比">
          <Column {...columnConfig} />
        </Card>
      </Col>
      <Col xs={24} xl={12}>
        <Card title="区域能力雷达图">
          <Radar {...radarConfig} />
        </Card>
      </Col>
    </Row>
  );
}
