'use client';

import { useEffect, useState } from 'react';

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
}

const STORAGE_KEY = 'utm_params';
const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign'] as const;

function cleanAttribution(value: unknown): UTMParams {
  if (!value || typeof value !== 'object') return {};
  const source = value as Record<string, unknown>;
  const cleaned: UTMParams = {};

  for (const key of ATTRIBUTION_KEYS) {
    const item = source[key];
    if (typeof item === 'string' && item.trim()) cleaned[key] = item.trim().slice(0, 100);
  }
  return cleaned;
}

export function useUTMParams() {
  const [utmParams, setUtmParams] = useState<UTMParams>({});

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const fromUrl = cleanAttribution({
      utm_source: searchParams.get('utm_source'),
      utm_medium: searchParams.get('utm_medium'),
      utm_campaign: searchParams.get('utm_campaign'),
    });

    try {
      const savedValue = localStorage.getItem(STORAGE_KEY);
      const saved = savedValue ? cleanAttribution(JSON.parse(savedValue)) : {};
      const attribution = Object.keys(fromUrl).length > 0 ? fromUrl : saved;
      if (Object.keys(attribution).length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
      setUtmParams(attribution);
    } catch {
      setUtmParams(fromUrl);
    }
  }, []);

  const clearUTMParams = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUtmParams({});
  };

  const getUTMQueryString = () => {
    const params = new URLSearchParams();
    Object.entries(utmParams).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });
    return params.toString();
  };

  return {
    utmParams,
    clearUTMParams,
    getUTMQueryString,
    hasUTMParams: Object.keys(utmParams).length > 0,
  };
}
