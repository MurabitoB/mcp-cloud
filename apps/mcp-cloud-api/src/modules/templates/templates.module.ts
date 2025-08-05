import { Module } from '@nestjs/common';
import { TemplatesController } from './controllers/templates.controller';
import { TemplatesService } from './services/templates.service';

@Module({
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}