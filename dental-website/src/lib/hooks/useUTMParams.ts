'use client';

import { useEffect, useState } from 'react';

export interface UTMParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
}

export function useUTMParams() {
  const [utmParams, setUtmParams] = useState<UTMParams>({});

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Captura parâmetros UTM da URL
    const searchParams = new URLSearchParams(window.location.search);
    const params: UTMParams = {
      utm_source: searchParams.get('utm_source') || undefined,
      utm_medium: searchParams.get('utm_medium') || undefined,
      utm_campaign: searchParams.get('utm_campaign') || undefined,
      utm_term: searchParams.get('utm_term') || undefined,
      utm_content: searchParams.get('utm_content') || undefined,
      gclid: searchParams.get('gclid') || undefined,
      fbclid: searchParams.get('fbclid') || undefined,
    };

    // Remove parâmetros undefined para não poluir o localStorage
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    if (Object.keys(cleanParams).length > 0) {
      // Salva no localStorage para persistir durante a sessão
      localStorage.setItem('utm_params', JSON.stringify(cleanParams));
      setUtmParams(cleanParams);
    } else {
      // Se não há parâmetros na URL, tenta recuperar do localStorage
      const savedParams = localStorage.getItem('utm_params');
      if (savedParams) {
        try {
          setUtmParams(JSON.parse(savedParams));
        } catch (error) {
          console.warn('Erro ao parsear UTM params do localStorage:', error);
        }
      }
    }
  }, []);

  // Função para limpar os parâmetros UTM
  const clearUTMParams = () => {
    localStorage.removeItem('utm_params');
    setUtmParams({});
  };

  // Função para converter os parâmetros em query string
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