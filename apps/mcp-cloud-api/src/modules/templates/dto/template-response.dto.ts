import { ApiProperty } from '@nestjs/swagger';

export class TemplateFormFieldResponseDto {
  @ApiProperty({
    description: 'Field name',
    example: 'database_url'
  })
  name!: string;

  @ApiProperty({
    description: 'Field type',
    enum: ['text', 'password', 'email', 'number', 'textarea', 'select', 'checkbox', 'radio'],
    example: 'text'
  })
  type!: 'text' | 'password' | 'email' | 'number' | 'textarea' | 'select' | 'checkbox' | 'radio';

  @ApiProperty({
    description: 'Field label for display',
    example: 'Database URL'
  })
  label!: string;

  @ApiProperty({
    description: 'Argument type for template processing',
    enum: ['arg', 'env'],
    example: 'env'
  })
  argType!: 'arg' | 'env';

  @ApiProperty({
    description: 'Whether the field is required',
    example: true
  })
  required!: boolean;

  @ApiProperty({
    description: 'Default value for the field',
    oneOf: [
      { type: 'string' },
      { type: 'number' },
      { type: 'boolean' }
    ],
    example: 'postgres://localhost:5432/mydb'
  })
  defaultValue!: string | number | boolean;

  @ApiProperty({
    description: 'Options for select/radio fields',
    type: [String],
    required: false,
    example: ['option1', 'option2', 'option3']
  })
  options?: string[];

  @ApiProperty({
    description: 'Placeholder text',
    required: false,
    example: 'Enter database connection string'
  })
  placeholder?: string;

  @ApiProperty({
    description: 'Field description',
    required: false,
    example: 'The PostgreSQL database connection URL'
  })
  description?: string;
}

export class TemplateFormResponseDto {
  @ApiProperty({
    description: 'Form fields configuration',
    type: [TemplateFormFieldResponseDto]
  })
  fields!: TemplateFormFieldResponseDto[];
}

export class TemplateResponseDto {
  @ApiProperty({
    description: 'Template unique identifier',
    example: 'clxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
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
    nullable: true,
    example: 'A template for setting up PostgreSQL database connection'
  })
  description?: string | null;

  @ApiProperty({
    description: 'Template version',
    required: false,
    nullable: true,
    example: '1.0.0'
  })
  version?: string | null;

  @ApiProperty({
    description: 'Template image/icon URL',
    required: false,
    nullable: true,
    example: 'https://example.com/postgresql-logo.png'
  })
  image?: string | null;

  @ApiProperty({
    description: 'Publisher of the template',
    required: false,
    nullable: true,
    example: 'mcp-cloud-team'
  })
  published_by?: string | null;

  @ApiProperty({
    description: 'Template form configuration',
    type: TemplateFormResponseDto,
    required: false
  })
  form?: TemplateFormResponseDto;

  @ApiProperty({
    description: 'Template creation timestamp',
    example: '2025-08-05T10:30:00.000Z'
  })
  createdAt!: Date;

  @ApiProperty({
    description: 'Template last update timestamp',
    example: '2025-08-05T10:30:00.000Z'
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
