export interface Campaign {
  id: string;
  name: string;
  brand_id: string;
  status: 'active' | 'paused' | 'completed';
  budget: number;
  daily_budget: number;
  platforms: string[];
  created_at: string;
}

export interface CampaignInsight {
  timestamp: string;
  total_campaigns: number;
  active_campaigns: number;
  paused_campaigns: number;
  completed_campaigns: number;
  total_impressions: number;
  total_clicks: number;
  total_conversions: number;
  total_spend: number;
  avg_ctr: number;
  avg_cpc: number;
  avg_conversion_rate: number;
}

export interface CampaignMetrics {
  campaign_id: string;
  timestamp: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  conversion_rate: number;
}

export interface RealTimeMetrics {
  timestamp: string;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  ctr: number;
  cpc: number;
  conversion_rate: number;
  active_users: number;
}

export interface CampaignsState {
  campaignsList: Campaign[];
  campaignDetail: Campaign | null;
  campaignInsights: CampaignInsight | null;
  campaignMetrics: CampaignMetrics | null;
  realTimeMetrics: RealTimeMetrics | null;
  sseConnected: boolean;
  loading: boolean;
  detailLoading: boolean;
  insightsLoading: boolean;
  metricsLoading: boolean;
  error: string | null;
}


export interface ApiError {
  message?: string
  errors?: {
    message: string
  }[]
}
