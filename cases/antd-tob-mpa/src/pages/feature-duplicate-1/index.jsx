import React from 'react';
import ReactDOM from 'react-dom/client';
import AppLayout from '../../layouts/app-layout';
import PageHeader from '../../components/page-header';
import OverviewCards from '../../components/overview-cards';
import { dashboardMetrics } from '../../mock/data';
import '../../styles/global.css';

function FeatureDuplicate1Page() {
  return (
    <AppLayout title="功能副本 1" currentKey="feature-duplicate-1">
      <PageHeader
        title="功能副本 1"
        breadcrumbItems={[{ title: '首页' }, { title: '功能副本 1' }]}
      />
      <OverviewCards metrics={dashboardMetrics} />
    </AppLayout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<FeatureDuplicate1Page />);
