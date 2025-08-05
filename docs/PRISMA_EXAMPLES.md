# MCP Cloud Prisma 實戰範例

基於當前 Template 模型的實際操作示例。

## 當前 Schema 分析

您目前的 `schema.prisma` 包含：

```prisma
model Template {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("templates")
}
```

## 逐步擴展示例

### 步驟 1：添加用戶模型和關聯

修改 `apps/mcp-cloud-api/prisma/schema.prisma`：

```prisma
// 添加用戶模型
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 一對多關聯：一個用戶可以有多個模板
  templates Template[]

  @@map("users")
}

// 擴展現有的 Template 模型
model Template {
  id          Int      @id @default(autoincrement())
  name        String
  description String?
  content     String?  // 模板內容
  isPublic    Boolean  @default(false)  // 是否公開
  tags        String[] // PostgreSQL 數組類型
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // 外鍵關聯：每個模板屬於一個用戶
  authorId    Int
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)

  @@map("templates")
}
```

### 步驟 2：創建 Migration

```bash
cd apps/mcp-cloud-api
npx prisma migrate dev --name "add_user_model_and_expand_template"
```

這會：

1. 創建新的 migration 文件
2. 生成 SQL 來創建 users 表
3. 修改 templates 表添加新字段
4. 應用 migration 到資料庫
5. 重新生成 Prisma Client

### 步驟 3：更新 Prisma Service

您的 `PrismaService` 已經配置好，無需修改。

### 步驟 4：更新 Templates Service

修改 `apps/mcp-cloud-api/src/modules/templates/services/templates.service.ts`：

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';

export interface CreateTemplateDto {
  name: string;
  description?: string;
  content?: string;
  isPublic?: boolean;
  tags?: string[];
  authorId: number;
}

export interface UpdateTemplateDto {
  name?: string;
  description?: string;
  content?: string;
  isPublic?: boolean;
  tags?: string[];
}

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  // 獲取所有模板（包含作者信息）
  async getTemplates(isPublic?: boolean) {
    const where = isPublic !== undefined ? { isPublic } : {};

    const templates = await this.prisma.template.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { templates };
  }

  // 創建新模板
  async createTemplate(data: CreateTemplateDto) {
    return this.prisma.template.create({
      data,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  // 根據 ID 獲取模板
  async getTemplateById(id: number) {
    const template = await this.prisma.template.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return template;
  }

  // 更新模板
  async updateTemplate(id: number, data: UpdateTemplateDto) {
    try {
      return await this.prisma.template.update({
        where: { id },
        data,
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    } catch (error) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
  }

  // 刪除模板
  async deleteTemplate(id: number) {
    try {
      return await this.prisma.template.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }
  }

  // 根據作者獲取模板
  async getTemplatesByAuthor(authorId: number) {
    return this.prisma.template.findMany({
      where: { authorId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  // 搜索模板
  async searchTemplates(query: string, isPublic = true) {
    return this.prisma.template.findMany({
      where: {
        isPublic,
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: query,
              mode: 'insensitive',
            },
          },
          {
            tags: {
              hasSome: [query],
            },
          },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
```

### 步驟 5：創建 User Service

創建 `apps/mcp-cloud-api/src/modules/users/services/users.service.ts`：

```typescript
import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../core/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export interface CreateUserDto {
  email: string;
  name?: string;
  avatar?: string;
}

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    try {
      return await this.prisma.user.create({
        data,
        include: {
          templates: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        templates: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        templates: {
          where: {
            isPublic: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async getAllUsers() {
    return this.prisma.user.findMany({
      include: {
        _count: {
          select: {
            templates: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
```

## 實際操作流程

### 1. 準備資料庫

```bash
# 確保 PostgreSQL 正在運行
# 確保 .env 文件中的 DATABASE_URL 正確

# 應用 schema 變更
cd apps/mcp-cloud-api
npx prisma migrate dev --name "initial_setup"
```

### 2. 生成 Prisma Client

```bash
npx prisma generate
```

### 3. 種子資料（可選）

創建 `apps/mcp-cloud-api/prisma/seed.ts`：

```typescript
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 創建測試用戶
  const user1 = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      templates: {
        create: [
          {
            name: 'React Component Template',
            description: 'A basic React functional component template',
            content: `import React from 'react';

interface Props {
  title: string;
}

const Component: React.FC<Props> = ({ title }) => {
  return <div>{title}</div>;
};

export default Component;`,
            isPublic: true,
            tags: ['react', 'typescript', 'component'],
          },
          {
            name: 'NestJS Controller Template',
            description: 'A RESTful API controller template',
            content: `import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('api')
export class ApiController {
  @Get()
  findAll() {
    return 'This action returns all items';
  }

  @Post()
  create(@Body() createDto: any) {
    return 'This action adds a new item';
  }
}`,
            isPublic: true,
            tags: ['nestjs', 'typescript', 'controller'],
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      email: 'jane@example.com',
      name: 'Jane Smith',
      templates: {
        create: [
          {
            name: 'Prisma Model Template',
            description: 'A basic Prisma model definition',
            content: `model Example {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@map("examples")
}`,
            isPublic: false,
            tags: ['prisma', 'database', 'model'],
          },
        ],
      },
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

執行種子資料：

```bash
npx prisma db seed
```

### 4. 測試 API

您現在可以使用這些新的服務方法來測試 CRUD 操作：

```typescript
// 在 controller 或測試中
const templatesService = new TemplatesService(prisma);
const usersService = new UsersService(prisma);

// 創建用戶
const user = await usersService.createUser({
  email: 'test@example.com',
  name: 'Test User',
});

// 創建模板
const template = await templatesService.createTemplate({
  name: 'My Template',
  description: 'Test template',
  content: 'console.log("Hello World");',
  isPublic: true,
  tags: ['javascript', 'tutorial'],
  authorId: user.id,
});

// 搜索模板
const searchResults = await templatesService.searchTemplates('javascript');
```

## 監控和調試

### 1. 啟用查詢日誌

在 `PrismaService` 中添加：

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'], // 啟用日誌
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### 2. 使用 Prisma Studio

```bash
cd apps/mcp-cloud-api
npx prisma studio
```

這會開啟一個 web 界面來查看和編輯資料庫內容。

這個實戰範例展示了如何從您現有的簡單 Template 模型逐步擴展到一個完整的多用戶模板系統。
