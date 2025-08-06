import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { TemplateInstancesService } from './template-instances.service';

@ApiTags('Template Instances')
@Controller('v1/template/instances')
export class TemplateInstancesController {
  constructor(
    private readonly templateInstancesService: TemplateInstancesService
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get all template instances',
    description:
      'Retrieve a list of all template instances with optional filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'List of template instances retrieved successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid query parameters',
  })
  getTemplateInstances(@Query() queryParams?: any) {
    return this.templateInstancesService.getTemplateInstances();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get template instance by ID',
    description: 'Retrieve a specific template instance by its ID',
  })
  @ApiParam({
    name: 'id',
    description: 'Template instance ID',
    example: '18823cdf-19ef-43a5-83d4-8bed208bf96d',
  })
  @ApiResponse({
    status: 200,
    description: 'Template instance retrieved successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Template instance not found',
  })
  getTemplateInstanceById(@Param('id') id: string) {
    return this.templateInstancesService.getTemplateInstanceById(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Create template instance',
    description: 'Create a new template instance',
  })
  @ApiResponse({
    status: 201,
    description: 'Template instance created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid input data',
  })
  createTemplateInstance(@Body() createData: any) {
    return this.templateInstancesService.createTemplateInstance(createData);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update template instance',
    description: 'Update an existing template instance',
  })
  @ApiParam({
    name: 'id',
    description: 'Template instance ID',
    example: '18823cdf-19ef-43a5-83d4-8bed208bf96d',
  })
  @ApiResponse({
    status: 200,
    description: 'Template instance updated successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Template instance not found',
  })
  updateTemplateInstance(@Param('id') id: string, @Body() updateData: any) {
    return this.templateInstancesService.updateTemplateInstance(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete template instance',
    description: 'Delete a template instance',
  })
  @ApiParam({
    name: 'id',
    description: 'Template instance ID',
    example: '18823cdf-19ef-43a5-83d4-8bed208bf96d',
  })
  @ApiResponse({
    status: 200,
    description: 'Template instance deleted successfully',
  })
  @ApiResponse({
    status: 404,
    description: 'Template instance not found',
  })
  deleteTemplateInstance(@Param('id') id: string) {
    return this.templateInstancesService.deleteTemplateInstance(id);
  }

}
