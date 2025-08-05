# Prisma 操作指南

本指南將詳細介紹在 MCP Cloud 專案中如何使用 Prisma 進行資料庫操作，包括模型定義、遷移管理和基本 CRUD 操作。

## 目錄

1. [環境設置](#環境設置)
2. [Schema 定義](#schema-定義)
3. [Migration 操作](#migration-操作)
4. [Client 生成與使用](#client-生成與使用)
5. [基本 CRUD 操作](#基本-crud-操作)
6. [進階功能](#進階功能)
7. [最佳實踐](#最佳實踐)
8. [常見問題](#常見問題)

## 環境設置

### 1. 確認環境變數

在 `apps/mcp-cloud-api/.env` 中設置資料庫連接：

```env
# PostgreSQL 連接字串
DATABASE_URL="postgresql://username:password@localhost:5432/mcp_cloud_db?schema=public"
```

### 2. 安裝依賴

```bash
# 安裝 Prisma CLI 和 Client
pnpm add prisma @prisma/client

# 安裝開發依賴
pnpm add -D prisma
```

### 3. 初始化 Prisma（如果尚未初始化）

```bash
cd apps/mcp-cloud-api
npx prisma init
```

## Schema 定義

### 1. 基本 Schema 結構

Prisma schema 文件位於 `apps/mcp-cloud-api/prisma/schema.prisma`：

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// 模型定義
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 關聯
  templates Template[]

  @@map("users")
}

model Template {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  content     String?
  isPublic    Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 外鍵關聯
  authorId    Int
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  // 多對多關聯
  tags        Tag[]

  @@map("templates")
}

model Tag {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  color     String?
  createdAt DateTime @default(now())

  // 多對多關聯
  templates Template[]

  @@map("tags")
}
```

### 2. 常用資料類型

```prisma
model Example {
  // 基本類型
  id          Int       @id @default(autoincrement())
  title       String    // VARCHAR
  content     String?   // 可選字串
  published   Boolean   @default(false)
  views       Int       @default(0)
  rating      Float?

  // 日期時間
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  publishedAt DateTime?

  // JSON 類型（PostgreSQL）
  metadata    Json?

  // 枚舉類型
  status      Status    @default(DRAFT)

  @@map("examples")
}

enum Status {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

### 3. 索引和約束

```prisma
model Post {
  id      Int    @id @default(autoincrement())
  title   String
  slug    String @unique
  content String
  userId  Int

  // 複合索引
  @@index([userId, createdAt])
  // 複合唯一約束
  @@unique([title, userId])

  @@map("posts")
}
```

## Migration 操作

### 1. 創建新的 Migration

當您修改 schema 後，需要創建 migration：

```bash
cd apps/mcp-cloud-api

# 創建並應用 migration（開發環境）
npx prisma migrate dev --name add_user_model

# 只創建 migration 文件，不立即應用
npx prisma migrate dev --create-only --name add_user_model
```

### 2. 應用 Migration

```bash
# 應用所有待執行的 migrations（生產環境）
npx prisma migrate deploy

# 重置資料庫並重新應用所有 migrations（僅開發環境）
npx prisma migrate reset
```

### 3. Migration 狀態檢查

```bash
# 檢查 migration 狀態
npx prisma migrate status

# 查看 migration 歷史
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma
```

### 4. 使用 Nx 工具進行 Migration

在 MCP Cloud 專案中，我們有專用的 Prisma 工具：

```bash
# 使用 Nx 的 prisma-migrate-dev 工具
# 這會在正確的工作目錄中執行 migrate dev
```

## Client 生成與使用

### 1. 生成 Prisma Client

```bash
cd apps/mcp-cloud-api

# 生成 TypeScript client
npx prisma generate

# 或從專案根目錄
npx prisma generate --schema=./apps/mcp-cloud-api/prisma/schema.prisma
```

### 2. 在 NestJS 中使用 Prisma Service

`PrismaService` 已經配置好（位於 `src/core/prisma/prisma.service.ts`）：

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### 3. 在 Service 中注入使用

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  // 使用 Prisma Client 進行資料庫操作
  async findAllUsers() {
    return this.prisma.user.findMany();
  }
}
```

## 基本 CRUD 操作

### 1. 創建（Create）

```typescript
// 創建單一記錄
const user = await prisma.user.create({
  data: {
    email: 'john@example.com',
    name: 'John Doe',
  },
});

// 創建多筆記錄
const users = await prisma.user.createMany({
  data: [
    { email: 'user1@example.com', name: 'User 1' },
    { email: 'user2@example.com', name: 'User 2' },
  ],
});

// 創建帶關聯的記錄
const template = await prisma.template.create({
  data: {
    name: 'My Template',
    description: 'A sample template',
    author: {
      connect: { id: userId }, // 連接現有用戶
    },
    tags: {
      create: [
        { name: 'typescript', color: '#3178c6' },
        { name: 'nestjs', color: '#e0234e' },
      ],
    },
  },
  include: {
    author: true,
    tags: true,
  },
});
```

### 2. 查詢（Read）

```typescript
// 查詢所有記錄
const allUsers = await prisma.user.findMany();

// 條件查詢
const publishedTemplates = await prisma.template.findMany({
  where: {
    isPublic: true,
    author: {
      email: {
        endsWith: '@company.com',
      },
    },
  },
  include: {
    author: {
      select: {
        id: true,
        name: true,
        email: true,
      },
    },
    tags: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
  take: 10,
  skip: 0,
});

// 查詢單一記錄
const user = await prisma.user.findUnique({
  where: {
    email: 'john@example.com',
  },
});

// 查詢第一筆符合條件的記錄
const latestTemplate = await prisma.template.findFirst({
  where: {
    isPublic: true,
  },
  orderBy: {
    createdAt: 'desc',
  },
});

// 聚合查詢
const stats = await prisma.template.aggregate({
  where: {
    isPublic: true,
  },
  _count: {
    id: true,
  },
  _avg: {
    authorId: true,
  },
});
```

### 3. 更新（Update）

```typescript
// 更新單一記錄
const updatedUser = await prisma.user.update({
  where: {
    id: 1,
  },
  data: {
    name: 'Updated Name',
  },
});

// 更新多筆記錄
const updatedTemplates = await prisma.template.updateMany({
  where: {
    authorId: 1,
  },
  data: {
    isPublic: true,
  },
});

// Upsert（存在則更新，不存在則創建）
const user = await prisma.user.upsert({
  where: {
    email: 'john@example.com',
  },
  update: {
    name: 'John Updated',
  },
  create: {
    email: 'john@example.com',
    name: 'John New',
  },
});
```

### 4. 刪除（Delete）

```typescript
// 刪除單一記錄
const deletedUser = await prisma.user.delete({
  where: {
    id: 1,
  },
});

// 刪除多筆記錄
const deletedTemplates = await prisma.template.deleteMany({
  where: {
    isPublic: false,
    createdAt: {
      lt: new Date('2023-01-01'),
    },
  },
});
```

## 進階功能

### 1. 交易（Transactions）

```typescript
// 使用交易確保資料一致性
const result = await prisma.$transaction(async (tx) => {
  // 創建用戶
  const user = await tx.user.create({
    data: {
      email: 'new@example.com',
      name: 'New User',
    },
  });

  // 為用戶創建模板
  const template = await tx.template.create({
    data: {
      name: 'Welcome Template',
      authorId: user.id,
    },
  });

  return { user, template };
});

// 交互式交易
const [userCount, templateCount] = await prisma.$transaction([prisma.user.count(), prisma.template.count()]);
```

### 2. 原始 SQL 查詢

```typescript
// 執行原始 SQL
const result = await prisma.$queryRaw`
  SELECT u.name, COUNT(t.id) as template_count
  FROM users u
  LEFT JOIN templates t ON u.id = t.author_id
  GROUP BY u.id, u.name
  ORDER BY template_count DESC
`;

// 執行原始 SQL（帶參數）
const userId = 1;
const templates = await prisma.$queryRaw`
  SELECT * FROM templates 
  WHERE author_id = ${userId}
  AND created_at > NOW() - INTERVAL '30 days'
`;
```

### 3. 資料庫視圖

```sql
-- 在資料庫中創建視圖
CREATE VIEW user_template_stats AS
SELECT
  u.id,
  u.name,
  u.email,
  COUNT(t.id) as template_count,
  COUNT(CASE WHEN t.is_public THEN 1 END) as public_template_count
FROM users u
LEFT JOIN templates t ON u.id = t.author_id
GROUP BY u.id, u.name, u.email;
```

```prisma
// 在 schema 中定義視圖
model UserTemplateStats {
  id                    Int    @id
  name                  String?
  email                 String
  templateCount         Int    @map("template_count")
  publicTemplateCount   Int    @map("public_template_count")

  @@map("user_template_stats")
}
```

## 最佳實踐

### 1. Schema 設計原則

```prisma
model Post {
  // ✅ 好的實踐
  id        Int      @id @default(autoincrement())
  title     String   @db.VarChar(255)  // 指定長度限制
  slug      String   @unique @db.VarChar(255)
  content   String   @db.Text          // 長文本使用 Text 類型
  createdAt DateTime @default(now())   // 總是包含時間戳
  updatedAt DateTime @updatedAt

  // 索引優化
  @@index([createdAt])
  @@index([slug])

  @@map("posts")
}
```

### 2. 查詢優化

```typescript
// ✅ 好的實踐：只選擇需要的欄位
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true,
    // 不選擇不需要的大字段
  },
});

// ✅ 使用分頁
const templates = await prisma.template.findMany({
  take: 20,
  skip: page * 20,
  orderBy: { createdAt: 'desc' },
});

// ✅ 預載入關聯資料
const templatesWithAuthor = await prisma.template.findMany({
  include: {
    author: {
      select: {
        id: true,
        name: true,
      },
    },
  },
});
```

### 3. 錯誤處理

```typescript
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

async createUser(data: CreateUserDto) {
  try {
    return await this.prisma.user.create({ data });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
    }
    throw error;
  }
}
```

### 4. 環境配置

```env
# 開發環境
DATABASE_URL="postgresql://dev_user:dev_pass@localhost:5432/mcp_cloud_dev"

# 測試環境
TEST_DATABASE_URL="postgresql://test_user:test_pass@localhost:5432/mcp_cloud_test"

# 生產環境
DATABASE_URL="postgresql://prod_user:prod_pass@prod_host:5432/mcp_cloud_prod?schema=public&sslmode=require"
```

## 常見問題

### 1. TypeScript 類型問題

```typescript
// ❌ 錯誤：導入失敗
import { PrismaClient } from '@prisma/client';

// ✅ 解決方案：確保已生成 client
// 執行：npx prisma generate

// ✅ 使用推斷類型
type User = Prisma.UserGetPayload<{
  include: { templates: true };
}>;
```

### 2. Migration 衝突

```bash
# 問題：migration 衝突
# 解決方案：
npx prisma migrate resolve --applied 20231201000000_conflict_migration
npx prisma migrate dev
```

### 3. 連接池配置

```env
# 在 DATABASE_URL 中配置連接池
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public&connection_limit=10&pool_timeout=20"
```

### 4. 效能監控

```typescript
// 啟用查詢日誌
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// 查詢時間監控
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();

  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  return result;
});
```

## 常用指令摘要

```bash
# 安裝和設置
pnpm add prisma @prisma/client
npx prisma init

# Schema 和 Migration
npx prisma migrate dev --name description
npx prisma migrate deploy
npx prisma migrate reset
npx prisma migrate status

# Client 生成
npx prisma generate

# 資料庫管理
npx prisma db push  # 直接同步 schema 到資料庫（開發時使用）
npx prisma db pull  # 從資料庫生成 schema

# 工具
npx prisma studio  # 開啟資料庫 GUI
npx prisma format  # 格式化 schema 文件
npx prisma validate  # 驗證 schema 文件

# 在 Nx 專案中使用
cd apps/mcp-cloud-api && npx prisma <command>
```

這份指南涵蓋了在 MCP Cloud 專案中使用 Prisma 的所有基本和進階操作。建議將此文件加入到專案文檔中，並定期更新以反映專案的演進。
