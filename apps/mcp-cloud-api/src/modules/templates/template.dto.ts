import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsObject, IsBoolean, IsArray, ValidateNested, IsIn, IsNumber, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class TemplateFormFieldDto {
  @ApiProperty({
    description: 'Field name',
    example: 'database_url'
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Field type',
    enum: ['text', 'password', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio'],
    example: 'text'
  })
  @IsIn(['text', 'password', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio'])
  type!: 'text' | 'password' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';

  @ApiProperty({
    description: 'Field label',
    example: 'Database URL'
  })
  @IsString()
  label!: string;

  @ApiProperty({
    description: 'Argument type',
    enum: ['arg', 'env'],
    example: 'env'
  })
  @IsIn(['arg', 'env'])
  argType!: 'arg' | 'env';

  @ApiProperty({
    description: 'Whether field is required',
    example: true
  })
  @IsBoolean()
  required!: boolean;

  @ApiProperty({
    description: 'Default value',
    example: 'postgresql://localhost:5432/mydb'
  })
  defaultValue!: string | number | boolean;

  @ApiProperty({
    description: 'Options for select/radio fields',
    required: false,
    type: [String],
    example: ['option1', 'option2']
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @ApiProperty({
    description: 'Field placeholder',
    required: false,
    example: 'Enter database URL'
  })
  @IsOptional()
  @IsString()
  placeholder?: string;

  @ApiProperty({
    description: 'Field description',
    required: false,
    example: 'Connection string for the PostgreSQL database'
  })
  @IsOptional()
  @IsString()
  description?: string;
}

export class TemplateFormDto {
  @ApiProperty({
    description: 'Form fields',
    type: [TemplateFormFieldDto]
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateFormFieldDto)
  fields!: TemplateFormFieldDto[];
}

export class TemplateResponseDto {
  @ApiProperty({
    description: 'Template ID',
    example: 'uuid-string'
  })
  id!: string;

  @ApiProperty({
    description: 'Template name',
    example: 'PostgreSQL Database Template'
  })
  name!: string;

  @ApiProperty({
    description: 'Template description',
    required: false,
    example: 'A template for setting up PostgreSQL database connection'
  })
  description?: string | null;

  @ApiProperty({
    description: 'Template form configuration',
    required: false,
    type: TemplateFormDto
  })
  form?: TemplateFormDto;

  @ApiProperty({
    description: 'Template image/icon URL',
    required: false,
    example: 'https://example.com/postgresql-logo.png'
  })
  image?: string | null;

  @ApiProperty({
    description: 'Publisher of the template',
    required: false,
    example: 'mcp-cloud-team'
  })
  published_by?: string | null;

  @ApiProperty({
    description: 'Template version',
    required: false,
    example: '1.0.0'
  })
  version?: string | null;

  @ApiProperty({
    description: 'Creation timestamp',
    example: '2023-01-01T00:00:00.000Z'
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Last update timestamp',
    example: '2023-01-01T00:00:00.000Z'
  })
  updatedAt!: Date;
}

export class PaginationResponseDto {
  @ApiProperty({
    description: 'Current page number',
    example: 1
  })
  page!: number;

  @ApiProperty({
    description: 'Number of items per page',
    example: 10
  })
  limit!: number;

  @ApiProperty({
    description: 'Total number of items',
    example: 25
  })
  total!: number;

  @ApiProperty({
    description: 'Total number of pages',
    example: 3
  })
  totalPages!: number;
}

export class TemplatesListResponseDto {
  @ApiProperty({
    description: 'List of templates',
    type: [TemplateResponseDto]
  })
  templates!: TemplateResponseDto[];

  @ApiProperty({
    description: 'Pagination information (only present when using pagination)',
    type: PaginationResponseDto,
    required: false
  })
  pagination?: PaginationResponseDto;
}

export class DeleteTemplateResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Template deleted successfully'
  })
  message!: string;
}

export class CreateTemplateDto {
  @ApiProperty({
    description: 'Template name',
    example: 'PostgreSQL Database Template'
  })
  @IsString()
  name!: string;

  @ApiProperty({
    description: 'Template description',
    required: false,
    example: 'A template for setting up PostgreSQL database connection'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Template version',
    required: false,
    example: '1.0.0'
  })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiProperty({
    description: 'Template image/icon URL',
    required: false,
    example: 'https://example.com/postgresql-logo.png'
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Publisher of the template',
    required: false,
    example: 'mcp-cloud-team'
  })
  @IsOptional()
  @IsString()
  published_by?: string;

  @ApiProperty({
    description: 'Template form configuration',
    required: false
  })
  @IsOptional()
  @IsObject()
  form?: TemplateFormDto;
}

export class UpdateTemplateDto {
  @ApiProperty({
    description: 'Template name',
    required: false,
    example: 'PostgreSQL Database Template'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Template description',
    required: false,
    example: 'A template for setting up PostgreSQL database connection'
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Template version',
    required: false,
    example: '1.0.0'
  })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiProperty({
    description: 'Template image/icon URL',
    required: false,
    example: 'https://example.com/postgresql-logo.png'
  })
  @IsOptional()
  @IsString()
  image?: string;

  @ApiProperty({
    description: 'Publisher of the template',
    required: false,
    example: 'mcp-cloud-team'
  })
  @IsOptional()
  @IsString()
  published_by?: string;

  @ApiProperty({
    description: 'Template form configuration',
    required: false
  })
  @IsOptional()
  @IsObject()
  form?: TemplateFormDto;
}

export class TemplateQueryDto {
  @ApiProperty({
    description: 'Page number for pagination',
    required: false,
    minimum: 1,
    example: 1
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({
    description: 'Number of items per page',
    required: false,
    minimum: 1,
    maximum: 100,
    example: 10
  })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiProperty({
    description: 'Search term to filter templates by name, description, or version',
    required: false,
    example: 'postgres'
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Filter templates by publisher',
    required: false,
    example: 'mcp-cloud-team'
  })
  @IsOptional()
  @IsString()
  published_by?: string;
}