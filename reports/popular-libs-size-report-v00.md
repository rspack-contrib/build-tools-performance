# popular-libs 细粒度产物体积对比报告

- 生成时间: 2026-04-08T10:44:27.971Z
- 对比工具: Rspack 2.0.0-rc.1, Vite 8.0.3, Rolldown 1.0.0-rc.12, Rollup 4.60.1
- 库数量: 50
- Rspack 有提升空间的 case 数量: 49
- 统计口径: 对每个库单独生成一个入口并做 production build，统计 `dist/` 中所有非 `.map`、非 `.LICENSE.txt` 文件的总产物大小及 gzip 大小。
- 说明: 细粒度报告模式下关闭了 Rspack / Rollup 的 HTML 壳输出，避免 HTML 固定开销影响小体积库的对比；因此本报告与 README 中的整包总量不能直接逐项相加或一一对应。
- 单元格格式: `raw (gzip)`，单位 `kB`。

## 逐库对比

| Library                  | Rspack       | Vite         | Rolldown     | Rollup       |
| ------------------------ | ------------ | ------------ | ------------ | ------------ |
| @floating-ui/dom         | 13.6 (5.5)   | 13.8 (5.5)   | 13.8 (5.5)   | 13.6 (5.5)   |
| @headlessui/react        | 143.0 (46.4) | 140.0 (45.8) | 140.5 (46.0) | 143.8 (46.9) |
| @headlessui/vue          | 90.6 (29.6)  | 58.5 (20.9)  | 58.5 (20.9)  | 58.5 (20.9)  |
| @heroicons/react         | 9.8 (3.6)    | 4.2 (1.7)    | 4.2 (1.7)    | 9.7 (3.6)    |
| @heroicons/vue           | 17.2 (6.7)   | 7.2 (3.2)    | 7.4 (3.3)    | 6.1 (2.7)    |
| @radix-ui/react-slot     | 10.7 (4.0)   | 10.5 (3.9)   | 10.7 (4.1)   | 10.3 (3.8)   |
| @reduxjs/toolkit         | 18.0 (6.8)   | 18.7 (7.1)   | 18.7 (7.1)   | 17.7 (6.8)   |
| @tanstack/react-query    | 42.0 (13.0)  | 36.8 (10.9)  | 36.8 (10.9)  | 42.3 (13.0)  |
| @vueuse/core             | 12.6 (4.6)   | 2.9 (1.3)    | 3.0 (1.3)    | 2.7 (1.1)    |
| axios                    | 36.2 (14.1)  | 36.4 (14.3)  | 36.5 (14.3)  | 35.9 (14.0)  |
| class-variance-authority | 1.1 (0.57)   | 0.97 (0.52)  | 0.97 (0.52)  | 1.1 (0.56)   |
| clsx                     | 0.40 (0.26)  | 0.38 (0.24)  | 0.38 (0.24)  | 0.38 (0.25)  |
| d3-array                 | 1.2 (0.55)   | 1.1 (0.54)   | 1.1 (0.54)   | 1.1 (0.54)   |
| d3-scale                 | 21.2 (8.5)   | 20.8 (8.4)   | 20.8 (8.4)   | 20.4 (8.2)   |
| date-fns                 | 1.1 (0.61)   | 1.1 (0.65)   | 1.1 (0.64)   | 1.0 (0.60)   |
| dayjs                    | 7.4 (3.2)    | 7.7 (3.3)    | 7.7 (3.3)    | 7.2 (3.0)    |
| dexie                    | 96.1 (30.9)  | 95.6 (31.1)  | 98.1 (31.1)  | 96.0 (30.8)  |
| framer-motion            | 130.7 (42.8) | 135.2 (44.6) | 135.5 (44.6) | 131.2 (42.6) |
| fuse.js                  | 19.0 (6.7)   | 19.4 (6.9)   | 19.4 (6.9)   | 19.0 (6.7)   |
| i18next                  | 42.3 (13.1)  | 41.8 (13.1)  | 41.9 (13.1)  | 42.2 (13.1)  |
| idb                      | 3.4 (1.3)    | 3.5 (1.4)    | 3.5 (1.4)    | 3.3 (1.4)    |
| immer                    | 9.0 (3.6)    | 9.1 (3.7)    | 9.1 (3.7)    | 9.0 (3.6)    |
| jotai                    | 6.3 (2.8)    | 5.5 (2.4)    | 6.8 (2.8)    | 6.9 (2.8)    |
| ky                       | 13.7 (4.8)   | 13.7 (4.8)   | 13.8 (4.9)   | 13.6 (4.8)   |
| lit                      | 14.8 (5.7)   | 14.9 (5.7)   | 15.1 (5.8)   | 14.8 (5.7)   |
| lodash-es                | 20.2 (7.7)   | 21.3 (8.3)   | 21.3 (8.3)   | 19.2 (7.4)   |
| lucide-react             | 9.5 (3.9)    | 3.9 (1.8)    | 4.4 (2.0)    | 9.4 (3.8)    |
| mitt                     | 0.34 (0.21)  | 0.32 (0.19)  | 0.32 (0.19)  | 0.32 (0.19)  |
| mobx                     | 55.2 (15.5)  | 54.8 (15.4)  | 54.8 (15.4)  | 54.7 (15.5)  |
| nanoid                   | 0.48 (0.35)  | 0.46 (0.34)  | 0.46 (0.34)  | 0.46 (0.34)  |
| pinia                    | 96.5 (33.9)  | 92.4 (32.6)  | 93.0 (32.9)  | 91.7 (32.1)  |
| preact                   | 9.9 (4.2)    | 9.9 (4.2)    | 9.9 (4.2)    | 9.9 (4.2)    |
| query-string             | 7.8 (2.7)    | 7.7 (2.7)    | 7.7 (2.7)    | 7.4 (2.6)    |
| react-hook-form          | 35.3 (12.5)  | 30.4 (10.9)  | 30.5 (11.0)  | 35.2 (12.5)  |
| react-i18next            | 67.0 (22.3)  | 64.0 (21.2)  | 64.4 (21.4)  | 63.4 (20.8)  |
| react-router-dom         | 89.7 (29.8)  | 93.2 (30.7)  | 92.0 (30.3)  | 87.9 (29.2)  |
| remeda                   | 0.74 (0.45)  | 0.76 (0.45)  | 0.76 (0.45)  | 0.79 (0.52)  |
| rxjs                     | 15.4 (5.1)   | 16.7 (5.4)   | 16.7 (5.4)   | 14.9 (5.0)   |
| solid-js                 | 5.9 (2.3)    | 6.9 (2.6)    | 5.9 (2.2)    | 3.5 (1.4)    |
| swiper                   | 86.7 (25.5)  | 86.6 (25.5)  | 86.7 (25.6)  | 86.6 (25.5)  |
| swr                      | 18.7 (7.4)   | 18.9 (7.7)   | 19.0 (7.7)   | 18.2 (7.3)   |
| tailwind-merge           | 26.0 (8.1)   | 26.0 (8.2)   | 26.0 (8.2)   | 26.0 (8.1)   |
| three                    | 120.5 (33.4) | 101.6 (29.1) | 101.5 (29.1) | 84.0 (24.2)  |
| valtio                   | 2.8 (1.3)    | 2.6 (1.2)    | 3.0 (1.3)    | 2.9 (1.3)    |
| vue                      | 21.6 (8.3)   | 17.0 (6.6)   | 17.1 (6.7)   | 16.5 (6.3)   |
| vue-i18n                 | 176.0 (63.6) | 181.8 (65.4) | 182.8 (65.7) | 79.2 (27.0)  |
| vue-router               | 93.5 (32.0)  | 108.7 (39.2) | 108.9 (39.3) | 92.3 (31.5)  |
| xstate                   | 34.1 (11.1)  | 34.6 (11.1)  | 34.6 (11.1)  | 33.9 (11.0)  |
| zod                      | 262.9 (58.8) | 260.9 (59.2) | 261.3 (59.3) | 258.2 (58.4) |
| zustand                  | 0.37 (0.26)  | 0.34 (0.24)  | 0.34 (0.25)  | 0.35 (0.25)  |

