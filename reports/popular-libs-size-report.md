# popular-libs 细粒度产物体积对比报告

- 生成时间: 2026-04-09T12:20:05.975Z
- 对比工具: Rspack 2.0.0-rc.1, Vite 8.0.3, Rolldown 1.0.0-rc.12, Rollup 4.60.1
- 库数量: 50
- Rspack 有提升空间的 case 数量: 47
- 统计口径: 对每个库单独生成一个入口并做 production build，统计 `dist/` 中所有非 `.map`、非 `.LICENSE.txt` 文件的总产物大小及 gzip 大小。
- 说明: 细粒度报告模式下关闭了 Rspack / Rollup 的 HTML 壳输出，避免 HTML 固定开销影响小体积库的对比；因此本报告与 README 中的整包总量不能直接逐项相加或一一对应。
- 单元格格式: `raw (gzip)`，单位 `kB`。

## 逐库对比

| Library                  | Rspack       | Vite         | Rolldown     | Rollup       |
| ------------------------ | ------------ | ------------ | ------------ | ------------ |
| @floating-ui/dom         | 14.1 (5.5)   | 13.8 (5.5)   | 13.8 (5.5)   | 14.0 (5.5)   |
| @headlessui/react        | 146.7 (47.1) | 140.0 (45.8) | 140.5 (46.0) | 166.6 (53.0) |
| @headlessui/vue          | 93.5 (30.4)  | 58.5 (20.9)  | 58.5 (20.9)  | 70.5 (25.2)  |
| @heroicons/react         | 9.8 (3.7)    | 4.2 (1.7)    | 4.2 (1.7)    | 22.4 (8.0)   |
| @heroicons/vue           | 24.4 (9.5)   | 7.2 (3.2)    | 7.4 (3.3)    | 14.9 (6.3)   |
| @radix-ui/react-slot     | 10.9 (4.1)   | 10.5 (3.9)   | 10.7 (4.1)   | 28.2 (9.1)   |
| @reduxjs/toolkit         | 18.7 (7.0)   | 18.7 (7.1)   | 18.7 (7.1)   | 32.6 (11.6)  |
| @tanstack/react-query    | 42.8 (13.1)  | 36.8 (10.9)  | 36.8 (10.9)  | 62.1 (19.1)  |
| @vueuse/core             | 12.8 (4.8)   | 2.9 (1.3)    | 3.0 (1.3)    | 11.3 (4.8)   |
| axios                    | 37.3 (14.4)  | 36.4 (14.3)  | 36.5 (14.3)  | 36.9 (14.2)  |
| class-variance-authority | 1.1 (0.57)   | 0.97 (0.52)  | 0.97 (0.52)  | 1.1 (0.56)   |
| clsx                     | 0.40 (0.25)  | 0.38 (0.24)  | 0.38 (0.24)  | 0.39 (0.25)  |
| d3-array                 | 1.2 (0.55)   | 1.1 (0.54)   | 1.1 (0.54)   | 1.2 (0.54)   |
| d3-scale                 | 21.5 (8.6)   | 20.8 (8.4)   | 20.8 (8.4)   | 20.7 (8.3)   |
| date-fns                 | 1.1 (0.63)   | 1.1 (0.65)   | 1.1 (0.64)   | 1.1 (0.61)   |
| dayjs                    | 7.4 (3.2)    | 7.7 (3.3)    | 7.7 (3.3)    | 7.1 (3.0)    |
| dexie                    | 96.9 (31.2)  | 95.6 (31.1)  | 98.1 (31.1)  | 96.8 (31.1)  |
| framer-motion            | 134.7 (43.4) | 135.2 (44.6) | 135.5 (44.6) | 154.0 (48.9) |
| fuse.js                  | 19.4 (6.8)   | 19.4 (6.9)   | 19.4 (6.9)   | 19.4 (6.8)   |
| i18next                  | 42.4 (13.1)  | 41.8 (13.1)  | 41.9 (13.1)  | 42.4 (13.1)  |
| idb                      | 3.5 (1.4)    | 3.5 (1.4)    | 3.5 (1.4)    | 3.5 (1.3)    |
| immer                    | 9.2 (3.7)    | 9.1 (3.7)    | 9.1 (3.7)    | 10.6 (4.2)   |
| jotai                    | 6.5 (2.8)    | 5.5 (2.4)    | 6.8 (2.8)    | 7.2 (2.9)    |
| ky                       | 13.9 (4.9)   | 13.7 (4.8)   | 13.8 (4.9)   | 13.9 (4.9)   |
| lit                      | 15.1 (5.8)   | 14.9 (5.7)   | 15.1 (5.8)   | 15.1 (5.8)   |
| lodash-es                | 21.7 (8.1)   | 21.3 (8.3)   | 21.3 (8.3)   | 20.0 (7.6)   |
| lucide-react             | 9.6 (3.9)    | 3.9 (1.8)    | 4.4 (2.0)    | 22.2 (8.2)   |
| mitt                     | 0.34 (0.20)  | 0.32 (0.19)  | 0.32 (0.19)  | 0.33 (0.20)  |
| mobx                     | 56.0 (15.8)  | 54.8 (15.4)  | 54.8 (15.4)  | 68.6 (20.0)  |
| nanoid                   | 0.48 (0.35)  | 0.46 (0.34)  | 0.46 (0.34)  | 0.47 (0.35)  |
| pinia                    | 99.0 (34.9)  | 92.4 (32.6)  | 93.0 (32.9)  | 105.8 (37.5) |
| preact                   | 9.9 (4.2)    | 9.9 (4.2)    | 9.9 (4.2)    | 9.9 (4.2)    |
| query-string             | 7.9 (2.8)    | 7.7 (2.7)    | 7.7 (2.7)    | 7.6 (2.6)    |
| react-hook-form          | 35.5 (12.6)  | 30.4 (10.9)  | 30.5 (11.0)  | 48.3 (16.9)  |
| react-i18next            | 70.9 (23.6)  | 64.0 (21.2)  | 64.4 (21.4)  | 77.5 (25.5)  |
| react-router-dom         | 95.7 (31.5)  | 93.2 (30.7)  | 92.0 (30.3)  | 101.6 (33.4) |
| remeda                   | 0.77 (0.45)  | 0.76 (0.45)  | 0.76 (0.45)  | 0.84 (0.54)  |
| rxjs                     | 16.7 (5.4)   | 16.7 (5.4)   | 16.7 (5.4)   | 15.5 (5.1)   |
| solid-js                 | 7.1 (2.7)    | 6.9 (2.6)    | 5.9 (2.2)    | 3.6 (1.5)    |
| swiper                   | 87.4 (25.6)  | 86.6 (25.5)  | 86.7 (25.6)  | 87.4 (25.6)  |
| swr                      | 18.8 (7.6)   | 18.9 (7.7)   | 19.0 (7.7)   | 31.9 (11.8)  |
| tailwind-merge           | 27.3 (8.1)   | 26.0 (8.2)   | 26.0 (8.2)   | 27.3 (8.1)   |
| three                    | 103.1 (29.3) | 101.6 (29.1) | 101.5 (29.1) | 84.9 (24.4)  |
| valtio                   | 2.9 (1.3)    | 2.6 (1.2)    | 3.0 (1.3)    | 3.1 (1.3)    |
| vue                      | 21.6 (8.4)   | 17.0 (6.6)   | 17.1 (6.7)   | 25.8 (10.0)  |
| vue-i18n                 | 180.5 (64.7) | 181.8 (65.4) | 182.8 (65.7) | 100.2 (34.9) |
| vue-router               | 98.7 (33.5)  | 108.7 (39.2) | 108.9 (39.3) | 114.1 (39.2) |
| xstate                   | 35.2 (11.2)  | 34.6 (11.1)  | 34.6 (11.1)  | 35.0 (11.1)  |
| zod                      | 263.5 (59.1) | 260.9 (59.2) | 261.3 (59.3) | 259.1 (58.7) |
| zustand                  | 0.37 (0.26)  | 0.34 (0.24)  | 0.34 (0.25)  | 0.36 (0.26)  |

