# MCP Cloud - 雲原生 MCP 代理服務平台

## 產品概述

MCP Cloud 是一個雲原生平台，透過 MCP Proxy 服務將基於 stdio 通信的 Model Context Protocol (MCP) Server 部署到 Kubernetes 集群中，提供自動化的容器化部署、管理和擴展能力。

## 背景與動機

### 問題描述

- 傳統的 MCP Server 通常以 stdio 方式運行，難以進行分散式部署和管理
- 缺乏統一的雲原生部署方案，導致運維複雜度高
- 沒有自動化的擴展和容錯機制
- 缺乏統一的監控和日誌管理

### 解決方案

透過 MCP Proxy 將 stdio 通信轉換為網路通信，結合 Kubernetes 的雲原生架構，實現 MCP Server 的自動化部署、管理和擴展。

## 產品目標

### 主要目標

1. **簡化部署**: 一鍵部署 MCP Server 到 Kubernetes 集群
2. **自動擴展**: 根據負載自動調整 MCP Server 實例數量
3. **高可用性**: 提供容錯機制和健康檢查
4. **統一管理**: 集中化的配置、監控和日誌管理
5. **標準化**: 建立 MCP Server 雲原生部署的標準化流程

### 次要目標

- 支援多種 MCP Server 類型
- 提供 Web UI 進行視覺化管理
- 支援多租戶隔離
- 提供 API 介面供第三方整合

## 核心功能

### 1. MCP Proxy 服務

- **協議轉換**: 將 stdio 通信轉換為 HTTP/WebSocket/gRPC
- **負載均衡**: 在多個 MCP Server 實例間分配請求
- **連接管理**: 維護與 MCP Server 的持久連接
- **錯誤處理**: 提供重試機制和降級策略

### 2. Kubernetes 自動化部署

- **Pulumi 資源管理**: 透過 Pulumi TypeScript SDK 定義和管理基礎設施
- **Deployment 自動化**: 使用 Pulumi 建立和管理 MCP Server 的 Kubernetes Deployment
- **Service 配置**: 透過 Pulumi 自動建立 LoadBalancer 或 ClusterIP Service
- **Secret 管理**: 使用 Pulumi 管理 MCP Server 所需的環境變數和憑證
- **Ingress 路由**: 透過 Pulumi 配置外部訪問路徑和 SSL 終止
- **狀態管理**: Pulumi 狀態檔案追蹤資源變更和版本控制

### 3. 配置管理

- **動態配置**: 支援運行時配置更新
- **環境變數管理**: 統一管理不同環境的配置
- **秘鑰管理**: 安全地管理 API 金鑰和憑證
- **版本控制**: 配置變更的版本追蹤

### 4. 監控與觀測

- **指標收集**: CPU、記憶體、請求量等關鍵指標
- **日誌聚合**: 集中收集和分析日誌
- **分散式追蹤**: 請求鏈路追蹤
- **告警機制**: 異常情況自動告警

### 5. Web 管理介面

- **儀表板**: 顯示系統狀態和關鍵指標
- **部署管理**: 視覺化部署和管理 MCP Server
- **配置編輯**: Web 介面配置管理
- **日誌查看**: 即時日誌查看和搜尋

## 技術架構

### 系統架構圖

```text
┌─────────────────────────────────────────────────────────────┐
│                     Web UI (Next.js)                       │
├─────────────────────────────────────────────────────────────┤
│                 Control Plane (NestJS)                     │
│                     ↓ Pulumi Engine                        │
├─────────────────────────────────────────────────────────────┤
│                      MCP Proxy                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  Load Balancer  │  │  Protocol Conv. │  │  Connection  │ │
│  │                 │  │                 │  │   Manager    │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│                   Kubernetes Cluster                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌──────────────┐ │
│  │  Deployment     │  │  Service        │  │  Secret      │ │
│  │  MCP Server     │  │  LoadBalancer   │  │  ConfigMap   │ │
│  │  Pod 1...N      │  │  Ingress        │  │  HPA         │ │
│  └─────────────────┘  └─────────────────┘  └──────────────┘ │
├─────────────────────────────────────────────────────────────┤
│              監控與日誌 (Prometheus + Grafana)               │
│                    Pulumi State Backend                    │
└─────────────────────────────────────────────────────────────┘
```

