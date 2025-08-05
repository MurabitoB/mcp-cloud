import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TemplatesService } from '../services/templates.service';
import { TemplatesListResponseDto } from '../dto/template-response.dto';
import { TemplateQueryParamsDto } from '../dto/template-query.dto';

@ApiTags('Templates')
@Controller('v1/templates')
export class TemplatesController {
  constructor(private readonly templatesService: TemplatesService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all templates',
    description: 'Retrieve a list of all templates with optional filtering and pagination'
  })
  @ApiResponse({
    status: 200,
    description: 'List of templates retrieved successfully',
    type: TemplatesListResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request - Invalid query parameters'
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (starts from 1)',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page (max 100)',
    example: 10
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search term to filter templates by name, description, or version',
    example: 'postgres'
  })
  @ApiQuery({
    name: 'published_by',
    required: false,
    type: String,
    description: 'Filter templates by publisher',
    example: 'mcp-cloud-team'
  })
  getTemplates(@Query() queryParams: TemplateQueryParamsDto) {
    return this.templatesService.getTemplates(queryParams);
  }
}