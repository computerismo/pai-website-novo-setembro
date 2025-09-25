export interface GtagConfig {
  page_location?: string;
  page_title?: string;
  custom_map?: Record<string, string>;
}

export interface GtagEvent {
  event_category?: string;
  event_label?: string;
  value?: number;
  [key: string]: any;
}

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: GtagConfig | GtagEvent
    ) => void;
  }
}

export {};