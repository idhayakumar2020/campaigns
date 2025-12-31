import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import { createSelector } from '@reduxjs/toolkit';
import TopCards from 'components/sections/dashboard/top-cards';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCampaignsList, getCampaignInsights } from 'slices/campaigns/thunks';
import { AppDispatch, RootState } from 'store/store';
import type { CampaignsState } from '../../types/campaigns';
import CampaignListTable from 'components/sections/dashboard/campaign-list';
import IconifyIcon from 'components/base/IconifyIcon';

interface MetricCardProps {
  icon: string;
  iconColor: string;
  iconBg: string;
  title: string;
  value: string | number;
  subtitle?: string;
}

const MetricCard = ({ icon, iconColor, iconBg, title, value, subtitle }: MetricCardProps) => (
  <Paper sx={{ p: 2.5, height: '100%' }}>
    <Stack direction="row" alignItems="center" spacing={2}>
      <Stack
        alignItems="center"
        justifyContent="center"
        sx={{
          height: 48,
          width: 48,
          minWidth: 48,
          bgcolor: iconBg,
          borderRadius: 2,
        }}
      >
        <IconifyIcon icon={icon} fontSize="h6.fontSize" color={iconColor} />
      </Stack>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" color="text.secondary" noWrap>
          {title}
        </Typography>
        <Typography variant="h6" fontWeight={700} noWrap>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.disabled" noWrap>
            {subtitle}
          </Typography>
        )}
      </Box>
    </Stack>
  </Paper>
);

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  const selectProperties = createSelector(
    (state: RootState) => state.campaigns,
    (campaigns: CampaignsState) => ({
      campaignsList: campaigns.campaignsList,
      loading: campaigns.loading,
      campaignInsights: campaigns.campaignInsights,
      insightsLoading: campaigns.insightsLoading,
    })
  );

  const { campaignInsights, insightsLoading } =
    useSelector(selectProperties);

  useEffect(() => {
    dispatch(getCampaignsList());
    dispatch(getCampaignInsights());
  }, [dispatch]);

  return (
    <Grid container px={3.75} spacing={3.75}>
      <Grid item xs={12}>
        <TopCards />
      </Grid>

      {/* Aggregate Metrics Section */}
      <Grid item xs={12}>
        <Paper sx={{ p: 3 }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={2}>
            <IconifyIcon icon="solar:chart-bold" color="primary.main" />
            <Typography variant="h6" fontWeight={600}>
              Performance Overview
            </Typography>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          {insightsLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
              <CircularProgress size={32} />
            </Box>
          ) : campaignInsights ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  icon="solar:eye-bold"
                  iconColor="primary.main"
                  iconBg="transparent.primary.main"
                  title="Total Impressions"
                  value={campaignInsights.total_impressions.toLocaleString()}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  icon="solar:cursor-bold"
                  iconColor="success.main"
                  iconBg="transparent.success.main"
                  title="Total Clicks"
                  value={campaignInsights.total_clicks.toLocaleString()}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  icon="solar:cart-check-bold"
                  iconColor="warning.main"
                  iconBg="transparent.warning.main"
                  title="Total Conversions"
                  value={campaignInsights.total_conversions.toLocaleString()}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <MetricCard
                  icon="solar:dollar-bold"
                  iconColor="error.main"
                  iconBg="transparent.error.main"
                  title="Total Spend"
                  value={`$${campaignInsights.total_spend.toLocaleString()}`}
                />
              </Grid>
            </Grid>
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
              <Typography color="text.secondary">No insights data available</Typography>
            </Box>
          )}
        </Paper>
      </Grid>

      {/* Average Metrics Section */}
      {campaignInsights && (
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <IconifyIcon icon="solar:graph-up-bold" color="info.main" />
              <Typography variant="h6" fontWeight={600}>
                Average Metrics
              </Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'transparent.primary.main',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h3" fontWeight={700} color="primary.main">
                    {campaignInsights.avg_ctr.toFixed(2)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Average CTR
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'transparent.success.main',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h3" fontWeight={700} color="success.main">
                    ${campaignInsights.avg_cpc.toFixed(2)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Average CPC
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    textAlign: 'center',
                    bgcolor: 'transparent.warning.main',
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="h3" fontWeight={700} color="warning.main">
                    {campaignInsights.avg_conversion_rate.toFixed(2)}%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Average Conversion Rate
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      )}

      <Grid item xs={12}>
        <CampaignListTable />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
