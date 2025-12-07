export interface Place {
  id: string;
  name: string;
  description: string;
  category: string;
  reason: string;
  location?: string;
  mapLink?: string;
  rating?: string;
  imageUrl?: string;
  tags: string[];
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    }[];
  };
}

export interface SearchState {
  destination: string;
  interests: string[];
  isLoading: boolean;
  results: Place[];
  groundingChunks: GroundingChunk[];
  error: string | null;
}

export enum ViewMode {
  HOME = 'HOME',
  RESULTS = 'RESULTS',
  ITINERARY = 'ITINERARY',
}

export interface ItineraryItem {
  time: string;
  activity: string;
  description: string;
  placeId?: string;
}

export interface Itinerary {
  title: string;
  items: ItineraryItem[];
}
