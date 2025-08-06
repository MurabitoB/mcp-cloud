import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto, UpdateTemplateDto } from './template.dto';
import { TemplateQueryParamsDto } from './dto/template-query.dto';

describe('TemplatesController', () => {
  let controller: TemplatesController;
  let service: TemplatesService;

  const mockTemplate = {
    id: '18823cdf-19ef-43a5-83d4-8bed208bf96d',
    name: 'Test Template',
    description: 'Test Description',
    version: '1.0.0',
    image: 'https://example.com/image.png',
    published_by: 'test-publisher',
    form: {
      fields: [
        {
          name: 'database_url',
          type: 'text' as const,
          label: 'Database URL',
          argType: 'env' as const,
          required: true,
          defaultValue: 'postgres://localhost:5432/test',
        },
      ],
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockService = {
    getTemplates: jest.fn(),
    createTemplate: jest.fn(),
    getTemplateById: jest.fn(),
    updateTemplate: jest.fn(),
    deleteTemplate: jest.fn(),
    duplicateTemplate: jest.fn(),
    searchTemplates: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TemplatesController],
      providers: [
        {
          provide: TemplatesService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<TemplatesController>(TemplatesController);
    service = module.get<TemplatesService>(TemplatesService);

    // Reset all mocks before each test
    Object.values(mockService).forEach((mock) => mock.mockReset());
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTemplates', () => {
    it('should return templates list', async () => {
      const queryParams: TemplateQueryParamsDto = { page: 1, limit: 10 };
      const expectedResult = {
        templates: [mockTemplate],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };

      mockService.getTemplates.mockResolvedValue(expectedResult);

      const result = await controller.getTemplates(queryParams);

      expect(result).toEqual(expectedResult);
      expect(service.getTemplates).toHaveBeenCalledWith(queryParams);
    });

    it('should handle empty query params', async () => {
      const queryParams: TemplateQueryParamsDto = {};
      const expectedResult = { templates: [mockTemplate] };

      mockService.getTemplates.mockResolvedValue(expectedResult);

      const result = await controller.getTemplates(queryParams);

      expect(result).toEqual(expectedResult);
      expect(service.getTemplates).toHaveBeenCalledWith(queryParams);
    });
  });

  describe('createTemplate', () => {
    it('should create a template with valid data', async () => {
      const createDto: CreateTemplateDto = {
        name: 'New Template',
        description: 'New Description',
        version: '1.0.0',
        image: 'https://example.com/image.png',
        published_by: 'test-publisher',
        form: {
          fields: [
            {
              name: 'test_field',
              type: 'text',
              label: 'Test Field',
              argType: 'env',
              required: true,
              defaultValue: 'default_value',
            },
          ],
        },
      };

      mockService.createTemplate.mockResolvedValue(mockTemplate);

      const result = await controller.createTemplate(createDto);

      expect(result).toEqual(mockTemplate);
      expect(service.createTemplate).toHaveBeenCalledWith(createDto);
    });

    it('should handle creation with minimal required data', async () => {
      const createDto: CreateTemplateDto = {
        name: 'Minimal Template',
      };

      mockService.createTemplate.mockResolvedValue({
        ...mockTemplate,
        name: 'Minimal Template',
        description: null,
        version: null,
        image: null,
        published_by: null,
        form: undefined,
      });

      const result = await controller.createTemplate(createDto);

      expect(result.name).toBe('Minimal Template');
      expect(service.createTemplate).toHaveBeenCalledWith(createDto);
    });

    it('should throw BadRequestException for invalid form structure', async () => {
      const createDto: CreateTemplateDto = {
        name: 'Invalid Template',
        form: {
          fields: [
            {
              name: '', // Invalid: empty name
              type: 'text',
              label: 'Test Field',
              argType: 'env',
              required: true,
              defaultValue: 'default_value',
            },
          ],
        },
      };

      mockService.createTemplate.mockRejectedValue(
        new BadRequestException('Field at index 0 must have a valid name')
      );

      await expect(controller.createTemplate(createDto)).rejects.toThrow(
        BadRequestException
      );
      expect(service.createTemplate).toHaveBeenCalledWith(createDto);
    });

    it('should throw BadRequestException for invalid field type', async () => {
      const createDto: CreateTemplateDto = {
        name: 'Invalid Template',
        form: {
          fields: [
            {
              name: 'test_field',
              type: 'invalid_type' as 'text', // Invalid field type
              label: 'Test Field',
              argType: 'env',
              required: true,
              defaultValue: 'default_value',
            },
          ],
        },
      };

      mockService.createTemplate.mockRejectedValue(
        new BadRequestException(
          'Field at index 0 must have a valid type: text, password, email, number, textarea, select, checkbox, radio'
        )
      );

      await expect(controller.createTemplate(createDto)).rejects.toThrow(
        BadRequestException
      );
    });

    it('should throw BadRequestException for missing required field properties', async () => {
      const createDto: CreateTemplateDto = {
        name: 'Invalid Template',
        form: {
          fields: [
            {
              name: 'test_field',
              type: 'text',
              label: 'Test Field',
              argType: 'env',
              required: true,
              // Missing defaultValue
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any,
          ],
        },
      };

      mockService.createTemplate.mockRejectedValue(
        new BadRequestException('Field at index 0 must have a defaultValue')
      );

      await expect(controller.createTemplate(createDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });

  describe('getTemplateById', () => {
    it('should return a template by id', async () => {
      const templateId = '18823cdf-19ef-43a5-83d4-8bed208bf96d';

      mockService.getTemplateById.mockResolvedValue(mockTemplate);

      const result = await controller.getTemplateById(templateId);

      expect(result).toEqual(mockTemplate);
      expect(service.getTemplateById).toHaveBeenCalledWith(templateId);
    });

    it('should throw NotFoundException for non-existent template', async () => {
      const templateId = 'non-existent-id';

      mockService.getTemplateById.mockRejectedValue(
        new NotFoundException(`Template with ID ${templateId} not found`)
      );

      await expect(controller.getTemplateById(templateId)).rejects.toThrow(
        NotFoundException
      );
      expect(service.getTemplateById).toHaveBeenCalledWith(templateId);
    });
  });

  describe('updateTemplate', () => {
    it('should update a template with valid data', async () => {
      const templateId = '18823cdf-19ef-43a5-83d4-8bed208bf96d';
      const updateDto: UpdateTemplateDto = {
        name: 'Updated Template',
        description: 'Updated Description',
      };

      const updatedTemplate = { ...mockTemplate, ...updateDto };
      mockService.updateTemplate.mockResolvedValue(updatedTemplate);

      const result = await controller.updateTemplate(templateId, updateDto);

      expect(result).toEqual(updatedTemplate);
      expect(service.updateTemplate).toHaveBeenCalledWith(
        templateId,
        updateDto
      );
    });

    it('should update template with form validation', async () => {
      const templateId = '18823cdf-19ef-43a5-83d4-8bed208bf96d';
      const updateDto: UpdateTemplateDto = {
        form: {
          fields: [
            {
              name: 'updated_field',
              type: 'select',
              label: 'Updated Select Field',
              argType: 'arg',
              required: false,
              defaultValue: 'option1',
              options: ['option1', 'option2', 'option3'],
            },
          ],
        },
      };

      const updatedTemplate = { ...mockTemplate, ...updateDto };
      mockService.updateTemplate.mockResolvedValue(updatedTemplate);

      const result = await controller.updateTemplate(templateId, updateDto);

      expect(result).toEqual(updatedTemplate);
      expect(service.updateTemplate).toHaveBeenCalledWith(
        templateId,
        updateDto
      );
    });

    it('should throw NotFoundException when updating non-existent template', async () => {
      const templateId = 'non-existent-id';
      const updateDto: UpdateTemplateDto = { name: 'Updated Name' };

      mockService.updateTemplate.mockRejectedValue(
        new NotFoundException(`Template with ID ${templateId} not found`)
      );

      await expect(
        controller.updateTemplate(templateId, updateDto)
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException for invalid form update', async () => {
      const templateId = '18823cdf-19ef-43a5-83d4-8bed208bf96d';
      const updateDto: UpdateTemplateDto = {
        form: {
          fields: [
            {
              name: 'select_field',
              type: 'select',
              label: 'Select Field',
              argType: 'arg',
              required: true,
              defaultValue: 'option1',
              // Missing options for select field
            },
          ],
        },
      };

      mockService.updateTemplate.mockRejectedValue(
        new BadRequestException(
          'Field at index 0 with type select must have an options array'
        )
      );

      await expect(
        controller.updateTemplate(templateId, updateDto)
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteTemplate', () => {
    it('should delete a template', async () => {
      const templateId = '18823cdf-19ef-43a5-83d4-8bed208bf96d';
      const expectedResult = { message: 'Template deleted successfully' };

      mockService.deleteTemplate.mockResolvedValue(expectedResult);

      const result = await controller.deleteTemplate(templateId);

      expect(result).toEqual(expectedResult);
      expect(service.deleteTemplate).toHaveBeenCalledWith(templateId);
    });

    it('should throw NotFoundException when deleting non-existent template', async () => {
      const templateId = 'non-existent-id';

      mockService.deleteTemplate.mockRejectedValue(
        new NotFoundException(`Template with ID ${templateId} not found`)
      );

      await expect(controller.deleteTemplate(templateId)).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('duplicateTemplate', () => {
    it('should duplicate a template with default name', async () => {
      const templateId = '18823cdf-19ef-43a5-83d4-8bed208bf96d';
      const duplicatedTemplate = {
        ...mockTemplate,
        id: 'new-duplicate-id',
        name: 'Test Template (Copy)',
      };

      mockService.duplicateTemplate.mockResolvedValue(duplicatedTemplate);

      const result = await controller.duplicateTemplate(templateId);

      expect(result).toEqual(duplicatedTemplate);
      expect(service.duplicateTemplate).toHaveBeenCalledWith(
        templateId,
        undefined
      );
    });

    it('should duplicate a template with custom name', async () => {
      const templateId = '18823cdf-19ef-43a5-83d4-8bed208bf96d';
      const newName = 'My Custom Copy';
      const duplicatedTemplate = {
        ...mockTemplate,
        id: 'new-duplicate-id',
        name: newName,
      };

      mockService.duplicateTemplate.mockResolvedValue(duplicatedTemplate);

      const result = await controller.duplicateTemplate(templateId, newName);

      expect(result).toEqual(duplicatedTemplate);
      expect(service.duplicateTemplate).toHaveBeenCalledWith(
        templateId,
        newName
      );
    });
  });

  describe('searchTemplates', () => {
    it('should search templates by term', async () => {
      const searchTerm = 'postgres';
      const queryParams: TemplateQueryParamsDto = { page: 1, limit: 10 };
      const expectedResult = {
        templates: [mockTemplate],
        pagination: { page: 1, limit: 10, total: 1, totalPages: 1 },
      };

      mockService.searchTemplates.mockResolvedValue(expectedResult);

      const result = await controller.searchTemplates(searchTerm, queryParams);

      expect(result).toEqual(expectedResult);
      expect(service.searchTemplates).toHaveBeenCalledWith(
        searchTerm,
        queryParams
      );
    });
  });
});
