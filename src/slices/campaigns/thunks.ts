import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import type { Campaign, CampaignInsight, CampaignMetrics, ApiError } from '../../types/campaigns';
import campaignsService from '../../api/campaigns/campaignService';

// Fetch list of campaigns
export const getCampaignsList = createAsyncThunk<Campaign[], void, { rejectValue: string }>(
  'campaigns/getCampaignsList',
  async (_, { rejectWithValue }) => {
    try {
      const response = await campaignsService.getCampaignList();
      return response;
    } catch (error) {
      const err = error as ApiError;
      toast.error(err?.errors?.[0]?.message || err?.message || 'Internal server error');
      return rejectWithValue(err?.message || 'Failed to fetch campaigns');
    }
  }
);

// Fetch campaign detail by ID
export const getCampaignDetail = createAsyncThunk<Campaign, string, { rejectValue: string }>(
  'campaigns/getCampaignDetail',
  async (id, { rejectWithValue }) => {
    try {
      const response = await campaignsService.getCampaignById(id);
      return response;
    } catch (error) {
      const err = error as ApiError;
      toast.error(err?.errors?.[0]?.message || err?.message || 'Internal server error');
      return rejectWithValue(err?.message || 'Failed to fetch campaign detail');
    }
  }
);

// Fetch campaign insights
export const getCampaignInsights = createAsyncThunk<CampaignInsight, void, { rejectValue: string }>(
  'campaigns/getCampaignInsights',
  async (_, { rejectWithValue }) => {
    try {
      const response = await campaignsService.getCampaignInsights();
      return response;
    } catch (error) {
      const err = error as ApiError;
      toast.error(err?.errors?.[0]?.message || err?.message || 'Internal server error');
      return rejectWithValue(err?.message || 'Failed to fetch campaign insights');
    }
  }
);

// Fetch campaign metrics by ID
export const getCampaignMetrics = createAsyncThunk<CampaignMetrics, string, { rejectValue: string }>(
  'campaigns/getCampaignMetrics',
  async (id, { rejectWithValue }) => {
    try {
      const response = await campaignsService.getCampaignMetricsById(id);
      return response;
    } catch (error) {
      const err = error as ApiError;
      toast.error(err?.errors?.[0]?.message || err?.message || 'Internal server error');
      return rejectWithValue(err?.message || 'Failed to fetch campaign metrics');
    }
  }
);



