# Build Tools Comparison

## Eval: Bundle 分析 Skill 评测

本仓库内置了一套评测框架，用于评估 AI Agent 的 bundle 分析能力。评测流程分两步：

### Step 1: 构建 cases，生成 Rsdoctor 分析数据

对 `eval/cases.json` 中的三个项目分别执行 Rspack 构建，生成 `rsdoctor-data.json`：

```bash
pnpm i

cd cases/ui-components && pnpm build:rspack && cd ../..
cd cases/antd-tob-mpa && pnpm build:rspack && cd ../..
cd cases/react-10k && pnpm build:rspack && cd ../..
```

构建完成后，每个 case 的 `dist/.rsdoctor/` 下会生成 `rsdoctor-data.json` 或 `stats.json`，供后续分析使用。

### Step 2: 运行 run-skill，生成报告并评测

在仓库根目录使用 AI CLI，输入：

```text
use run-skill
```

接着会要求填写需要检测的 SKILL_PROMPT, 需要拉取到本地的 .agent 中，然后返回给 AI CLI。

```md

• 需要先指定 SKILL_PROMPT，这个 skill 的说明要求没有明确 prompt 时不能继续执行。

  可直接给我一个：

  - 文件路径，例如 eval/skill_prompt.md
  - 或 skill 名称，例如 rsdoctor-analysis

  你回一个值，我就继续跑。

```

该 skill 会自动：

1. 清除 `eval/reports/` 下的历史报告
2. 逐个读取 cases 源码，运行 bundle 分析
3. 将分析结果写入 `eval/reports/<case_name>.md`
4. 与 `eval/standards/` 中的标准答案进行逐项比对，给出评测结论

### 目录结构

```text
eval/
├── cases.json          # case 列表及需读取的源码文件
├── run-skill.md        # 评测执行 skill（注册为 run-skill）
├── evaluate_skill.md   # 评测维度定义（Q1~Q4）
├── standards/          # 标准答案
│   ├── ui-components.md
│   ├── antd-tob-mpa.md
│   └── react-10k.md
└── reports/            # 生成的报告（每次运行前自动清除）
```
