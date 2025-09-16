export type Role = 'owner' | 'admin' | 'editor' | 'analyst';

export interface UserDoc {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  roles: Role[];
  createdAt: number;
}

export interface ChannelDoc {
  id: string;
  title: string;
  username?: string;
  chatId?: number;
  createdBy: string;
  createdAt: number;
}

export interface SourceDoc {
  id: string;
  type: 'rss' | 'api' | 'atom' | 'json';
  url: string;
  topic?: string;
  lang?: 'ru' | 'en';
  createdBy: string;
  createdAt: number;
}

export interface IdeaDoc {
  id: string;
  title: string;
  description?: string;
  url?: string;
  author?: string;
  image?: string;
  hash?: string;
  createdBy: string;
  createdAt: number;
}

export type PostStatus = 'draft' | 'review' | 'approved' | 'scheduled' | 'sent';

export interface PostDoc {
  id: string;
  title?: string;
  contentMd: string;
  attachments?: Array<{ type: 'photo' | 'video' | 'poll' | 'buttons'; data: any }>;
  channels: string[]; // channel ids
  status: PostStatus;
  comments?: Array<{ id: string; userId: string; text: string; createdAt: number }>;
  versions?: Array<{ id: string; contentMd: string; createdAt: number; userId: string }>;
  createdBy: string;
  createdAt: number;
  updatedAt: number;
}

export interface ScheduleDoc {
  id: string;
  postId: string;
  when: number; // epoch ms
  tz: string; // IANA tz
  mode: 'local' | 'cloud';
  bestSlot?: boolean;
}

export interface MetricDoc {
  id: string;
  channelId: string;
  date: string; // YYYY-MM-DD
  views: number;
  clicks: number;
  reactions: number;
}

export interface PromptDoc {
  id: string;
  name: string;
  template: string;
}

export interface SettingsDoc {
  id: string; // user id
  lang: 'ru' | 'en';
  timezone: string; // IANA
  brand?: { tone?: string; stopwords?: string[]; emojis?: boolean };
}

