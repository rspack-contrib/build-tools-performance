import React from 'react';
import ReactDOM from 'react-dom/client';
import { Card, Col, Row, Typography, Tag, Alert, Descriptions, Divider, Image, List } from 'antd';
import AppLayout from '../../layouts/app-layout';
import PageHeader from '../../components/page-header';
import '../../styles/global.css';

// ---- Large Asset Imports ----
// WARNING: These imports pull oversized resources directly into the JS bundle.

// 1. Large SVG (~190KB) imported as a module — will be inlined or emitted as asset
//    depending on rspack asset config. Either way it bloats the initial download.
import heroBannerSvg from '../../assets/hero-banner.svg';

// 2. Large JSON resource map (~108KB) containing 200 base64-encoded icon sprites.
//    This entire JSON is bundled into the JS chunk even though only a few icons
//    are used on this page.
import resourceMap from '../../assets/resource-map.json';

// 3. Large CSS with base64-embedded font (~391KB).
//    The @font-face declarations contain the full font file as a data URL,
//    doubling the CSS chunk size. Should use an external font URL instead.
import '../../assets/enterprise-font.css';

const { Title, Text, Paragraph } = Typography;

// Only 3 out of 200 icons are actually used
const usedIcons = ['icon-0001', 'icon-0042', 'icon-0100'];

function LargeAssetsPage() {
  return (
    <AppLayout title="大资源示例" currentKey="large-assets">
      <PageHeader
        title="Large Assets 示例"
        breadcrumbItems={[{ title: '首页' }, { title: 'Large Assets' }]}
      />

      <Alert
        message="此页面演示了过大媒体资源被打入 bundle 的问题"
        description="页面引入了 ~190KB SVG、~108KB JSON sprite map、~391KB 内联字体 CSS，总计约 689KB 冗余资源。"
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />

      <Row gutter={16}>
        {/* Hero Banner — 190KB inline SVG */}
        <Col span={24}>
          <Card title="Hero Banner（~190KB SVG）" style={{ marginBottom: 16 }}>
            <Paragraph type="secondary">
              此 SVG 包含 2000 条路径，以模块方式导入后被 rspack 作为 asset 处理。
              应改为外部 CDN 链接或压缩后的 PNG/WebP。
            </Paragraph>
            <Image
              src={heroBannerSvg}
              alt="Hero Banner"
              style={{ maxWidth: '100%', borderRadius: 8 }}
              preview={false}
            />
          </Card>
        </Col>

        {/* Resource Map — 108KB JSON inlined into JS */}
        <Col span={12}>
          <Card title="Icon Sprite Map（~108KB JSON）" style={{ marginBottom: 16 }}>
            <Paragraph type="secondary">
              JSON 中包含 200 个 base64 编码的图标，但本页仅使用其中 3 个。
              整个 JSON 被打入 JS bundle，浪费 ~105KB。
            </Paragraph>
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="总图标数">
                {Object.keys(resourceMap).length}
              </Descriptions.Item>
              <Descriptions.Item label="已使用">
                {usedIcons.length}
              </Descriptions.Item>
              <Descriptions.Item label="未使用">
                {Object.keys(resourceMap).length - usedIcons.length}
              </Descriptions.Item>
            </Descriptions>
            <Divider />
            <List
              size="small"
              header={<Text strong>使用中的图标</Text>}
              dataSource={usedIcons}
              renderItem={(key) => (
                <List.Item>
                  <Tag color="blue">{key}</Tag>
                  <img
                    src={resourceMap[key]}
                    alt={key}
                    style={{ width: 24, height: 24 }}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>

        {/* Enterprise Font — 391KB CSS with base64 font */}
        <Col span={12}>
          <Card title="Enterprise Font（~391KB CSS）" style={{ marginBottom: 16 }}>
            <Paragraph type="secondary">
              CSS 中以 base64 data URL 内嵌了 ~200KB 的 woff2 字体（normal + bold 各一份），
              导致 CSS 产物膨胀。应改为外部字体文件引用。
            </Paragraph>
            <div style={{ padding: 16, background: '#fafafa', borderRadius: 8 }}>
              <p className="enterprise-heading" style={{ fontSize: 24 }}>
                Enterprise Sans Bold 示例
              </p>
              <p className="enterprise-font" style={{ fontSize: 16 }}>
                Enterprise Sans Regular 示例 — The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Summary */}
      <Card title="问题总结" style={{ marginTop: 16 }}>
        <Descriptions bordered column={1}>
          <Descriptions.Item label="hero-banner.svg">
            ~190KB — 过大 SVG 应压缩或转为 PNG/WebP，通过 CDN 外链加载
          </Descriptions.Item>
          <Descriptions.Item label="resource-map.json">
            ~108KB — 200 个 base64 图标全部打入 JS，仅使用 3 个，应按需加载或拆分
          </Descriptions.Item>
          <Descriptions.Item label="enterprise-font.css">
            ~391KB — 字体以 base64 内嵌在 CSS 中，应改为外部 woff2 文件引用
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>合计冗余</Text>}>
            <Text type="danger" strong>~689KB</Text>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </AppLayout>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<LargeAssetsPage />);
