import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CampaignsState, RealTimeMetrics } from '../../types/campaigns';
import { getCampaignsList, getCampaignDetail, getCampaignInsights, getCampaignMetrics } from './thunks';

const initialState: CampaignsState = {
  campaignsList: [],
  campaignDetail: null,
  campaignInsights: null,
  campaignMetrics: null,
  realTimeMetrics: null,
  sseConnected: false,
  loading: false,
  detailLoading: false,
  insightsLoading: false,
  metricsLoading: false,
  error: null,
};

const campaignsSlice = createSlice({
  name: 'campaigns',
  initialState,
  reducers: {
    clearCampaignDetail: (state) => {
      state.campaignDetail = null;
      state.campaignMetrics = null;
    },
    setRealTimeMetrics: (state, action: PayloadAction<RealTimeMetrics>) => {
      state.realTimeMetrics = action.payload;
    },
    setSSEConnected: (state, action: PayloadAction<boolean>) => {
      state.sseConnected = action.payload;
    },
    clearRealTimeMetrics: (state) => {
      state.realTimeMetrics = null;
      state.sseConnected = false;
    },
  },
  extraReducers: (builder) => {
    // ================ Campaigns list =================================================
    builder.addCase(getCampaignsList.pending, (state) => {
      state.loading = true;
    });

    builder.addCase(getCampaignsList.fulfilled, (state, action) => {
      state.loading = false;
      state.campaignsList = action.payload;
    });

    builder.addCase(getCampaignsList.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error?.message || 'Something went wrong';
    });

    // ================ Campaign detail =================================================
    builder.addCase(getCampaignDetail.pending, (state) => {
      state.detailLoading = true;
    });

    builder.addCase(getCampaignDetail.fulfilled, (state, action) => {
      state.detailLoading = false;
      state.campaignDetail = action.payload;
    });

    builder.addCase(getCampaignDetail.rejected, (state, action) => {
      state.detailLoading = false;
      state.error = action.error?.message || 'Something went wrong';
    });

    // ================ Campaign insights =================================================
    builder.addCase(getCampaignInsights.pending, (state) => {
      state.insightsLoading = true;
    });

    builder.addCase(getCampaignInsights.fulfilled, (state, action) => {
      state.insightsLoading = false;
      state.campaignInsights = action.payload;
    });

    builder.addCase(getCampaignInsights.rejected, (state, action) => {
      state.insightsLoading = false;
      state.error = action.error?.message || 'Something went wrong';
    });

    // ================ Campaign metrics =================================================
    builder.addCase(getCampaignMetrics.pending, (state) => {
      state.metricsLoading = true;
    });

    builder.addCase(getCampaignMetrics.fulfilled, (state, action) => {
      state.metricsLoading = false;
      state.campaignMetrics = action.payload;
    });

    builder.addCase(getCampaignMetrics.rejected, (state, action) => {
      state.metricsLoading = false;
      state.error = action.error?.message || 'Something went wrong';
    });
  },
});

export const { clearCampaignDetail, setRealTimeMetrics, setSSEConnected, clearRealTimeMetrics } = campaignsSlice.actions;
export default campaignsSlice.reducer;
