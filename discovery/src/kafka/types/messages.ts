

import type { ContentAttributes } from '../../types/content';

export type ContentCreatedMessage = ContentAttributes;

export type ContentUpdatedMessage = {
  id: string;
  before: ContentAttributes;
  after: ContentAttributes;
};

export type ContentDeletedMessage = {
  id: string;
};