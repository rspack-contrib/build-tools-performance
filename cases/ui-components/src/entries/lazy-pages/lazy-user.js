/**
 * 懒加载的用户资料页面
 *
 * 通过 import() 动态加载 → 进入 async chunk。
 * 同步导入了 shared/user-info.js，而入口文件也同步导入了它
 * → user-info 模块同时出现在 initial chunk + async chunk → E1006
 */
import { renderUserProfile, formatUserRole, USER_MODULE_VERSION } from '../../shared/user-info';

const mockUsers = [
  { name: '张三', role: 'admin' },
  { name: '李四', role: 'editor' },
  { name: '王五', role: 'viewer' },
];

export function init() {
  const profiles = mockUsers.map((u) => ({
    ...renderUserProfile(u),
    roleLabel: formatUserRole(u.role),
  }));
  console.log('[Lazy User] version:', USER_MODULE_VERSION);
  console.log('[Lazy User] profiles:', profiles);
  return profiles;
}
