import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';

@Injectable()
export class KubernetesService implements OnModuleInit {
  private readonly logger = new Logger(KubernetesService.name);
  private kubeConfig!: k8s.KubeConfig;
  private coreV1Api!: k8s.CoreV1Api;
  private appsV1Api!: k8s.AppsV1Api;
  private networkingV1Api!: k8s.NetworkingV1Api;

  onModuleInit() {
    this.initializeKubernetesClient();
  }

  private initializeKubernetesClient() {
    try {
      this.kubeConfig = new k8s.KubeConfig();

      if (process.env.NODE_ENV === 'production') {
        // 在 K8s 集群內運行時使用 in-cluster 配置
        this.kubeConfig.loadFromCluster();
        this.logger.log('Loaded Kubernetes config from cluster');
      } else {
        // 開發環境使用本地 kubeconfig
        this.kubeConfig.loadFromDefault();
        this.logger.log('Loaded Kubernetes config from default');
      }

      this.coreV1Api = this.kubeConfig.makeApiClient(k8s.CoreV1Api);
      this.appsV1Api = this.kubeConfig.makeApiClient(k8s.AppsV1Api);
      this.networkingV1Api = this.kubeConfig.makeApiClient(k8s.NetworkingV1Api);

      this.logger.log('Kubernetes client initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize Kubernetes client', error);
    }
  }

  // Pod 操作
  async listPods(namespace = 'default') {
    try {
      const response = await this.coreV1Api.listNamespacedPod({ namespace });
      return response.items;
    } catch (error) {
      this.logger.error(`Failed to list pods in namespace ${namespace}`, error);
      throw error;
    }
  }

