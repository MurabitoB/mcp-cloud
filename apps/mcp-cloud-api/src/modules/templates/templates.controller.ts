import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { TemplatesService } from './templates.service';
import {
  TemplatesListResponseDto,
  TemplateResponseDto,
  DeleteTemplateResponseDto,
  TemplateQueryDto,
  CreateTemplateDto,
  UpdateTemplateDto,
} from './template.dto';

@ApiTags('Templates')
@Controller('v1/templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all templates',
    description:
      'Retrieve a list of all templates with optional filtering and pagination',
  })
  @ApiResponse({
    status: 200,
    description: 'List of templates retrieved successfully',
    type: TemplatesListResponseDto,
  })
  getTemplates(
    @Query() queryParams: TemplateQueryDto
  ): Promise<TemplatesListResponseDto> {
    return this.templatesService.getTemplates(queryParams);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a new template',
    description: 'Create a new template with the provided data',
  })
  @ApiBody({
    type: CreateTemplateDto,
    description: 'Template data to create',
  })
  @ApiResponse({
    status: 201,
    description: 'Template created successfully',
    type: TemplateResponseDto,
  })
  createTemplate(
    @Body() createTemplateDto: CreateTemplateDto
  ): Promise<TemplateResponseDto> {
    return this.templatesService.createTemplate(createTemplateDto);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get template by ID',
    description: 'Retrieve a specific template by its ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Template ID',
    example: '18823cdf-19ef-43a5-83d4-8bed208bf96d',
  })
  @ApiResponse({
    status: 200,
    description: 'Template retrieved successfully',
    type: TemplateResponseDto,
  })
  getTemplateById(@Param('id') id: string): Promise<TemplateResponseDto> {
    return this.templatesService.getTemplateById(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update template',
    description: 'Update an existing template with the provided data',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Template ID',
    example: '18823cdf-19ef-43a5-83d4-8bed208bf96d',
  })
  @ApiBody({
    type: UpdateTemplateDto,
    description: 'Template data to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Template updated successfully',
    type: TemplateResponseDto,
  })
  updateTemplate(
    @Param('id') id: string,
    @Body() updateTemplateDto: UpdateTemplateDto
  ): Promise<TemplateResponseDto> {
    return this.templatesService.updateTemplate(id, updateTemplateDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete template',
    description: 'Delete a template by its ID',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Template ID',
    example: '18823cdf-19ef-43a5-83d4-8bed208bf96d',
  })
  @ApiResponse({
    status: 200,
    description: 'Template deleted successfully',
    type: DeleteTemplateResponseDto,
  })
  deleteTemplate(@Param('id') id: string): Promise<DeleteTemplateResponseDto> {
    return this.templatesService.deleteTemplate(id);
  }

  @Post(':id/duplicate')
  @ApiOperation({
    summary: 'Duplicate template',
    description: 'Create a copy of an existing template',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Template ID to duplicate',
    example: '18823cdf-19ef-43a5-83d4-8bed208bf96d',
  })
  @ApiQuery({
    name: 'newName',
    required: false,
    type: String,
    description: 'New name for the duplicated template',
    example: 'My Custom Template Copy',
  })
  @ApiResponse({
    status: 201,
    description: 'Template duplicated successfully',
    type: TemplateResponseDto,
  })
  duplicateTemplate(
    @Param('id') id: string,
    @Query('newName') newName?: string
  ): Promise<TemplateResponseDto> {
    return this.templatesService.duplicateTemplate(id, newName);
  }

  @Get('search/:searchTerm')
  @ApiOperation({
    summary: 'Search templates',
    description: 'Search templates by name, description, or version',
  })
  @ApiParam({
    name: 'searchTerm',
    type: String,
    description: 'Search term',
    example: 'postgres',
  })
  @ApiResponse({
    status: 200,
    description: 'Search results retrieved successfully',
    type: TemplatesListResponseDto,
  })
  searchTemplates(
    @Param('searchTerm') searchTerm: string,
    @Query() queryParams: TemplateQueryDto
  ): Promise<TemplatesListResponseDto> {
    return this.templatesService.searchTemplates(searchTerm, queryParams);
  }
}
