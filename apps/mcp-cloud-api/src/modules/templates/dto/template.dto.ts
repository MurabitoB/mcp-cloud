export interface TemplateFormFieldDto {
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
  options?: string[];
  placeholder?: string;
  description?: string;
}

export interface TemplateFormDto {
  fields: TemplateFormFieldDto[];
}

export interface CreateTemplateDto {
  name: string;
  description?: string;
  version?: string;
  image?: string;
  published_by?: string;
  form?: TemplateFormDto;
}

export interface UpdateTemplateDto {
  name?: string;
  description?: string;
  version?: string;
  image?: string;
  published_by?: string;
  form?: TemplateFormDto;
}

export interface TemplateQueryDto {
  page?: number;
  limit?: number;
  search?: string;
  published_by?: string;
}