### 技術棧

- **前端**: Next.js 15, React, Tailwind CSS
- **後端**: NestJS, TypeScript
- **基礎設施即代碼**: Pulumi (TypeScript)
- **容器化**: Docker, Kubernetes
- **代理層**: Envoy Proxy / NGINX
- **監控**: Prometheus, Grafana, Jaeger
- **日誌**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **CI/CD**: GitHub Actions, ArgoCD
- **狀態後端**: Pulumi Cloud / AWS S3 / Azure Blob

## 用戶故事

### 開發者

```text
作為一個 MCP Server 開發者
我希望能夠一鍵將我的 stdio MCP Server 部署到雲端
以便我可以專注於業務邏輯而非基礎設施管理
```

### 運維工程師

```text
作為一個運維工程師
我希望有統一的監控和告警系統
以便我能及時發現和解決系統問題
```

### 系統管理員

```text
作為一個系統管理員
我希望能夠動態調整 MCP Server 的資源配置
以便根據業務需求優化成本和性能
```

## 功能需求

### 必須具備 (Must Have)

- [ ] MCP Proxy 基本功能（stdio 到網路協議轉換）
- [ ] Pulumi 基礎設施即代碼實現（Deployment、Service、Secret、Ingress）
- [ ] NestJS 與 Pulumi 引擎整合
- [ ] 基本的 Web 管理介面
- [ ] 健康檢查和重啟機制
- [ ] 基本監控指標

### 應該具備 (Should Have)

- [ ] 自動擴展 (HPA)
- [ ] 配置熱更新
- [ ] 日誌聚合
- [ ] API 介面
- [ ] 多環境支援

### 可以具備 (Could Have)

- [ ] 多租戶支援
- [ ] 自定義指標告警
- [ ] 分散式追蹤
- [ ] A/B 測試支援
- [ ] 成本分析

### 不會具備 (Won't Have)

- [ ] 直接修改 MCP Server 原始碼
- [ ] 支援非容器化部署
- [ ] 支援 Kubernetes 以外的編排平台

## 非功能性需求

### 性能需求

- **延遲**: MCP Proxy 增加的延遲不超過 50ms
- **吞吐量**: 單個代理實例支援至少 1000 併發連接
- **資源使用**: 代理服務記憶體使用不超過 512MB

### 可靠性需求

- **可用性**: 99.9% 的服務可用性
- **恢復時間**: 故障後 30 秒內自動恢復
- **數據持久性**: 配置數據 99.99% 持久性

### 擴展性需求

- **水平擴展**: 支援動態增減代理實例
- **垂直擴展**: 支援運行時調整資源配額
- **多區域**: 支援跨 AZ 部署

### 安全性需求

- **身份驗證**: 支援 OAuth 2.0 / OIDC
- **授權**: RBAC 權限控制
- **加密**: TLS 1.3 端到端加密
- **審計**: 完整的操作審計日誌

## Pulumi 基礎設施即代碼優勢

### 為什麼選擇 Pulumi

1. **TypeScript 原生支援**: 與 NestJS 使用相同語言，降低學習成本
2. **型別安全**: 編譯時檢查基礎設施配置錯誤
3. **狀態管理**: 自動追蹤資源狀態和變更
4. **預覽功能**: 在實際部署前預覽變更內容
5. **回滾能力**: 輕鬆回滾到任何歷史版本
6. **跨雲支援**: 支援多種雲端提供商和 Kubernetes

### Pulumi vs 傳統方案比較

| 特性     | Pulumi     | Kubectl/YAML | Helm         | Terraform |
| -------- | ---------- | ------------ | ------------ | --------- |
| 語言     | TypeScript | YAML         | YAML+Go 模板 | HCL       |
| 型別安全 | ✅         | ❌           | ❌           | 部分      |
| 程式邏輯 | ✅         | ❌           | 有限         | 有限      |
| 狀態管理 | ✅         | ❌           | ❌           | ✅        |
| 預覽變更 | ✅         | ❌           | 有限         | ✅        |
| 版本控制 | ✅         | 手動         | 手動         | ✅        |
| 學習曲線 | 低         | 中           | 中           | 高        |

