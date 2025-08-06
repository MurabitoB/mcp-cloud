import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TemplatesModule } from '../modules/templates/templates.module';
import { TemplateInstancesModule } from '../modules/template-instances/template-instances.module';
import { PrismaModule } from '../core/prisma/prisma.module';
import { KubernetesModule } from '../core/kubernetes/kubernetes.module';

@Module({
  imports: [PrismaModule, KubernetesModule, TemplatesModule, TemplateInstancesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
