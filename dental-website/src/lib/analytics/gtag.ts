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

// Track when lead form modal is opened
export const trackFormModalOpen = (source: string) => {
  event('form_modal_open', {
    event_category: 'form',
    event_label: source,
  });
};

// Track when lead form is viewed on static pages (not in modal)
export const trackFormView = (source: string) => {
  event('form_view', {
    event_category: 'form',
    event_label: source,
  });
};

// Track lead form submissions
export const trackLead = () => {
  event('generate_lead', {
    event_category: 'form',
    event_label: 'contact_form',
  });

  // Custom conversion event
  event('conversion', {
    event_category: 'lead',
    value: 1,
  });
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
