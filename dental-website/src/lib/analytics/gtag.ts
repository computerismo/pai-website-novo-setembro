'use client';

// Google Analytics tracking
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Track page views
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_location: url,
    });
  }
};

// Track events
export const event = (
  action: string,
  {
    event_category = 'general',
    event_label,
    value,
  }: {
    event_category?: string;
    event_label?: string;
    value?: number;
  }
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category,
      event_label,
      value,
    });
  }
};

// Track lead form submissions
export const trackLead = (data: {
  treatment: string;
  page: string;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}) => {
  event('generate_lead', {
    event_category: 'form',
    event_label: `${data.treatment} - ${data.page}`,
  });

  // Custom conversion event
  event('conversion', {
    event_category: 'lead',
    event_label: data.treatment,
    value: 1,
  });

  // Track campaign source if available
  if (data.utm_source) {
    event('campaign_conversion', {
      event_category: data.utm_source,
      event_label: data.utm_campaign || 'unknown',
    });
  }
};

// Track WhatsApp clicks
export const trackWhatsApp = (source: string) => {
  event('whatsapp_click', {
    event_category: 'contact',
    event_label: source,
  });
};

// Track phone clicks
export const trackPhoneCall = (source: string) => {
  event('phone_call', {
    event_category: 'contact',
    event_label: source,
  });
};

// Track page engagement
export const trackEngagement = (action: string, page: string) => {
  event(action, {
    event_category: 'engagement',
    event_label: page,
  });
};