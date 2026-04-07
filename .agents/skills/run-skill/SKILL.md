---
name: run-skill
description: 对 eval/cases.json 中的 case 逐个运行 bundle 分析 Skill，生成报告并与标准答案比对评定。
---
# Skill: 运行 Bundle 分析 Skill

## 触发条件

当用户要求对 cases 运行 bundle 分析时触发，例如：
- "分析 cases 下的项目"
- "跑 Skill 分析 bundle 问题"
- "用 xxx.md 生成 bundle 分析报告"

判断是否有 SKILL_PROMPT 输入，没有的话，**必须停下来询问用户指定 SKILL_PROMPT，不要继续执行后续步骤**。只有在用户明确给出 SKILL_PROMPT 后才继续。

## 清除前置信息

每次执行前必须清除上一轮运行的历史记录，避免旧的 reports 内容残留在 context 中影响本次分析：

1. **删除 `eval/reports/` 下所有已有的报告文件**（如 `*.md`），确保本次运行从零开始生成
2. **不要读取旧的 reports 内容** — 在 Step 1 读取配置阶段，只读取 `cases.json`、`{{SKILL_PROMPT}}` 和 `standards/`，不要读取 `reports/` 中的历史文件
3. 如果 context 中已经加载了上一轮的 reports 内容，忽略这些内容，不要将其作为本次分析的参考 


## 模板参数

| 参数 | 说明 | 默认值 |
|------|------|--------|
| `{{SKILL_PROMPT}}` | 要执行的 Skill prompt（文件路径或 skill 名称） | 必填，且没有默认值，如果没有需要询问用户指定 |

### 解析规则

`{{SKILL_PROMPT}}` 的值按以下优先级解析：

1. **显式文件路径** — 如果用户给出了 `.md` 文件路径（如 "用 eval/skill_prompt_v2.md 跑分析"），直接使用该文件。
2. **Skill 名称查找** — 如果用户给出的是一个关键词或 skill 名称（如 "用 rsdoctor 分析"），则：
   - 先在 `.agent/` 目录下查找匹配的 skill 文件（文件名或一级标题包含该关键词）
   - 再在 `eval/` 目录下查找匹配的 `skill_*.md` 或 `*_skill.md` 文件
   - 匹配规则：文件名或文件内 `# Skill:` 标题包含用户给出的关键词（不区分大小写）
   - 如果找到唯一匹配，使用该文件；如果有多个匹配，列出候选让用户选择
3. **默认值** — 如果用户未指定任何 skill，使用 `eval/skill_prompt.md`。

> 查找路径：`.agent/` → `eval/skill_*.md` / `eval/*_skill.md`
> 示例：用户说 "用 rsdoctor 分析 ui-components" → 查找到 `.agent/rsdoctor-analysis.md` → 使用该文件作为 skill prompt。

## 任务

读取 `eval/cases.json` 中列出的每个 case 的源码文件，按照 `{{SKILL_PROMPT}}` 中定义的分析维度和输出格式，对每个 case 进行完整的 bundle 分析，将结果保存到 `eval/reports/<case_name>.md`。随后对 `eval/reports/` 与 `eval/standards/` 下对应 case 的结果进行逐项比对，评定 reporter 结果的质量，并输出 `{{SKILL_PROMPT}}` 的耗时和 token 使用量。

## 执行步骤

### Step 1: 清除历史 & 读取配置

1. **清除旧报告** — 删除 `eval/reports/` 目录下所有 `*.md` 文件（如果目录不存在则创建）
2. 读取 `eval/cases.json`，获取所有 case 的名称和需要读取的源码文件列表
3. 读取 `{{SKILL_PROMPT}}`，了解分析维度和输出格式要求
4. 读取 `eval/standards/` 中的标准答案文件，用于后续比对（不要读取 `eval/reports/` 中的任何历史文件）

### Step 2: 逐个 case 分析

对 `cases.json` 中的每个 case：

1. 按 `context_files` 列表，读取所有源码文件（路径相对于仓库根目录）
2. 基于 `{{SKILL_PROMPT}}` 中定义的分析维度，对该 case 进行完整分析
3. 只报告该 case 中**实际存在**的问题，不要为了全面而编造不存在的问题
4. 输出格式严格按照 `{{SKILL_PROMPT}}` 中的 Output Format 章节
5. 读取该 case 在 `eval/reports/` 与 `eval/standards/` 下的对应结果，按 findings、evidence、impact、suggestion、priority 等维度逐项比对
6. 基于比对结果评定 reporter 结果，至少给出：
   - 总体评价（如：优秀 / 良好 / 一般 / 较差）
   - 命中标准答案的问题覆盖度
   - 多报 / 漏报 / 证据不足 / 建议不可执行 等问题
   - 如 reporter 优于 standards，也要明确指出

### Step 3: 保存报告

将每个 case 的分析结果保存到 `eval/reports/<case_name>.md`，例如：
- `eval/reports/ui-components.md`
- `eval/reports/antd-tob-mpa.md`
- `eval/reports/react-10k.md`

确保 `eval/reports/` 目录存在，不存在则创建。

### Step 4: 汇总

所有 case 分析完成后，输出一个简要汇总：

```
已完成 N 个 case 的 bundle 分析与 reports 评定：
- ui-components → eval/reports/ui-components.md
- antd-tob-mpa → eval/reports/antd-tob-mpa.md
- react-10k → eval/reports/react-10k.md
```

并补充每个 case 的 reports 评定结论，例如：
- ui-components → reports 结果：良好，覆盖 3/4 个核心问题
- antd-tob-mpa → reports 结果：一般，存在 1 个漏报与 2 处证据不足

对于不足和错误的，简要说明具体是哪里不足和错误。

## 注意事项

- 分析必须基于实际读取到的代码内容，不要凭记忆或猜测
- reporter 评定必须基于 `reporter` 与 `standards` 的实际文本比对，不要只看文件名或标题
- 每个 Finding 必须有具体的 Evidence（引用具体文件名、代码行、包名）
- 每个 Finding 必须有可操作的 Suggestion（带代码示例）
- 对 reporter 的评价要区分“结论正确但证据弱”与“结论本身错误”
- 如果某个分析维度在该 case 中不适用，不要强行包含
