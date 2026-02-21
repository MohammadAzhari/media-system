export const contentIndexMappings = {
  properties: {
    id: { type: 'keyword' as const },
    title: {
      type: 'text' as const,
      fields: { keyword: { type: 'keyword' as const } },
    },
    description: { type: 'text' as const },
    tags: { type: 'keyword' as const },
    mediaType: { type: 'keyword' as const },
    mediaUrl: { type: 'keyword' as const },
    isDeleted: { type: 'boolean' as const },
    isExternal: { type: 'boolean' as const },
    isMediaProcessed: { type: 'boolean' as const },
    language: { type: 'keyword' as const },
    processingMetadata: { type: 'object' as const, enabled: true },
    externalSource: { type: 'keyword' as const },
    externalMetadata: { type: 'object' as const, enabled: true },
    createdAt: {
      type: 'date' as const,
      format: 'strict_date_optional_time||epoch_millis' as const,
    },
    updatedAt: {
      type: 'date' as const,
      format: 'strict_date_optional_time||epoch_millis' as const,
    },
  },
} as const;