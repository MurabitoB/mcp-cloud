# 專案結構說明

## mcp-cloud Nx Monorepo 專案結構

此專案使用 Nx monorepo 架構，包含多個應用程式和共享庫。

```
mcp-cloud/
├── apps/                              # 應用程式
│   ├── mcp-cloud-api/                # NestJS API 應用
│   │   ├── src/
│   │   │   ├── main.ts               # API 入口點
│   │   │   ├── app/                  # 應用模組
│   │   │   │   ├── app.module.ts     # 根模組
│   │   │   │   ├── app.controller.ts # 控制器
│   │   │   │   └── app.service.ts    # 服務
│   │   │   └── modules/              # 業務模組 (DDD 分層)
│   │   │       └── templates/        # 範本模組
│   │   │           ├── templates.module.ts
│   │   │           ├── temlates.dto.ts
│   │   │           ├── templates.controller.ts
│   │   │           └── templates.service.ts
│   │   ├── jest.config.ts            # Jest 配置
│   │   ├── tsconfig.json            # TypeScript 配置
│   │   └── package.json             # 依賴管理
│   │
│   └── mcp-cloud-ui/                # Next.js 前端應用
│       ├── src/
│       │   └── app/                 # Next.js App Router
│       │       ├── layout.tsx       # 布局組件
│       │       ├── page.tsx         # 首頁
│       │       └── api/             # API 路由
│       ├── public/                  # 靜態資源
│       ├── next.config.js          # Next.js 配置
│       ├── tailwind.config.js      # Tailwind CSS 配置
│       └── tsconfig.json           # TypeScript 配置
│
├── libs/                           # 共享庫 (未來擴展)
│
├── specs/                          # 規格文件
│   └── PRD.md                     # 產品需求文件
│
├── nx.json                        # Nx 工作區配置
├── package.json                   # 根依賴管理
├── pnpm-workspace.yaml           # PNPM 工作區配置
├── tsconfig.base.json            # 基礎 TypeScript 配置
├── jest.config.ts                # Jest 根配置
└── eslint.config.mjs             # ESLint 根配置
```

## Swagger Decorator Guide

- If the DTO is already defined correctly, do not defined in the controller again.
- Use `@ApiProperty()` to document properties of DTOs.
-

## important-instruction-reminders

Do what has been asked; nothing more, nothing less.
NEVER create files unless they're absolutely necessary for achieving your goal.
ALWAYS prefer editing an existing file to creating a new one.
NEVER proactively create documentation files (\*.md) or README files. Only create documentation files if explicitly requested by the User.
