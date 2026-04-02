export const dashboardMetrics = [
  { title: '今日订单', value: 1298, suffix: '单', trend: '+12.4%' },
  { title: '支付金额', value: 486520, prefix: '¥', trend: '+8.1%' },
  { title: '待发货', value: 236, suffix: '单', trend: '-3.2%' },
  { title: '退款申请', value: 19, suffix: '单', trend: '+1.4%' },
];

export const orderStatusOptions = [
  '全部',
  '待支付',
  '待发货',
  '运输中',
  '已完成',
  '已取消',
];

export const orders = Array.from({ length: 36 }).map((_, index) => {
  const amount = 99 + (index % 8) * 128 + index * 7;
  const statusPool = ['待支付', '待发货', '运输中', '已完成', '已取消'];
  return {
    id: `ORD-202604-${String(1000 + index)}`,
    customer: `企业客户 ${index + 1}`,
    region: ['华东', '华南', '华北', '西南'][index % 4],
    amount,
    count: 1 + (index % 5),
    status: statusPool[index % statusPool.length],
    createdAt: `2026-03-${String((index % 28) + 1).padStart(2, '0')} 1${index % 10}:3${index % 6}`,
  };
});

export const product = {
  id: 'SKU-982731',
  name: '企业级智能网关 Pro',
  category: '网络设备 / 网关',
  brand: 'CloudEdge',
  price: 3299,
  stock: 284,
  sold: 1836,
  rating: 4.8,
  desc: '适用于多分支机构统一接入、策略控制、可视化运维。支持零接触部署。',
  tags: ['热销', '企业采购', '支持私有化'],
  skus: [
    { key: '1', name: '标准版', code: 'CE-GW-STD', price: 2899, stock: 102 },
    { key: '2', name: '增强版', code: 'CE-GW-PRO', price: 3299, stock: 121 },
    { key: '3', name: '旗舰版', code: 'CE-GW-ULT', price: 4299, stock: 61 },
  ],
  gallery: [
    'https://picsum.photos/seed/gateway-1/640/360',
    'https://picsum.photos/seed/gateway-2/640/360',
    'https://picsum.photos/seed/gateway-3/640/360',
  ],
};

export const monthlySales = [
  { month: '2025-11', value: 320000 },
  { month: '2025-12', value: 364000 },
  { month: '2026-01', value: 401200 },
  { month: '2026-02', value: 425600 },
  { month: '2026-03', value: 473800 },
  { month: '2026-04', value: 496000 },
];

export const categoryShare = [
  { type: '网络设备', value: 42 },
  { type: '服务器', value: 24 },
  { type: '安全产品', value: 18 },
  { type: '软件订阅', value: 16 },
];

export const regionPerformance = [
  { region: '华东', revenue: 160, satisfaction: 88, delivery: 85 },
  { region: '华南', revenue: 143, satisfaction: 86, delivery: 79 },
  { region: '华北', revenue: 118, satisfaction: 81, delivery: 76 },
  { region: '西南', revenue: 95, satisfaction: 84, delivery: 73 },
  { region: '华中', revenue: 106, satisfaction: 82, delivery: 78 },
];

export const orderFormDefaults = {
  customerName: '上海某某科技有限公司',
  contact: '王经理',
  phone: '13800000000',
  region: '华东',
  address: '上海市浦东新区张江路 88 号',
  payMethod: '对公转账',
  deliveryDate: null,
};

export const cartItems = [
  {
    key: '1',
    name: '企业级智能网关 Pro - 增强版',
    sku: 'CE-GW-PRO',
    qty: 2,
    price: 3299,
  },
  {
    key: '2',
    name: '云管理平台年度订阅（100 节点）',
    sku: 'CLOUD-CTRL-100',
    qty: 1,
    price: 6999,
  },
];
