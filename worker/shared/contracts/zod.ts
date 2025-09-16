import { z } from 'zod';

// /api/v1/rss/pull
export const RssPullRequest = z.object({
  sources: z.array(z.string().url()).optional(),
  topic: z.string().default(''),
  lang: z.enum(['ru','en']).default('ru'),
  timeoutMs: z.number().int().min(2000).max(20000).default(10000),
  retries: z.number().int().min(0).max(3).default(1),
});
export type RssPullRequest = z.infer<typeof RssPullRequest>;

export const RssPullResponse = z.object({
  ok: z.boolean(),
  count: z.number().int().min(0),
});
export type RssPullResponse = z.infer<typeof RssPullResponse>;

// /api/v1/ideas
export const IdeasListQuery = z.object({
  limit: z.number().int().min(1).max(100).default(50),
  cursor: z.string().optional(),
});
export type IdeasListQuery = z.infer<typeof IdeasListQuery>;

export const IdeaItem = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  summary: z.string().optional(),
  image: z.string().url().optional(),
  publishedAt: z.number().int().optional(),
  hash: z.string(),
});
export type IdeaItem = z.infer<typeof IdeaItem>;

export const IdeasListResponse = z.object({
  items: z.array(IdeaItem),
  nextCursor: z.string().nullable(),
});
export type IdeasListResponse = z.infer<typeof IdeasListResponse>;

// /api/v1/ai/improve
export const AIImproveRequest = z.object({
  variant: z.enum(['short','interactive','detailed']).default('short'),
  text: z.string().min(1),
  brand: z.object({
    tone: z.string().optional(),
    emojis: z.boolean().optional(),
    hashtags: z.boolean().optional(),
    cta: z.boolean().optional(),
  }).optional(),
});
export type AIImproveRequest = z.infer<typeof AIImproveRequest>;

export const AIImproveResponse = z.object({
  parts: z.array(z.string()),
});
export type AIImproveResponse = z.infer<typeof AIImproveResponse>;

// /api/v1/tg
export const TgProxyRequest = z.object({
  method: z.string().min(1),
  payload: z.unknown(),
});
export type TgProxyRequest = z.infer<typeof TgProxyRequest>;

export const TgProxyResponse = z.object({
  ok: z.boolean(),
  result: z.unknown(),
});
export type TgProxyResponse = z.infer<typeof TgProxyResponse>;

// /api/v1/redirect/:id
export const RedirectMetricsResponse = z.object({
  id: z.string(),
  count: z.number().int().min(0),
});
export type RedirectMetricsResponse = z.infer<typeof RedirectMetricsResponse>;

