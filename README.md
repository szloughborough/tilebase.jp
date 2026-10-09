# Tilebase 网站

日文 B2B 墙贴／地贴网站。实际代码与构建文件均位于本目录。

## 当前状态

- 27 个首期业务／政策页面，博客导航及 8 篇文章，另有真实 404 页面。
- 159 个 Tilebase 展示品号（46 款墙贴、113 款地贴），344 张优化图片；其中本次增加 147 款设计和 172 张详情场景图。
- 产品筛选、原生无障碍详情弹窗、品号带入样品／报价表单。
- 当前是 preview 模式：全站 noindex、robots 禁止抓取、Sitemap 为空。
- 表单可下载 JSON 下书，明确标记未发送；不将访客数据发往外部。
- Pages Functions 询盘服务已经实现，但生产服务尚未配置。
- 经营主体按用户原文为 Shenzhen Lafubao Trading Co,.Ltd。
- 拟用邮箱 sale@tilebase.jp；域名尚未注册，邮箱尚未验证开通。
- 公司地址按用户提供：Room B021,Fang Da Da Sha,Nanshan District, Shenzhen, Guangdong, PR China。

## 看网站

双击 `启动网站预览.cmd`，随后打开 http://127.0.0.1:4322/ 。命令窗口关闭后预览停止；若该端口已运行，直接访问已有预览。

需要修改时使用 Node 22.19+，推荐 Node 24。当前电脑的系统 Node 22.17 低于部署依赖的要求；Codex 自带 Node 24 已通过验证。

```powershell
$tilebaseNode = 'C:/Users/Mloong/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'
& $tilebaseNode node_modules/astro/astro.js dev --host 127.0.0.1 --port 4321
```

在正常安装 Node 24 的电脑可直接运行 `npm ci`、`npm run dev`。

## 目录

- `src/data/site.ts`：公司、品牌、导航、12 个公开品号。
- `src/data/pages.ts`：首期页面内容及链接。
- `src/data/articles.ts`：8 篇文章与相关链接。
- `src/components`／`src/layouts`／`src/styles`：设计系统和交互。
- `functions/api` 和 `server/inquiries.mjs`：询盘及邮件重试服务。
- `migrations`：D1 询盘和限流表结构。
- `private/asset-map.json`：仅本地的原始型号和素材映射，不提交公开库、不上传部署。
- `launch-readiness.json`：生产前业务条件确认，不能不核实就改为 true。
- `dist`：可部署的公开静态构建，不包含内部资料。

网站仅展示不含原供应方标识的选定图片，不复制原证书、报告、培训文档。源文件保持原样。图片的实际发布权与品号供货状态仍需确认。

## 验证

```powershell
& $tilebaseNode node_modules/astro/astro.js check
& $tilebaseNode --test tests/inquiries.test.mjs
& $tilebaseNode node_modules/astro/astro.js build
& $tilebaseNode scripts/audit.mjs
& $tilebaseNode node_modules/wrangler/bin/wrangler.js pages functions build --outdir .wrangler/functions
& $tilebaseNode scripts/smoke.mjs
```

最后一项要求 4322 预览已运行。报告保存到 `qa`，不作为网站公开资源。

询盘测试使用真正的内存 SQLite 数据库与假的外部响应，不连接生产服务，也不发送邮件。

## 正式部署到 Cloudflare

当前仅完成代码和本地运行。认证检查显示已有 Cloudflare 令牌无法刷新且服务器不可达；未尝试登录、购买域名或上传部署。

1. 完成域名注册、JP 地址注册条件及邮箱开通，验证公司法定名称和联系方式。
2. 核实产品事实、商业条件、图片授权；补充政策页保存周期、权利联系窗口及实际处理事業者等内容。
3. 使用自己的 Cloudflare 账户登录 Wrangler，创建 Pages 项目和 D1 数据库。把实际 D1 ID 填入 `wrangler.jsonc`，占位 ID 不能用于生产。
4. 将数据库 migrations 应用到远程数据库：`wrangler d1 migrations apply tilebase-inquiries --remote`。
5. 配置 Turnstile（hostname 为 tilebase.jp，action 为 inquiry），验证 Resend 发信域名。
6. 在 `.env` 配置 `SITE_URL=https://tilebase.jp`、`PUBLIC_CONTACT_EMAIL=sale@tilebase.jp`、`PUBLIC_TURNSTILE_SITE_KEY`、`PUBLIC_SITE_STAGE=production`。需要在构建前以实际环境变量传入这些值；生产门槛读取 process.env，`.env` 中的 stage 不单独绕过门槛。
7. 逐项完成 `launch-readiness.json` 后构建生产版本。生产门槛未满足时会拒绝构建。
8. Pages runtime 环境设置 `SITE_STAGE=production`、`SITE_URL` 和以下 secrets：TURNSTILE_SECRET_KEY、RATE_LIMIT_SALT、RESEND_API_KEY、FROM_EMAIL、INQUIRY_EMAIL、RETRY_TOKEN。`INQUIRY_EMAIL` 只有在邮箱确实能接收时设为 sale@tilebase.jp。
9. `wrangler pages deploy dist --project-name tilebase` 会同时编译工作区中的 `functions`。确认 DB binding，绑定域名和 TLS，运行真实表单／通知验证后提交 GSC。

不要把 API 密钥写入 src 或 public。也不要将内部原型号映射和证据库打包到 dist。

## 询盘处理

POST `/api/inquiries` 在 production 且配置齐全时工作。校验来源、字段、型号、Turnstile 与频率，再持久化到 D1，保存成功才返回编号。相同 submissionId 不重复建线索。

邮件通知即使失败也不丢线索。失败／pending 记录可通过 POST `/api/retry` 重试，请求需要 `Authorization: Bearer <RETRY_TOKEN>`。每次最多 20 条、最多 5 次尝试，失败退避；超过上限的记录人工检查。当前没有已运行的外部定时器，正式环境需配置每 5 分钟调用的调度器，或管理员人工执行。重试 token 不进入浏览器。

用 Cloudflare 控制台的私有 D1 管理功能查看和导出数据。状态字段支持 new、contacted、qualified、sample_sent、quoted、won、lost、spam；本版不包含 CRM 后台。数据保留和清理周期在正式隐私政策确认后配置。

## 尚未启用

- tilebase.jp 正式域名及 sale@tilebase.jp 邮箱。
- 真实询盘接收、发信、防机器人生产 key。
- GA4／GSC；本版保留 dataLayer 事件挂钩，未加载分析脚本。
- 未核实的性能、规格、MOQ、价格、客户案例、认证宣称。
- 目录／规格 PDF 下载；没有假下载按钮。

## 更新流程

修改公开文案 → 校验事实与型号 → 构建 → 全站审计 → 预览核对 → 正式部署。新增性能或认证内容必须核实适用范围，不能把生产方的证据改成贸易公司的自有认证。

## 正式上线检查
运行 npm run check:launch。预览版本返回非零退出码是预期行为；它不会修改上线门槛、secret或数据库。不应把配置存在当作真实服务验证通过。详见 DEPLOYMENT_STATUS.md。