### NestJS 與 Pulumi 整合範例

```typescript
// src/pulumi/pulumi.service.ts
import { Injectable, Logger } from '@nestjs/common';
import * as pulumi from '@pulumi/pulumi';
import * as automation from '@pulumi/pulumi/automation';
import { MCPServerInfrastructure } from './programs/mcp-server.program';

@Injectable()
export class PulumiService {
  private readonly logger = new Logger(PulumiService.name);

  async deployMCPServer(config: MCPDeploymentConfig): Promise<DeploymentResult> {
    const stackName = `mcp-server-${config.id}`;

    // 建立 Pulumi 程式
    const program = async () => {
      const infrastructure = new MCPServerInfrastructure('mcp-server', {
        id: config.id,
        image: config.image,
        apiKey: config.apiKey,
        domain: config.domain,
        namespace: config.namespace,
        replicas: config.replicas,
      });

      return {
        deploymentName: infrastructure.deployment.metadata.name,
        serviceName: infrastructure.service.metadata.name,
        ingressUrl: infrastructure.ingress.spec.rules[0].host,
      };
    };

    // 建立或獲取 Stack
    const stack = await automation.LocalWorkspace.createOrSelectStack({
      stackName,
      projectName: 'mcp-cloud',
      program,
    });

    // 設定配置
    await stack.setConfig('kubernetes:kubeconfig', { value: config.kubeconfig });
    await stack.setConfig('kubernetes:context', { value: config.context });

    // 執行部署
    try {
      this.logger.log(`Starting deployment for stack: ${stackName}`);

      // 預覽變更
      const previewResult = await stack.preview();
      this.logger.log(`Preview completed: ${previewResult.summary.totalSteps} steps`);

      // 執行部署
      const upResult = await stack.up();
      this.logger.log(`Deployment completed: ${upResult.summary.resourceChanges}`);

      return {
        success: true,
        stackName,
        outputs: upResult.outputs,
        summary: upResult.summary,
      };
    } catch (error) {
      this.logger.error(`Deployment failed for stack ${stackName}:`, error);
      throw new Error(`Pulumi deployment failed: ${error.message}`);
    }
  }

  async destroyMCPServer(stackName: string): Promise<void> {
    const stack = await automation.LocalWorkspace.selectStack({
      stackName,
      projectName: 'mcp-cloud',
      program: async () => {}, // Empty program for destroy
    });

    try {
      await stack.destroy();
      await stack.workspace.removeStack(stackName);
      this.logger.log(`Successfully destroyed stack: ${stackName}`);
    } catch (error) {
      this.logger.error(`Failed to destroy stack ${stackName}:`, error);
      throw error;
    }
  }

  async getStackStatus(stackName: string): Promise<StackStatus> {
    try {
      const stack = await automation.LocalWorkspace.selectStack({
        stackName,
        projectName: 'mcp-cloud',
        program: async () => ({}),
      });

      const history = await stack.history();
      const info = await stack.info();

      return {
        name: stackName,
        lastUpdate: history[0]?.updateTime,
        resourceCount: info?.resourceCount || 0,
        status: 'active',
      };
    } catch (error) {
      return {
        name: stackName,
        status: 'not-found',
        error: error.message,
      };
    }
  }
}

interface MCPDeploymentConfig {
  id: string;
  image: string;
  apiKey: string;
  domain: string;
  namespace?: string;
  replicas?: number;
  kubeconfig: string;
  context: string;
}

interface DeploymentResult {
  success: boolean;
  stackName: string;
  outputs?: any;
  summary?: any;
  error?: string;
}

interface StackStatus {
  name: string;
  lastUpdate?: Date;
  resourceCount?: number;
  status: 'active' | 'failed' | 'not-found';
  error?: string;
}
```

## 技術實現細節

### MCP Proxy 實現

