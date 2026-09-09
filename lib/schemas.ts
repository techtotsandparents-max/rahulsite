export interface PostSchema {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: 'CLOUD_ARCHITECTURE' | 'AI_LESSONS' | 'TRAVEL_JOURNAL' | 'CAREER';
  readTime: number;
  publishedAt: string;
  externalUrl?: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface TravelAdventureSchema {
  id: string;
  slug: string;
  destination: string;
  country: string;
  countryCode: string;
  cities: string[];
  excerpt: string;
  visitedAt: string;
  endedAt?: string;
  isCurrent: boolean;
  coverImage: string;
  profilePhotoAtLocation?: string;
  photos: string[];
  highlights: string[];
  travelStyle: 'solo' | 'team' | 'remote-work' | 'leisure';
  emoji: string;
  lat: number;
  lng: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectSchema {
  id: string;
  slug: string;
  title: string;
  description: string;
  tech: string[];
  githubUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface VideoSchema {
  id: string;
  youtubeId: string;
  title: string;
  topic: string;
  createdAt?: string;
  updatedAt?: string;
}
