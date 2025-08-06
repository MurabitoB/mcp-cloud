import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../core/prisma/prisma.service';
import {
  CreateTemplateDto,
  UpdateTemplateDto,
  TemplateQueryDto,
  TemplateResponseDto,
  TemplateFormDto,
} from './template.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  async getTemplates(queryParams?: TemplateQueryDto) {
    if (queryParams?.page || queryParams?.limit) {
      return this.getTemplatesWithPagination(
        queryParams.page,
        queryParams.limit,
        queryParams.search,
        queryParams.published_by
      );
    }

    const whereClause = this.buildWhereClause(
      queryParams?.search,
      queryParams?.published_by
    );

    const templates = await this.prisma.template.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return {
      templates: templates.map(this.transformTemplate),
    };
  }

  async getTemplatesWithPagination(
    page = 1,
    limit = 10,
    search?: string,
    published_by?: string
  ) {
    const skip = (page - 1) * limit;
    const whereClause = this.buildWhereClause(search, published_by);

    const [templates, total] = await Promise.all([
      this.prisma.template.findMany({
        skip,
        take: limit,
        where: whereClause,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.template.count({ where: whereClause }),
    ]);

    return {
      templates: templates.map(this.transformTemplate),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private buildWhereClause(
    search?: string,
    published_by?: string
  ): Prisma.TemplateWhereInput {
    const where: Prisma.TemplateWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { version: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (published_by) {
      where.published_by = published_by;
    }

    return where;
  }

  private transformTemplate = (
    template: Prisma.TemplateGetPayload<object>
  ): TemplateResponseDto => {
    return {
      ...template,
      form: template.form
        ? (template.form as unknown as TemplateFormDto)
        : undefined,
    };
  };

  async createTemplate(data: CreateTemplateDto): Promise<TemplateResponseDto> {
    try {
      // Validate form structure if provided
      if (data.form) {
        this.validateTemplateForm(data.form);
      }

      const template = await this.prisma.template.create({
        data: {
          name: data.name,
          description: data.description,
          version: data.version,
          image: data.image,
          published_by: data.published_by,
          form: data.form
            ? (data.form as unknown as Prisma.InputJsonValue)
            : undefined,
        },
      });

      return this.transformTemplate(template);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to create template');
    }
  }

  async getTemplateById(id: string): Promise<TemplateResponseDto> {
    const template = await this.prisma.template.findUnique({
      where: { id },
    });

    if (!template) {
      throw new NotFoundException(`Template with ID ${id} not found`);
    }

    return this.transformTemplate(template);
  }

  async updateTemplate(
    id: string,
    data: UpdateTemplateDto
  ): Promise<TemplateResponseDto> {
    // Check if template exists
    await this.getTemplateById(id);

    try {
      // Validate form structure if provided
      if (data.form) {
        this.validateTemplateForm(data.form);
      }

      const updateData: Prisma.TemplateUpdateInput = {};

      if (data.name !== undefined) updateData.name = data.name;
      if (data.description !== undefined)
        updateData.description = data.description;
      if (data.version !== undefined) updateData.version = data.version;
      if (data.image !== undefined) updateData.image = data.image;
      if (data.published_by !== undefined)
        updateData.published_by = data.published_by;
      if (data.form !== undefined)
        updateData.form = data.form as unknown as Prisma.InputJsonValue;

      const template = await this.prisma.template.update({
        where: { id },
        data: updateData,
      });

      return this.transformTemplate(template);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Failed to update template');
    }
  }

  async deleteTemplate(id: string): Promise<{ message: string }> {
    // Check if template exists
    await this.getTemplateById(id);

    await this.prisma.template.delete({
      where: { id },
    });

    return { message: 'Template deleted successfully' };
  }

  async duplicateTemplate(
    id: string,
    newName?: string
  ): Promise<TemplateResponseDto> {
    const originalTemplate = await this.getTemplateById(id);

    const duplicateData: CreateTemplateDto = {
      name: newName || `${originalTemplate.name} (Copy)`,
      description: originalTemplate.description || undefined,
      version: originalTemplate.version || undefined,
      image: originalTemplate.image || undefined,
      published_by: originalTemplate.published_by || undefined,
      form: originalTemplate.form,
    };

    return this.createTemplate(duplicateData);
  }

  async getTemplatesByPublisher(
    published_by: string,
    queryParams?: TemplateQueryDto
  ) {
    return this.getTemplates({
      ...queryParams,
      published_by,
    });
  }

  async searchTemplates(searchTerm: string, queryParams?: TemplateQueryDto) {
    return this.getTemplates({
      ...queryParams,
      search: searchTerm,
    });
  }

  private validateTemplateForm(form: TemplateFormDto): void {
    if (!form || typeof form !== 'object') {
      throw new BadRequestException('Form must be an object');
    }

    if (!form.fields || !Array.isArray(form.fields)) {
      throw new BadRequestException('Form must contain a fields array');
    }

    const validFieldTypes = [
      'text',
      'password',
      'email',
      'number',
      'textarea',
      'select',
      'checkbox',
      'radio',
    ];
    const validArgTypes = ['arg', 'env'];

    form.fields.forEach((field, index: number) => {
      if (!field.name || typeof field.name !== 'string') {
        throw new BadRequestException(
          `Field at index ${index} must have a valid name`
        );
      }

      if (!field.type || !validFieldTypes.includes(field.type)) {
        throw new BadRequestException(
          `Field at index ${index} must have a valid type: ${validFieldTypes.join(
            ', '
          )}`
        );
      }

      if (!field.label || typeof field.label !== 'string') {
        throw new BadRequestException(
          `Field at index ${index} must have a valid label`
        );
      }

      if (!field.argType || !validArgTypes.includes(field.argType)) {
        throw new BadRequestException(
          `Field at index ${index} must have a valid argType: ${validArgTypes.join(
            ', '
          )}`
        );
      }

      if (typeof field.required !== 'boolean') {
        throw new BadRequestException(
          `Field at index ${index} must have a valid required boolean value`
        );
      }

      if (field.defaultValue === undefined || field.defaultValue === null) {
        throw new BadRequestException(
          `Field at index ${index} must have a defaultValue`
        );
      }

      // Validate options for select and radio fields
      if (
        (field.type === 'select' || field.type === 'radio') &&
        (!field.options || !Array.isArray(field.options))
      ) {
        throw new BadRequestException(
          `Field at index ${index} with type ${field.type} must have an options array`
        );
      }
    });
  }
}
