/**
 * Schema definitions for validating API responses
 */

export const ImageSchema = {
  id: 'string',
  name: 'string',
  description: 'string',
  url: 'string',
  categoryId: 'string',
  uploadDate: 'string',
  metadata: 'object',
};

export const CategorySchema = {
  id: 'string',
  name: 'string',
  description: 'string',
  color: 'string',
};

export const AnnotationSchema = {
  id: 'string',
  imageId: 'number',
  type: 'string',
  coordinates: 'object',
  color: 'string',
  createdAt: 'string',
  updatedAt: 'string'
}; 