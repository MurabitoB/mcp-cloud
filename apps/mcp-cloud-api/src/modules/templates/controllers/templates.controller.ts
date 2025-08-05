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
    examples: {
      'without-pagination': {
        summary: 'Response without pagination',
        value: {
          templates: [
            {
              id: 'clxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
              name: 'PostgreSQL Database Template',
              description: 'A template for setting up PostgreSQL database connection',
              version: '1.0.0',
              image: 'https://example.com/postgresql-logo.png',
              published_by: 'mcp-cloud-team',
              form: {
                fields: [
                  {
                    name: 'database_url',
                    type: 'text',
                    label: 'Database URL',
                    argType: 'env',
                    required: true,
                    defaultValue: 'postgres://localhost:5432/mydb',
                    placeholder: 'Enter database connection string',
                    description: 'The PostgreSQL database connection URL'
                  },
                  {
                    name: 'database_name',
                    type: 'text',
                    label: 'Database Name',
                    argType: 'env',
                    required: true,
                    defaultValue: 'myapp_db'
                  }
                ]
              },
              createdAt: '2025-08-05T10:30:00.000Z',
              updatedAt: '2025-08-05T10:30:00.000Z'
            }
          ]
        }
      },
      'with-pagination': {
        summary: 'Response with pagination',
        value: {
          templates: [
            {
              id: 'clxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
              name: 'PostgreSQL Database Template',
              description: 'A template for setting up PostgreSQL database connection',
              version: '1.0.0',
              image: 'https://example.com/postgresql-logo.png',
              published_by: 'mcp-cloud-team',
              form: {
                fields: [
                  {
                    name: 'database_url',
                    type: 'text',
                    label: 'Database URL',
                    argType: 'env',
                    required: true,
                    defaultValue: 'postgres://localhost:5432/mydb'
                  }
                ]
              },
              createdAt: '2025-08-05T10:30:00.000Z',
              updatedAt: '2025-08-05T10:30:00.000Z'
            }
          ],
          pagination: {
            page: 1,
            limit: 10,
            total: 25,
            totalPages: 3
          }
        }
      }
    }
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