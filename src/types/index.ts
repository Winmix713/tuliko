// src/types/index.ts

/** 
 * Code snippet structure for HTML, CSS, JS snippets
 */
export interface CodeSnippet {
  html?: string;
  css?: string;
  js?: string;
  [key: string]: string | undefined;
}

/**
 * User settings interface
 */
export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  codeFontSize: 'sm' | 'md' | 'lg';
  codeWrap: boolean;
  previewMode: 'desktop' | 'tablet' | 'mobile';
}

/**
 * User profile interface
 */
export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role: 'user' | 'admin';
  settings: UserSettings;
}

/**
 * Notification type
 */
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  title?: string;
  dismissible?: boolean;
  timeout?: number;
}

/**
 * Search filter options
 */
export interface SearchFilters {
  categories?: string[];
  tags?: string[];
  sortBy?: 'name' | 'date' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Component tag interface
 */
export interface Tag {
  id: string;
  name: string;
  color?: string;
}