```typescript
interface MCPProxyConfig {
  upstream: {
    command: string;
    args: string[];
    env: Record<string, string>;
  };
  downstream: {
    protocol: 'http' | 'websocket' | 'grpc';
    port: number;
    path?: string;
  };
  scaling: {
    minReplicas: number;
    maxReplicas: number;
    targetCPU: number;
  };
}

// Pulumi 整合介面
interface PulumiDeploymentConfig {
  stackName: string;
  projectName: string;
  config: MCPProxyConfig;
  kubernetesProvider: string;
}
```

### Pulumi 基礎設施定義

```typescript
// Pulumi 程式範例 - 使用 TypeScript 定義 Kubernetes 資源
import * as pulumi from '@pulumi/pulumi';
import * as k8s from '@pulumi/kubernetes';

export class MCPServerInfrastructure extends pulumi.ComponentResource {
  public readonly deployment: k8s.apps.v1.Deployment;
  public readonly service: k8s.core.v1.Service;
  public readonly secret: k8s.core.v1.Secret;
  public readonly ingress: k8s.networking.v1.Ingress;

  constructor(name: string, args: MCPServerArgs, opts?: pulumi.ComponentResourceOptions) {
    super('mcp:infrastructure:MCPServer', name, {}, opts);

    // 1. Secret - 環境變數和憑證
    this.secret = new k8s.core.v1.Secret(
      `${name}-secret`,
      {
        metadata: {
          name: `mcp-server-${args.id}-secret`,
          namespace: args.namespace || 'default',
        },
        data: {
          'api-key': Buffer.from(args.apiKey).toString('base64'),
        },
      },
      { parent: this }
    );

    // 2. Deployment - MCP Server 容器部署
    this.deployment = new k8s.apps.v1.Deployment(
      `${name}-deployment`,
      {
        metadata: {
          name: `mcp-server-${args.id}`,
          namespace: args.namespace || 'default',
        },
        spec: {
          replicas: args.replicas || 1,
          selector: {
            matchLabels: { app: `mcp-server-${args.id}` },
          },
          template: {
            metadata: {
              labels: { app: `mcp-server-${args.id}` },
            },
            spec: {
              containers: [
                {
                  name: 'mcp-server',
                  image: args.image,
                  ports: [{ containerPort: 8080 }],
                  envFrom: [
                    {
                      secretRef: { name: this.secret.metadata.name },
                    },
                  ],
                  resources: {
                    requests: { memory: '256Mi', cpu: '250m' },
                    limits: { memory: '512Mi', cpu: '500m' },
                  },
                },
              ],
            },
          },
        },
      },
      { parent: this }
    );

    // 3. Service - 負載均衡
    this.service = new k8s.core.v1.Service(
      `${name}-service`,
      {
        metadata: {
          name: `mcp-server-${args.id}-service`,
          namespace: args.namespace || 'default',
        },
        spec: {
          selector: { app: `mcp-server-${args.id}` },
          ports: [
            {
              port: 80,
              targetPort: 8080,
            },
          ],
          type: 'ClusterIP',
        },
      },
      { parent: this }
    );

    // 4. Ingress - 外部路由
    this.ingress = new k8s.networking.v1.Ingress(
      `${name}-ingress`,
      {
        metadata: {
          name: `mcp-server-${args.id}-ingress`,
          namespace: args.namespace || 'default',
          annotations: {
            'kubernetes.io/ingress.class': 'nginx',
            'cert-manager.io/cluster-issuer': 'letsencrypt-prod',
          },
        },
        spec: {
          tls: [
            {
              hosts: [`mcp-server-${args.id}.${args.domain}`],
              secretName: `mcp-server-${args.id}-tls`,
            },
          ],
          rules: [
            {
              host: `mcp-server-${args.id}.${args.domain}`,
              http: {
                paths: [
                  {
                    path: '/',
                    pathType: 'Prefix',
                    backend: {
                      service: {
                        name: this.service.metadata.name,
                        port: { number: 80 },
                      },
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      { parent: this }
    );
  }
}

interface MCPServerArgs {
  id: string;
  image: string;
  apiKey: string;
  domain: string;
  namespace?: string;
  replicas?: number;
}
```