  async getPod(name: string, namespace = 'default') {
    try {
      const response = await this.coreV1Api.readNamespacedPod({
        name,
        namespace,
      });
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to get pod ${name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async deletePod(name: string, namespace = 'default') {
    try {
      const response = await this.coreV1Api.deleteNamespacedPod({
        name,
        namespace,
      });
      this.logger.log(`Pod ${name} deleted from namespace ${namespace}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to delete pod ${name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  // Deployment 操作
  async listDeployments(namespace = 'default') {
    try {
      const response = await this.appsV1Api.listNamespacedDeployment({
        namespace,
      });
      return response.items;
    } catch (error) {
      this.logger.error(
        `Failed to list deployments in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async getDeployment(name: string, namespace = 'default') {
    try {
      const response = await this.appsV1Api.readNamespacedDeployment({
        name,
        namespace,
      });
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to get deployment ${name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async createDeployment(deployment: k8s.V1Deployment, namespace = 'default') {
    try {
      const response = await this.appsV1Api.createNamespacedDeployment({
        namespace,
        body: deployment,
      });
      this.logger.log(`Deployment ${deployment.metadata?.name} created in namespace ${namespace}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to create deployment ${deployment.metadata?.name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async updateDeployment(name: string, deployment: k8s.V1Deployment, namespace = 'default') {
    try {
      const response = await this.appsV1Api.replaceNamespacedDeployment({
        name,
        namespace,
        body: deployment,
      });
      this.logger.log(`Deployment ${name} updated in namespace ${namespace}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to update deployment ${name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async deleteDeployment(name: string, namespace = 'default') {
    try {
      const response = await this.appsV1Api.deleteNamespacedDeployment({
        name,
        namespace,
      });
      this.logger.log(`Deployment ${name} deleted from namespace ${namespace}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to delete deployment ${name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async scaleDeployment(name: string, replicas: number, namespace = 'default') {
    try {
      const patch = {
        spec: {
          replicas,
        },
      };

      const response = await this.appsV1Api.patchNamespacedDeploymentScale({
        name,
        namespace,
        body: patch,
      });

      this.logger.log(`Deployment ${name} scaled to ${replicas} replicas`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to scale deployment ${name} to ${replicas} replicas`,
        error
      );
      throw error;
    }
  }

  // Service 操作
  async listServices(namespace = 'default') {
    try {
      const response = await this.coreV1Api.listNamespacedService({
        namespace,
      });
      return response?.items || [];
    } catch (error) {
      this.logger.error(
        `Failed to list services in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async getService(name: string, namespace = 'default') {
    try {
      const response = await this.coreV1Api.readNamespacedService({
        name,
        namespace,
      });
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to get service ${name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async createService(service: k8s.V1Service, namespace = 'default') {
    try {
      const response = await this.coreV1Api.createNamespacedService({
        namespace,
        body: service,
      });
      this.logger.log(`Service ${service.metadata?.name} created in namespace ${namespace}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to create service ${service.metadata?.name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async updateService(name: string, service: k8s.V1Service, namespace = 'default') {
    try {
      const response = await this.coreV1Api.replaceNamespacedService({
        name,
        namespace,
        body: service,
      });
      this.logger.log(`Service ${name} updated in namespace ${namespace}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to update service ${name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async deleteService(name: string, namespace = 'default') {
    try {
      const response = await this.coreV1Api.deleteNamespacedService({
        name,
        namespace,
      });
      this.logger.log(`Service ${name} deleted from namespace ${namespace}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to delete service ${name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  // Ingress 操作
  async listIngresses(namespace = 'default') {
    try {
      const response = await this.networkingV1Api.listNamespacedIngress({
        namespace,
      });
      return response?.items || [];
    } catch (error) {
      this.logger.error(
        `Failed to list ingresses in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async getIngress(name: string, namespace = 'default') {
    try {
      const response = await this.networkingV1Api.readNamespacedIngress({
        name,
        namespace,
      });
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to get ingress ${name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async createIngress(ingress: k8s.V1Ingress, namespace = 'default') {
    try {
      const response = await this.networkingV1Api.createNamespacedIngress({
        namespace,
        body: ingress,
      });
      this.logger.log(`Ingress ${ingress.metadata?.name} created in namespace ${namespace}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to create ingress ${ingress.metadata?.name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async updateIngress(name: string, ingress: k8s.V1Ingress, namespace = 'default') {
    try {
      const response = await this.networkingV1Api.replaceNamespacedIngress({
        name,
        namespace,
        body: ingress,
      });
      this.logger.log(`Ingress ${name} updated in namespace ${namespace}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to update ingress ${name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async deleteIngress(name: string, namespace = 'default') {
    try {
      const response = await this.networkingV1Api.deleteNamespacedIngress({
        name,
        namespace,
      });
      this.logger.log(`Ingress ${name} deleted from namespace ${namespace}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to delete ingress ${name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  // Secret 操作
  async listSecrets(namespace = 'default') {
    try {
      const response = await this.coreV1Api.listNamespacedSecret({
        namespace,
      });
      return response?.items || [];
    } catch (error) {
      this.logger.error(
        `Failed to list secrets in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async getSecret(name: string, namespace = 'default') {
    try {
      const response = await this.coreV1Api.readNamespacedSecret({
        name,
        namespace,
      });
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to get secret ${name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async createSecret(secret: k8s.V1Secret, namespace = 'default') {
    try {
      const response = await this.coreV1Api.createNamespacedSecret({
        namespace,
        body: secret,
      });
      this.logger.log(`Secret ${secret.metadata?.name} created in namespace ${namespace}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to create secret ${secret.metadata?.name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async updateSecret(name: string, secret: k8s.V1Secret, namespace = 'default') {
    try {
      const response = await this.coreV1Api.replaceNamespacedSecret({
        name,
        namespace,
        body: secret,
      });
      this.logger.log(`Secret ${name} updated in namespace ${namespace}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to update secret ${name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  async deleteSecret(name: string, namespace = 'default') {
    try {
      const response = await this.coreV1Api.deleteNamespacedSecret({
        name,
        namespace,
      });
      this.logger.log(`Secret ${name} deleted from namespace ${namespace}`);
      return response;
    } catch (error) {
      this.logger.error(
        `Failed to delete secret ${name} in namespace ${namespace}`,
        error
      );
      throw error;
    }
  }

  // Namespace 操作
  async listNamespaces() {
    try {
      const response = await this.coreV1Api.listNamespace();
      return response?.items || [];
    } catch (error) {
      this.logger.error('Failed to list namespaces', error);
      throw error;
    }
  }

  // 健康檢查
  async isConnected(): Promise<boolean> {
    try {
      await this.coreV1Api.listNamespace();
      return true;
    } catch (error) {
      this.logger.warn('Kubernetes connection check failed', error);
      return false;
    }
  }
}
