import React from 'react';
import ReactDOM from 'react-dom/client';
import AppLayout from '../../layouts/app-layout';
import PageHeader from '../../components/page-header';
import OverviewCards from '../../components/overview-cards';
import { dashboardMetrics } from '../../mock/data';
import '../../styles/global.css';

function NewFeaturePage() {
  return (
    <AppLayout title="新功能页面" currentKey="new-feature">
      <PageHeader
        title="新功能"
        breadcrumbItems={[{ title: '首页' }, { title: '新功能' }]}
      />
      <OverviewCards metrics={dashboardMetrics} />
    </AppLayout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<NewFeaturePage />);
