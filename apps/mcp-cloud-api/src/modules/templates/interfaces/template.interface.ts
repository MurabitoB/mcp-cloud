import { Template as PrismaTemplate } from '@prisma/client';

export interface TemplateFormField {
  name: string;
  type:
    | 'text'
    | 'password'
    | 'email'
    | 'number'
    | 'textarea'
    | 'select'
    | 'checkbox'
    | 'radio';
  label: string;
  argType: 'arg' | 'env';
  required: boolean;
  defaultValue: string | number | boolean;
  options?: string[]; // For select, radio types
  placeholder?: string;
  description?: string;
}

export interface TemplateForm {
  fields: TemplateFormField[];
}

export interface Template extends Omit<PrismaTemplate, 'form'> {
  form?: TemplateForm;
}

export interface CreateTemplateDto {
  name: string;
  description?: string;
  version?: string;
  image?: string;
  published_by?: string;
  form?: TemplateForm;
}

export interface UpdateTemplateDto {
  name?: string;
  description?: string;
  version?: string;
  image?: string;
  published_by?: string;
  form?: TemplateForm;
}

export interface TemplateQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  published_by?: string;
}

export interface TemplateResponse {
  templates: Template[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
