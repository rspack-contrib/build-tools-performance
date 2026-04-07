/**
 * 共享用户信息模块 — 同时被同步 import 和动态 import() 引用
 *
 * 同样触发 E1006 Module Mixed Chunks 规则。
 */
import { Tag, Avatar, Descriptions, Badge, Space } from 'antd';

export function renderUserProfile(user) {
  console.log('renderUserProfile', Tag, Avatar, Descriptions, Badge, Space);
  return {
    component: 'UserProfile',
    user,
    ui: { Tag, Avatar, Descriptions, Badge, Space },
  };
}

export function formatUserRole(role) {
  const roleMap = {
    admin: '管理员',
    editor: '编辑',
    viewer: '查看者',
    guest: '访客',
  };
  return roleMap[role] || role;
}

export const USER_MODULE_VERSION = '1.2.0';
