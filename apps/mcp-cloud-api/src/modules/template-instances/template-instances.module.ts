import { Module } from '@nestjs/common';
import { TemplateInstancesController } from './template-instances.controller';
import { TemplateInstancesService } from './template-instances.service';

@Module({
  controllers: [TemplateInstancesController],
  providers: [TemplateInstancesService],
  exports: [TemplateInstancesService],
})
export class TemplateInstancesModule {}