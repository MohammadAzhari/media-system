export enum MediaType {
  VIDEO = 'video',
  AUDIO = 'audio',
}

export type ContentAttributes = {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  mediaType: MediaType;
  mediaUrl: string;
  isDeleted: boolean;
  isExternal: boolean;
  isMediaProcessed: boolean;
  language?: string;
  processingMetadata?: Record<string, unknown>;
  externalSource?: string;
  externalMetadata?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
};
