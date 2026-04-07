import React from 'react';
import ReactDOM from 'react-dom/client';
import { Card, Col, Row, Typography, Tag, List, Alert, Descriptions, Divider } from 'antd';
import AppLayout from '../../layouts/app-layout';
import PageHeader from '../../components/page-header';
import OverviewCards from '../../components/overview-cards';
import { dashboardMetrics } from '../../mock/data';
import '../../styles/global.css';

// ---- Side-effects-only imports (no specifiers used) ----
// These imports are intentionally kept as bare side-effect imports
// to exercise the rsdoctor "side-effects-only-imports" rule.
import '../../side-effects/register-polyfills';
import '../../side-effects/register-logger';
import '../../side-effects/register-error-handler';
import '../../side-effects/register-performance-marks';
import '../../side-effects/register-theme';

// ---- Barrel file: import → re-export 导致 tree-shaking 失效 ----
// 页面只用了 formatDate 和 formatCurrency，但 barrel file (utils/index.js) 把
// 5 个子模块全部 import 再 export，每个子模块都有模块级副作用，
// 导致 date-utils / number-utils / string-utils / validator-utils / color-utils
// 全部被打包进来。
import { formatDate, formatCurrency } from '../../side-effects/utils';

const sideEffectModules = [
  {
    name: 'register-polyfills',
    desc: '注册全局 polyfill（arrayAt, structuredClone, objectGroupBy）',
    status: 'active',
  },
  {
    name: 'register-logger',
    desc: '安装全局日志记录器 __APP_LOGGER__',
    status: 'active',
  },
  {
    name: 'register-error-handler',
    desc: '挂载 window.onerror 和 unhandledrejection 监听器',
    status: 'active',
  },
  {
    name: 'register-performance-marks',
    desc: '在页面加载时记录 performance.mark',
    status: 'active',
  },
  {
    name: 'register-theme',
    desc: '向 document.documentElement 注入 CSS 变量主题令牌',
    status: 'active',
  },
];

function SideEffectsOnlyImportsPage() {
  return (
    <AppLayout title="Side-Effects-Only Imports 示例" currentKey="side-effects-only-imports">
      <PageHeader
        title="Side-Effects-Only Imports"
        breadcrumbItems={[{ title: '首页' }, { title: 'Side-Effects-Only Imports' }]}
      />

      <Alert
        type="info"
        showIcon
        message="此页面演示仅为副作用导入的模块"
        description="以下模块均以 import 'module' 的形式导入，没有使用任何具名导出。这是 Rsdoctor side-effects-only-imports 规则检测的典型模式。"
        style={{ marginBottom: 24 }}
      />

      <OverviewCards metrics={dashboardMetrics} />

      <div className="section-gap" />

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card title="副作用模块清单">
            <List
              dataSource={sideEffectModules}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={
                      <Typography.Text code>{item.name}</Typography.Text>
                    }
                    description={item.desc}
                  />
                  <Tag color="blue">{item.status}</Tag>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <div className="section-gap" />

      <Alert
        type="warning"
        showIcon
        message="Barrel File 导致 Tree-Shaking 失效"
        description={
          <>
            页面仅使用了 <Typography.Text code>formatDate</Typography.Text> 和{' '}
            <Typography.Text code>formatCurrency</Typography.Text>，
            但由于通过 barrel file（utils/index.js）导入，5 个子模块（date-utils、number-utils、
            string-utils、validator-utils、color-utils）全部被打包。每个子模块都含有模块级副作用
            （<Typography.Text code>globalThis.__xxx__ = true</Typography.Text>），
            打包器无法安全地移除未使用的导出。
          </>
        }
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <Card title="Barrel File 实际使用情况">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="今日日期">
                {formatDate(new Date())}
              </Descriptions.Item>
              <Descriptions.Item label="示例金额">
                {formatCurrency(486520)}
              </Descriptions.Item>
              <Descriptions.Item label="使用的导出">
                <Tag color="green">formatDate</Tag>
                <Tag color="green">formatCurrency</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="未使用但被打包的导出">
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {[
                    'formatDateTime', 'formatRelativeTime', 'parseISODate', 'getWeekday',
                    'formatPercent', 'formatCompact', 'clamp', 'randomInt', 'sum', 'average',
                    'truncate', 'capitalize', 'camelToKebab', 'kebabToCamel', 'slugify',
                    'maskPhone', 'maskEmail', 'padStart', 'template',
                    'isEmail', 'isPhone', 'isURL', 'isIDCard', 'isStrongPassword', 'isIPv4', 'isHexColor', 'isJSON',
                    'hexToRgb', 'rgbToHex', 'lighten', 'darken', 'randomColor', 'getContrastColor',
                  ].map((fn) => (
                    <Tag key={fn} color="red">{fn}</Tag>
                  ))}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Barrel File 结构">
            <Typography.Paragraph>
              <Typography.Text strong>utils/index.js</Typography.Text>（barrel file）：
            </Typography.Paragraph>
            <Typography.Paragraph code style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
{`export { formatDate, ... } from './date-utils';
export { formatCurrency, ... } from './number-utils';
export { truncate, ... } from './string-utils';
export { isEmail, ... } from './validator-utils';
export { hexToRgb, ... } from './color-utils';`}
            </Typography.Paragraph>
            <Divider />
            <Typography.Paragraph>
              <Typography.Text strong>页面导入方式</Typography.Text>（只用了 2 个函数）：
            </Typography.Paragraph>
            <Typography.Paragraph code style={{ whiteSpace: 'pre-wrap', fontSize: 12 }}>
{`// ❌ 通过 barrel 导入 → 5 个模块全部打包
import { formatDate, formatCurrency } from '../../side-effects/utils';

// ✅ 直接导入 → 只打包需要的模块
import { formatDate } from '../../side-effects/utils/date-utils';
import { formatCurrency } from '../../side-effects/utils/number-utils';`}
            </Typography.Paragraph>
          </Card>
        </Col>
      </Row>
    </AppLayout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<SideEffectsOnlyImportsPage />);