## Rspack 有提升空间的 case

下表列出 Rspack 在 raw size 或 gzip size 上落后于最优解的库，便于针对性优化。

| Library                  | Rspack raw | Best raw        | Raw gap  | Rspack gzip | Best gzip       | Gzip gap |
| ------------------------ | ---------- | --------------- | -------- | ----------- | --------------- | -------- |
| vue-i18n                 | 176.0 kB   | Rollup 79.2 kB  | +96.8 kB | 63.6 kB     | Rollup 27.0 kB  | +36.7 kB |
| three                    | 120.5 kB   | Rollup 84.0 kB  | +36.5 kB | 33.4 kB     | Rollup 24.2 kB  | +9.2 kB  |
| @headlessui/vue          | 90.6 kB    | Rollup 58.5 kB  | +32.2 kB | 29.6 kB     | Rollup 20.9 kB  | +8.8 kB  |
| @heroicons/vue           | 17.2 kB    | Rollup 6.1 kB   | +11.1 kB | 6.7 kB      | Rollup 2.7 kB   | +4.0 kB  |
| @vueuse/core             | 12.6 kB    | Rollup 2.7 kB   | +9.9 kB  | 4.6 kB      | Rollup 1.1 kB   | +3.5 kB  |
| vue                      | 21.6 kB    | Rollup 16.5 kB  | +5.2 kB  | 8.3 kB      | Rollup 6.3 kB   | +2.1 kB  |
| lucide-react             | 9.5 kB     | Vite 3.9 kB     | +5.7 kB  | 3.9 kB      | Vite 1.8 kB     | +2.0 kB  |
| @tanstack/react-query    | 42.0 kB    | Vite 36.8 kB    | +5.3 kB  | 13.0 kB     | Vite 10.9 kB    | +2.0 kB  |
| @heroicons/react         | 9.8 kB     | Vite 4.2 kB     | +5.5 kB  | 3.6 kB      | Vite 1.7 kB     | +1.9 kB  |
| pinia                    | 96.5 kB    | Rollup 91.7 kB  | +4.8 kB  | 33.9 kB     | Rollup 32.1 kB  | +1.8 kB  |
| react-hook-form          | 35.3 kB    | Vite 30.4 kB    | +4.8 kB  | 12.5 kB     | Vite 10.9 kB    | +1.5 kB  |
| react-i18next            | 67.0 kB    | Rollup 63.4 kB  | +3.5 kB  | 22.3 kB     | Rollup 20.8 kB  | +1.5 kB  |
| solid-js                 | 5.9 kB     | Rollup 3.5 kB   | +2.5 kB  | 2.3 kB      | Rollup 1.4 kB   | +0.89 kB |
| react-router-dom         | 89.7 kB    | Rollup 87.9 kB  | +1.8 kB  | 29.8 kB     | Rollup 29.2 kB  | +0.65 kB |
| @headlessui/react        | 143.0 kB   | Vite 140.0 kB   | +2.9 kB  | 46.4 kB     | Vite 45.8 kB    | +0.58 kB |
| vue-router               | 93.5 kB    | Rollup 92.3 kB  | +1.3 kB  | 32.0 kB     | Rollup 31.5 kB  | +0.50 kB |
| zod                      | 262.9 kB   | Rollup 258.2 kB | +4.7 kB  | 58.8 kB     | Rollup 58.4 kB  | +0.42 kB |
| d3-scale                 | 21.2 kB    | Rollup 20.4 kB  | +0.73 kB | 8.5 kB      | Rollup 8.2 kB   | +0.34 kB |
| lodash-es                | 20.2 kB    | Rollup 19.2 kB  | +1.00 kB | 7.7 kB      | Rollup 7.4 kB   | +0.32 kB |
| jotai                    | 6.3 kB     | Vite 5.5 kB     | +0.80 kB | 2.8 kB      | Vite 2.4 kB     | +0.32 kB |
| framer-motion            | 130.7 kB   | -               | -        | 42.8 kB     | Rollup 42.6 kB  | +0.22 kB |
| @radix-ui/react-slot     | 10.7 kB    | Rollup 10.3 kB  | +0.45 kB | 4.0 kB      | Rollup 3.8 kB   | +0.20 kB |
| rxjs                     | 15.4 kB    | Rollup 14.9 kB  | +0.51 kB | 5.1 kB      | Rollup 5.0 kB   | +0.18 kB |
| mobx                     | 55.2 kB    | Rollup 54.7 kB  | +0.45 kB | 15.5 kB     | Vite 15.4 kB    | +0.17 kB |
| swr                      | 18.7 kB    | Rollup 18.2 kB  | +0.48 kB | 7.4 kB      | Rollup 7.3 kB   | +0.16 kB |
| dayjs                    | 7.4 kB     | Rollup 7.2 kB   | +0.26 kB | 3.2 kB      | Rollup 3.0 kB   | +0.13 kB |
| query-string             | 7.8 kB     | Rollup 7.4 kB   | +0.36 kB | 2.7 kB      | Rollup 2.6 kB   | +0.13 kB |
| axios                    | 36.2 kB    | Rollup 35.9 kB  | +0.30 kB | 14.1 kB     | Rollup 14.0 kB  | +0.10 kB |
| valtio                   | 2.8 kB     | Vite 2.6 kB     | +0.20 kB | 1.3 kB      | Vite 1.2 kB     | +0.08 kB |
| @reduxjs/toolkit         | 18.0 kB    | Rollup 17.7 kB  | +0.31 kB | 6.8 kB      | Rollup 6.8 kB   | +0.07 kB |
| xstate                   | 34.1 kB    | Rollup 33.9 kB  | +0.18 kB | 11.1 kB     | Rollup 11.0 kB  | +0.05 kB |
| lit                      | 14.8 kB    | Rollup 14.8 kB  | +0.06 kB | 5.7 kB      | Rollup 5.7 kB   | +0.05 kB |
| dexie                    | 96.1 kB    | Vite 95.6 kB    | +0.54 kB | 30.9 kB     | Rollup 30.8 kB  | +0.05 kB |
| class-variance-authority | 1.1 kB     | Vite 0.97 kB    | +0.15 kB | 0.57 kB     | Vite 0.52 kB    | +0.05 kB |
| @floating-ui/dom         | 13.6 kB    | Rollup 13.6 kB  | +0.07 kB | 5.5 kB      | Rolldown 5.5 kB | +0.04 kB |
| preact                   | 9.9 kB     | Vite 9.9 kB     | +0.06 kB | 4.2 kB      | Vite 4.2 kB     | +0.04 kB |
| fuse.js                  | 19.0 kB    | Rollup 19.0 kB  | +0.04 kB | 6.7 kB      | Rollup 6.7 kB   | +0.02 kB |
| zustand                  | 0.37 kB    | Vite 0.34 kB    | +0.03 kB | 0.26 kB     | Vite 0.24 kB    | +0.02 kB |
| clsx                     | 0.40 kB    | Rollup 0.38 kB  | +0.02 kB | 0.26 kB     | Vite 0.24 kB    | +0.02 kB |
| mitt                     | 0.34 kB    | Rollup 0.32 kB  | +0.02 kB | 0.21 kB     | Vite 0.19 kB    | +0.01 kB |
| d3-array                 | 1.2 kB     | Rollup 1.1 kB   | +0.02 kB | 0.55 kB     | Vite 0.54 kB    | +0.01 kB |
| tailwind-merge           | 26.0 kB    | Rollup 26.0 kB  | +0.02 kB | 8.1 kB      | Rollup 8.1 kB   | +0.01 kB |
| immer                    | 9.0 kB     | Rollup 9.0 kB   | +0.04 kB | 3.6 kB      | Rollup 3.6 kB   | +0.01 kB |
| nanoid                   | 0.48 kB    | Rollup 0.46 kB  | +0.02 kB | 0.35 kB     | Vite 0.34 kB    | +0.01 kB |
| swiper                   | 86.7 kB    | Rollup 86.6 kB  | +0.07 kB | 25.5 kB     | Rollup 25.5 kB  | +0.01 kB |
| date-fns                 | 1.1 kB     | Rollup 1.0 kB   | +0.02 kB | 0.61 kB     | Rollup 0.60 kB  | +0.01 kB |
| ky                       | 13.7 kB    | Rollup 13.6 kB  | +0.02 kB | 4.8 kB      | Rollup 4.8 kB   | +0.01 kB |
| i18next                  | 42.3 kB    | Vite 41.8 kB    | +0.45 kB | 13.1 kB     | Rollup 13.1 kB  | +0.00 kB |
| idb                      | 3.4 kB     | Rollup 3.3 kB   | +0.02 kB | 1.3 kB      | -               | -        |

## 复现命令

```bash
node ./scripts/generate-popular-libs-size-report.ts
```
