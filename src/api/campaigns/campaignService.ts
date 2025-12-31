import axiosPlatformInstance from '../../lib/axios-platform';

const API_URL = axiosPlatformInstance;

const getCampaignList = async () => {
  const response = await API_URL.get("/campaigns");
  return response.data.campaigns;
};

const getCampaignById = async (id: string) => {
  const response = await API_URL.get(`/campaigns/${id}`);
  return response.data.campaign;
};

const getCampaignInsights = async () => {
  const response = await API_URL.get("/campaigns/insights");
  return response.data.insights;
};

const getCampaignMetricsById = async (id: string) => {
  const response = await API_URL.get(`/campaigns/${id}/insights`);
  return response.data.insights;
};

const getCampaignInsightsStream = async (id: string) => {
  const response = await API_URL.get(`/campaigns/${id}/insights/stream`);
  return response.data.insights;
};

const campaignService = {
  getCampaignList,
  getCampaignById,
  getCampaignInsights,
  getCampaignMetricsById,
  getCampaignInsightsStream
};

export default campaignService;