## Rspack 有提升空间的 case

下表列出 Rspack 在 raw size 或 gzip size 上落后于最优解的库，便于针对性优化。

| Library                  | Rspack raw | Best raw         | Raw gap  | Rspack gzip | Best gzip        | Gzip gap |
| ------------------------ | ---------- | ---------------- | -------- | ----------- | ---------------- | -------- |
| vue-i18n                 | 180.5 kB   | Rollup 100.2 kB  | +80.3 kB | 64.7 kB     | Rollup 34.9 kB   | +29.8 kB |
| @headlessui/vue          | 93.5 kB    | Rolldown 58.5 kB | +35.0 kB | 30.4 kB     | Rolldown 20.9 kB | +9.5 kB  |
| @heroicons/vue           | 24.4 kB    | Vite 7.2 kB      | +17.2 kB | 9.5 kB      | Vite 3.2 kB      | +6.3 kB  |
| three                    | 103.1 kB   | Rollup 84.9 kB   | +18.3 kB | 29.3 kB     | Rollup 24.4 kB   | +4.8 kB  |
| @vueuse/core             | 12.8 kB    | Vite 2.9 kB      | +9.9 kB  | 4.8 kB      | Vite 1.3 kB      | +3.5 kB  |
| react-i18next            | 70.9 kB    | Vite 64.0 kB     | +7.0 kB  | 23.6 kB     | Vite 21.2 kB     | +2.4 kB  |
| pinia                    | 99.0 kB    | Vite 92.4 kB     | +6.5 kB  | 34.9 kB     | Vite 32.6 kB     | +2.3 kB  |
| @tanstack/react-query    | 42.8 kB    | Vite 36.8 kB     | +6.0 kB  | 13.1 kB     | Vite 10.9 kB     | +2.2 kB  |
| lucide-react             | 9.6 kB     | Vite 3.9 kB      | +5.7 kB  | 3.9 kB      | Vite 1.8 kB      | +2.0 kB  |
| @heroicons/react         | 9.8 kB     | Vite 4.2 kB      | +5.5 kB  | 3.7 kB      | Vite 1.7 kB      | +1.9 kB  |
| vue                      | 21.6 kB    | Vite 17.0 kB     | +4.6 kB  | 8.4 kB      | Vite 6.6 kB      | +1.8 kB  |
| react-hook-form          | 35.5 kB    | Vite 30.4 kB     | +5.1 kB  | 12.6 kB     | Vite 10.9 kB     | +1.7 kB  |
| @headlessui/react        | 146.7 kB   | Vite 140.0 kB    | +6.7 kB  | 47.1 kB     | Vite 45.8 kB     | +1.3 kB  |
| react-router-dom         | 95.7 kB    | Rolldown 92.0 kB | +3.7 kB  | 31.5 kB     | Rolldown 30.3 kB | +1.3 kB  |
| solid-js                 | 7.1 kB     | Rollup 3.6 kB    | +3.5 kB  | 2.7 kB      | Rollup 1.5 kB    | +1.3 kB  |
| lodash-es                | 21.7 kB    | Rollup 20.0 kB   | +1.7 kB  | 8.1 kB      | Rollup 7.6 kB    | +0.49 kB |
| zod                      | 263.5 kB   | Rollup 259.1 kB  | +4.4 kB  | 59.1 kB     | Rollup 58.7 kB   | +0.46 kB |
| mobx                     | 56.0 kB    | Vite 54.8 kB     | +1.2 kB  | 15.8 kB     | Vite 15.4 kB     | +0.41 kB |
| jotai                    | 6.5 kB     | Vite 5.5 kB      | +1.0 kB  | 2.8 kB      | Vite 2.4 kB      | +0.39 kB |
| rxjs                     | 16.7 kB    | Rollup 15.5 kB   | +1.2 kB  | 5.4 kB      | Rollup 5.1 kB    | +0.38 kB |
| d3-scale                 | 21.5 kB    | Rollup 20.7 kB   | +0.77 kB | 8.6 kB      | Rollup 8.3 kB    | +0.33 kB |
| axios                    | 37.3 kB    | Vite 36.4 kB     | +0.85 kB | 14.4 kB     | Rollup 14.2 kB   | +0.17 kB |
| @radix-ui/react-slot     | 10.9 kB    | Vite 10.5 kB     | +0.45 kB | 4.1 kB      | Vite 3.9 kB      | +0.17 kB |
| dexie                    | 96.9 kB    | Vite 95.6 kB     | +1.3 kB  | 31.2 kB     | Rolldown 31.1 kB | +0.16 kB |
| query-string             | 7.9 kB     | Rollup 7.6 kB    | +0.37 kB | 2.8 kB      | Rollup 2.6 kB    | +0.14 kB |
| dayjs                    | 7.4 kB     | Rollup 7.1 kB    | +0.28 kB | 3.2 kB      | Rollup 3.0 kB    | +0.13 kB |
| xstate                   | 35.2 kB    | Vite 34.6 kB     | +0.64 kB | 11.2 kB     | Vite 11.1 kB     | +0.10 kB |
| valtio                   | 2.9 kB     | Vite 2.6 kB      | +0.35 kB | 1.3 kB      | Vite 1.2 kB      | +0.10 kB |
| swiper                   | 87.4 kB    | Vite 86.6 kB     | +0.76 kB | 25.6 kB     | Vite 25.5 kB     | +0.07 kB |
| i18next                  | 42.4 kB    | Vite 41.8 kB     | +0.61 kB | 13.1 kB     | Vite 13.1 kB     | +0.07 kB |
| lit                      | 15.1 kB    | Vite 14.9 kB     | +0.21 kB | 5.8 kB      | Vite 5.7 kB      | +0.05 kB |
| class-variance-authority | 1.1 kB     | Vite 0.97 kB     | +0.17 kB | 0.57 kB     | Vite 0.52 kB     | +0.04 kB |
| ky                       | 13.9 kB    | Vite 13.7 kB     | +0.20 kB | 4.9 kB      | Vite 4.8 kB      | +0.04 kB |
| @floating-ui/dom         | 14.1 kB    | Vite 13.8 kB     | +0.32 kB | 5.5 kB      | Rolldown 5.5 kB  | +0.03 kB |
| preact                   | 9.9 kB     | Vite 9.9 kB      | +0.04 kB | 4.2 kB      | Vite 4.2 kB      | +0.03 kB |
| tailwind-merge           | 27.3 kB    | Rolldown 26.0 kB | +1.3 kB  | 8.1 kB      | Rollup 8.1 kB    | +0.02 kB |
| date-fns                 | 1.1 kB     | Rollup 1.1 kB    | +0.03 kB | 0.63 kB     | Rollup 0.61 kB   | +0.02 kB |
| zustand                  | 0.37 kB    | Vite 0.34 kB     | +0.04 kB | 0.26 kB     | Vite 0.24 kB     | +0.01 kB |
| nanoid                   | 0.48 kB    | Vite 0.46 kB     | +0.02 kB | 0.35 kB     | Vite 0.34 kB     | +0.01 kB |
| mitt                     | 0.34 kB    | Vite 0.32 kB     | +0.02 kB | 0.20 kB     | Vite 0.19 kB     | +0.01 kB |
| clsx                     | 0.40 kB    | Vite 0.38 kB     | +0.02 kB | 0.25 kB     | Vite 0.24 kB     | +0.01 kB |
| d3-array                 | 1.2 kB     | Vite 1.1 kB      | +0.04 kB | 0.55 kB     | Vite 0.54 kB     | +0.01 kB |
| idb                      | 3.5 kB     | Rollup 3.5 kB    | +0.01 kB | 1.4 kB      | Rollup 1.3 kB    | +0.00 kB |
| fuse.js                  | 19.4 kB    | Vite 19.4 kB     | +0.04 kB | 6.8 kB      | Rollup 6.8 kB    | +0.00 kB |
| immer                    | 9.2 kB     | Vite 9.1 kB      | +0.09 kB | 3.7 kB      | -                | -        |
| @reduxjs/toolkit         | 18.7 kB    | Vite 18.7 kB     | +0.02 kB | 7.0 kB      | -                | -        |
| remeda                   | 0.77 kB    | Vite 0.76 kB     | +0.01 kB | 0.45 kB     | -                | -        |

## 复现命令

```bash
node ./scripts/generate-popular-libs-size-report.ts
```
