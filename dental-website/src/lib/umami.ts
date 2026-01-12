/**
 * Umami Analytics API Client
 * 
 * This client handles authentication and data fetching from the Umami API.
 * Used server-side only - credentials should never be exposed to the client.
 */

interface UmamiStats {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
}

interface UmamiPageview {
  x: string; // timestamp
  y: number; // count
}

interface UmamiMetric {
  x: string; // value (page path, browser name, etc.)
  y: number; // visitor count
}

interface UmamiRealtime {
  countries: Record<string, number>;
  urls: Record<string, number>;
  referrers: Record<string, number>;
  totals: {
    views: number;
    visitors: number;
    events: number;
    countries: number;
  };
}

class UmamiClient {
  private token: string | null = null;
  private tokenExpiry: Date | null = null;
  
  private get baseUrl(): string {
    return process.env.UMAMI_URL || '';
  }
  
  private get username(): string {
    return process.env.UMAMI_USERNAME || '';
  }
  
  private get password(): string {
    return process.env.UMAMI_PASSWORD || '';
  }
  
  private get websiteId(): string {
    return process.env.UMAMI_WEBSITE_ID || '';
  }

  /**
   * Get or refresh the authentication token
   */
  async getToken(): Promise<string> {
    // Return cached token if still valid (with 1 hour buffer)
    if (this.token && this.tokenExpiry && this.tokenExpiry > new Date(Date.now() + 3600000)) {
      return this.token;
    }
    
    if (!this.baseUrl || !this.username || !this.password) {
      throw new Error('Umami credentials not configured');
    }

    const res = await fetch(`${this.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
      }),
    });
    
    if (!res.ok) {
      throw new Error(`Failed to authenticate with Umami: ${res.status}`);
    }
    
    const data = await res.json();
    this.token = data.token;
    // Token expires in 24 hours
    this.tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return this.token!;
  }

  /**
   * Make an authenticated request to the Umami API
   */
  private async request<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    const token = await this.getToken();
    
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }
    
    const res = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
      // Cache for 5 minutes
      next: { revalidate: 300 },
    });
    
    if (!res.ok) {
      throw new Error(`Umami API error: ${res.status}`);
    }
    
    return res.json();
  }

  /**
   * Get summarized website statistics
   */
  async getStats(startAt: number, endAt: number): Promise<UmamiStats> {
    return this.request<UmamiStats>(`/api/websites/${this.websiteId}/stats`, {
      startAt,
      endAt,
    });
  }

  /**
   * Get pageviews over time
   */
  async getPageviews(startAt: number, endAt: number, unit: 'hour' | 'day' | 'month' | 'year' = 'day'): Promise<{
    pageviews: UmamiPageview[];
    sessions: UmamiPageview[];
  }> {
    return this.request(`/api/websites/${this.websiteId}/pageviews`, {
      startAt,
      endAt,
      unit,
      timezone: 'America/Sao_Paulo',
    });
  }

  /**
   * Get metrics (top pages, referrers, browsers, etc.)
   */
  async getMetrics(
    startAt: number, 
    endAt: number, 
    type: 'path' | 'entry' | 'exit' | 'referrer' | 'channel' | 'query' | 'browser' | 'os' | 'device' | 'country' | 'city' | 'language' | 'screen' | 'event' | 'title',
    limit: number = 10
  ): Promise<UmamiMetric[]> {
    return this.request(`/api/websites/${this.websiteId}/metrics`, {
      startAt,
      endAt,
      type,
      limit,
    });
  }

  /**
   * Get real-time data (last 30 minutes)
   */
  async getRealtime(): Promise<UmamiRealtime> {
    return this.request(`/api/realtime/${this.websiteId}`);
  }

  /**
   * Get active visitors count
   */
  async getActiveVisitors(): Promise<{ visitors: number }> {
    return this.request(`/api/websites/${this.websiteId}/active`);
  }

  /**
   * Check if the client is properly configured
   */
  isConfigured(): boolean {
    return !!(this.baseUrl && this.username && this.password && this.websiteId);
  }
}

// Singleton instance
export const umamiClient = new UmamiClient();
