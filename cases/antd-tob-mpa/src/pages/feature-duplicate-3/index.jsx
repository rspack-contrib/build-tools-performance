import React from 'react';
import ReactDOM from 'react-dom/client';
import AppLayout from '../../layouts/app-layout';
import PageHeader from '../../components/page-header';
import OverviewCards from '../../components/overview-cards';
import { dashboardMetrics } from '../../mock/data';
import '../../styles/global.css';

function FeatureDuplicate3Page() {
  return (
    <AppLayout title="功能副本 3" currentKey="feature-duplicate-3">
      <PageHeader
        title="功能副本 3"
        breadcrumbItems={[{ title: '首页' }, { title: '功能副本 3' }]}
      />
      <OverviewCards metrics={dashboardMetrics} />
    </AppLayout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<FeatureDuplicate3Page />);
