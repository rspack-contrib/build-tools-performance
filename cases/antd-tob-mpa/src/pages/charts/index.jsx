import React from 'react';
import ReactDOM from 'react-dom/client';
import { Card, Col, Row, Timeline } from 'antd';
import AppLayout from '../../layouts/app-layout';
import PageHeader from '../../components/page-header';
import ChartsPanel from '../../components/charts-panel';
import { monthlySales, categoryShare, regionPerformance } from '../../mock/data';
import '../../styles/global.css';

function ChartsPage() {
  return (
    <AppLayout title="数据可视化中心" currentKey="charts">
      <PageHeader
        title="图表分析"
        breadcrumbItems={[{ title: '首页' }, { title: '图表中心' }]}
      />
      <ChartsPanel
        monthlySales={monthlySales}
        categoryShare={categoryShare}
        regionPerformance={regionPerformance}
      />
      <div className="section-gap" />
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={14}>
          <Card title="数据口径说明">
            <Timeline
              items={[
                { children: '销售额：按支付完成时间统计，含税。' },
                { children: '满意度：取近 30 天工单评价均值。' },
                { children: '履约效率：从出库到签收的标准化得分。' },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} xl={10}>
          <Card title="看板刷新策略">
            图表每 5 分钟自动刷新一次，峰值时段（09:00-20:00）启用秒级增量推送（此项目为 mock 数据展示）。
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ChartsPage />);
