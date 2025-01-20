export interface Site {
  leads: unknown;
  id: string;
  name: string;
  path: string;
  metaTitle: string;
  metaDescription: string;
  metaIcon: string;
  content: any; // or specify a more detailed type based on your content structure
  userId: string;
  mediaLibrary: string[];
  createdAt?: string | number | Date;
  }
  

  export interface UnsplashPhoto {
    id: string;
    urls: {
      regular: string;
      small: string;
    };
    description?: string;
    alt_description?: string;
  }
  
  export interface UnsplashSearchResponse {
    results: UnsplashPhoto[];
  }
  
  export interface UnsplashRandomResponse {
    id: string;
    urls: {
      regular: string;
      small: string;
    };
    description?: string;
    alt_description?: string;
  }
  