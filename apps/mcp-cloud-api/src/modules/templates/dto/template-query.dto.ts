import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Transform } from 'class-transformer';

export class TemplateQueryParamsDto {
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
