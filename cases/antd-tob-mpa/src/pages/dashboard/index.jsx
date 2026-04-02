import React from 'react';
import ReactDOM from 'react-dom/client';
import { Card, Col, List, Row, Statistic } from 'antd';
import AppLayout from '../../layouts/app-layout';
import PageHeader from '../../components/page-header';
import OverviewCards from '../../components/overview-cards';
import ChartsPanel from '../../components/charts-panel';
import {
  dashboardMetrics,
  monthlySales,
  categoryShare,
  regionPerformance,
} from '../../mock/data';
import '../../styles/global.css';

function DashboardPage() {
  return (
    <AppLayout title="ToB 运营中台" currentKey="dashboard">
      <PageHeader
        title="Dashboard"
        actionText="新建看板"
        breadcrumbItems={[{ title: '首页' }, { title: '运营看板' }]}
      />
      <OverviewCards metrics={dashboardMetrics} />
      <div className="section-gap" />
      <ChartsPanel
        monthlySales={monthlySales}
        categoryShare={categoryShare}
        regionPerformance={regionPerformance}
      />
      <div className="section-gap" />
      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card title="关键提醒">
            <List
              dataSource={[
                '有 12 个企业客户本周需续约，请安排回访。',
                '华东仓库存低于安全线的 SKU 共 7 个。',
                '退款工单平均处理时长升至 5.4 小时。',
              ]}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card title="本月目标完成度">
            <Statistic title="销售目标" value={79.2} precision={1} suffix="%" />
            <Statistic title="新客签约" value={61} suffix="家" style={{ marginTop: 16 }} />
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<DashboardPage />);