### NestJS + Pulumi 整合結構

````typescript
// NestJS 服務整合 Pulumi 引擎
src/
├── pulumi/
│   ├── pulumi.service.ts         # Pulumi 引擎管理
│   ├── stack.service.ts          # Stack 生命週期管理
│   ├── programs/                 # Pulumi 程式目錄
│   │   ├── mcp-server.program.ts # MCP Server 基礎設施程式
│   │   ├── monitoring.program.ts # 監控基礎設施程式
│   │   └── networking.program.ts # 網路基礎設施程式
│   └── templates/                # 基礎設施模板
│       ├── deployment.ts
│       ├── service.ts
│       ├── secret.ts
│       └── ingress.ts
├── kubernetes/                   # Kubernetes 操作服務
│   ├── deployment.service.ts     # 透過 Pulumi 管理 Deployment
│   ├── service.service.ts        # 透過 Pulumi 管理 Service
│   ├── secret.service.ts         # 透過 Pulumi 管理 Secret
│   └── ingress.service.ts        # 透過 Pulumi 管理 Ingress
└── config/
    ├── pulumi.config.ts          # Pulumi 配置
    └── stack.config.ts           # Stack 配置管理
```## 開發里程碑

### Phase 1: 核心功能 (8 週)

- [ ] MCP Proxy 基本實現
- [ ] Pulumi TypeScript SDK 整合
- [ ] NestJS Pulumi 引擎服務
- [ ] 基礎資源管理（Deployment、Service、Secret、Ingress）
- [ ] 簡單的 Web UI
- [ ] 基本監控

### Phase 2: 增強功能 (6 週)

- [ ] 自動擴展 (HPA)
- [ ] Pulumi Stack 版本控制
- [ ] 配置管理和熱更新
- [ ] 完整的 Web UI
- [ ] API 介面

### Phase 3: 生產就緒 (4 週)

- [ ] 安全性強化
- [ ] 性能優化
- [ ] 文檔完善
- [ ] 測試覆蓋

### Phase 4: 高級功能 (6 週)

- [ ] 多租戶支援
- [ ] 高級監控
- [ ] 自動化 CI/CD
- [ ] 社區功能

## 風險評估

### 技術風險

- **複雜性**: MCP 協議適配的複雜度
- **性能**: 代理層可能成為瓶頸
- **相容性**: 不同 MCP Server 的相容性問題
- **Pulumi 狀態管理**: 多用戶環境下的狀態衝突和併發控制
- **基礎設施漂移**: Pulumi 狀態與實際 Kubernetes 資源的同步問題

### 緩解策略

- 分階段開發，逐步驗證技術可行性
- 早期性能測試和優化
- 建立標準化的 MCP Server 規範
- 使用 Pulumi 的鎖定機制和狀態後端確保併發安全
- 實施基礎設施漂移檢測和自動修復機制

## 成功指標

### 技術指標

- 部署時間從小時級降低到分鐘級
- 系統可用性達到 99.9%
- 平均響應時間 < 100ms

### 業務指標

- 月活躍用戶數 > 1000
- MCP Server 部署數量 > 10,000
- 用戶滿意度 > 4.5/5.0

## 附錄

### 相關文檔

- [Model Context Protocol 規範](https://spec.modelcontextprotocol.io/)
- [Kubernetes Operator 最佳實踐](https://kubernetes.io/docs/concepts/extend-kubernetes/operator/)
- [雲原生應用設計模式](https://12factor.net/)

### 術語表

- **MCP**: Model Context Protocol
- **stdio**: 標準輸入輸出
- **HPA**: Horizontal Pod Autoscaler
- **RBAC**: Role-Based Access Control
- **Pulumi**: 基礎設施即代碼工具，支援多種程式語言
- **Stack**: Pulumi 中的部署單位，包含一組相關的雲端資源
- **State Backend**: Pulumi 狀態檔案的儲存後端，用於追蹤資源狀態\*\*\*\*
````
