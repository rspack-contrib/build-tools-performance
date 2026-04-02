import React from 'react';
import ReactDOM from 'react-dom/client';
import AppLayout from '../../layouts/app-layout';
import PageHeader from '../../components/page-header';
import OverviewCards from '../../components/overview-cards';
import { dashboardMetrics } from '../../mock/data';
import '../../styles/global.css';

function FeatureDuplicate5Page() {
  return (
    <AppLayout title="功能副本 5" currentKey="feature-duplicate-5">
      <PageHeader
        title="功能副本 5"
        breadcrumbItems={[{ title: '首页' }, { title: '功能副本 5' }]}
      />
      <OverviewCards metrics={dashboardMetrics} />
    </AppLayout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<FeatureDuplicate5Page />);
