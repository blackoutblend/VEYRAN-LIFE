export type ContentStatus = 'published' | 'draft' | 'scheduled';

export type CategoryName = 'Travel' | 'Lifestyle' | 'Culture' | 'People' | 'Feature' | 'Campaign';

export interface MediaAsset {
  id: string;
  title: string;
  url: string;
  category: CategoryName;
  collection: string;
  featuredPerson: string;
  location: string;
  caption: string;
  tags: string[];
  status: 'published' | 'draft';
  createdAt: string;
}

export interface ProfileMeta {
  field: string;
  base: string;
  focus: string;
  knownFor: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: CategoryName;
  authorName: string;
  location: string;
  featuredPerson?: string;
  coverMediaId: string;
  spreadMediaId?: string;
  pageNumber?: number;
  pullQuote?: string;
  profileMeta?: ProfileMeta;
  excerpt: string;
  body: string[];
  tags: string[];
  archiveNote?: string;
  isFeatured: boolean;
  status: ContentStatus;
  publishedAt: string;
}

export interface MagazineIssue {
  id: string;
  volume: string;
  issueNumber: string;
  title: string;
  subtitle: string;
  category: 'Travel' | 'Lifestyle' | 'Culture' | 'Specials';
  coverMediaId: string;
  campaignAdMediaId?: string;
  editorsLetter: string;
  articleIds: string[];
  publishedAt: string;
  status: ContentStatus;
}

export interface SiteSettings {
  publicationName: string;
  tagline: string;
  heroSlideArticleIds: string[];
  featuredIssueId: string;
  featuredCampaignMediaId: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'editor';
}
