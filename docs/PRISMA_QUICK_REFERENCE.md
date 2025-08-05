# Prisma 快速指令參考

MCP Cloud 專案中常用的 Prisma 指令和操作。

## 🚀 快速開始

```bash
# 進入 API 專案目錄
cd apps/mcp-cloud-api

# 檢查 Prisma 狀態
npx prisma --version
npx prisma validate
```

## 📝 Schema 操作

```bash
# 格式化 schema 文件
npx prisma format

# 驗證 schema 語法
npx prisma validate

# 從現有資料庫生成 schema（逆向工程）
npx prisma db pull
```

## 🔄 Migration 操作

```bash
# 創建並應用新的 migration（開發環境）
npx prisma migrate dev --name "add_user_model"

# 只創建 migration 文件，不應用
npx prisma migrate dev --create-only --name "add_user_model"

# 應用所有待執行的 migrations（生產環境）
npx prisma migrate deploy

# 重置資料庫並重新應用所有 migrations（⚠️ 僅開發環境）
npx prisma migrate reset

# 檢查 migration 狀態
npx prisma migrate status

# 將特定 migration 標記為已應用（解決衝突時使用）
npx prisma migrate resolve --applied "20231201000000_migration_name"
```

## 🏗️ Client 生成

```bash
# 生成 Prisma Client
npx prisma generate

# 從專案根目錄生成（指定 schema 路徑）
npx prisma generate --schema=./apps/mcp-cloud-api/prisma/schema.prisma
```

## 💾 資料庫操作

```bash
# 直接將 schema 推送到資料庫（跳過 migration，適合快速原型開發）
npx prisma db push

# 執行種子資料
npx prisma db seed

# 種子資料腳本範例（package.json）
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

## 🔍 工具和調試

```bash
# 開啟 Prisma Studio（資料庫 GUI）
npx prisma studio

# 在特定 port 開啟 Studio
npx prisma studio --port 5556

# 生成 ERD（實體關係圖）需要安裝額外套件
npx prisma generate --generator erd
```

## 📊 查詢和分析

```bash
# 執行原始 SQL 查詢
npx prisma db execute --file ./scripts/custom-query.sql

# 查看查詢計劃（需要在程式碼中設置）
# 在 PrismaClient 設定中添加：log: ['query']
```

## 🔧 在 MCP Cloud 專案中的實際使用

### 日常開發流程

```bash
# 1. 修改 schema 後
cd apps/mcp-cloud-api
npx prisma format

# 2. 創建和應用 migration
npx prisma migrate dev --name "descriptive_name"

# 3. 如果 TypeScript 報錯，重新生成 client
npx prisma generate

# 4. 重新啟動開發服務器
cd ../../
nx serve mcp-cloud-api
```

### 部署到生產環境

```bash
# 1. 在 CI/CD 或生產服務器上
npx prisma migrate deploy

# 2. 生成 production client
npx prisma generate

# 3. 啟動應用
npm start
```

### 資料庫維護

```bash
# 檢查資料庫連接
npx prisma db execute --stdin <<< "SELECT version();"

# 備份重要資料（使用 pg_dump）
pg_dump $DATABASE_URL > backup.sql

# 恢復資料
psql $DATABASE_URL < backup.sql
```

## ⚠️ 常見問題解決

### 1. TypeScript 錯誤：找不到 PrismaClient

```bash
# 解決方案：重新生成 client
npx prisma generate

# 如果仍有問題，清除快取
rm -rf node_modules/.prisma
npx prisma generate
```

### 2. Migration 衝突

```bash
# 查看狀態
npx prisma migrate status

# 解決衝突（將問題 migration 標記為已應用）
npx prisma migrate resolve --applied "problematic_migration_id"

# 繼續正常流程
npx prisma migrate dev
```

### 3. 資料庫連接問題

```bash
# 測試連接
npx prisma db execute --stdin <<< "SELECT 1;"

# 檢查環境變數
echo $DATABASE_URL
```

### 4. Schema 漂移檢測

```bash
# 檢查 schema 與資料庫的差異
npx prisma migrate diff \
  --from-schema-datamodel prisma/schema.prisma \
  --to-schema-datasource prisma/schema.prisma
```

## 🔒 環境變數設置

```env
# .env 檔案範例
DATABASE_URL="postgresql://user:password@localhost:5432/mcp_cloud_dev?schema=public"

# 測試環境
TEST_DATABASE_URL="postgresql://user:password@localhost:5432/mcp_cloud_test?schema=public"

# 生產環境（加上 SSL）
DATABASE_URL="postgresql://user:password@host:5432/mcp_cloud_prod?schema=public&sslmode=require"
```

## 📋 常用 Schema 模式

### 基本模型結構

```prisma
model ModelName {
  id        Int      @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 您的欄位...

  @@map("table_name")
}
```

### 關聯關係

```prisma
// 一對多
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

model Post {
  id     Int  @id @default(autoincrement())
  userId Int
  user   User @relation(fields: [userId], references: [id])
}

// 多對多
model Post {
  id   Int   @id @default(autoincrement())
  tags Tag[]
}

model Tag {
  id    Int    @id @default(autoincrement())
  posts Post[]
}
```

### 索引和約束

```prisma
model Example {
  id    Int    @id @default(autoincrement())
  email String @unique
  name  String

  @@index([name])
  @@unique([email, name])
}
```

這份快速參考應該涵蓋了您在 MCP Cloud 專案中使用 Prisma 時的大部分需求。建議將其保存為書籤，以便在開發過程中快速查找指令。
