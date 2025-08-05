import { Controller, Get } from '@nestjs/common';
import { TemplatesService } from '../services/templates.service';

@Controller('v1/templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  getTemplates() {
    return this.templatesService.getTemplates();
  }
}