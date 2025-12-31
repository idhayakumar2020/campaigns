import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { getCampaignDetail, getCampaignMetrics } from 'slices/campaigns/thunks';
import { clearCampaignDetail, clearRealTimeMetrics } from 'slices/campaigns/reducer';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import IconifyIcon from 'components/base/IconifyIcon';
import useRealTimeMetrics from '../../hooks/useRealTimeMetrics';

const statusColors: Record<string, 'success' | 'warning' | 'default'> = {
  active: 'success',
  paused: 'warning',
  completed: 'default',
};

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

const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { campaignDetail, campaignMetrics, detailLoading, metricsLoading, realTimeMetrics, sseConnected } = useAppSelector(
    (state) => state.campaigns
  );

  // Initialize SSE connection for real-time metrics with campaign ID
  useRealTimeMetrics(id);

  useEffect(() => {
    if (id) {
      dispatch(getCampaignDetail(id));
      dispatch(getCampaignMetrics(id));
    }

    return () => {
      dispatch(clearCampaignDetail());
      dispatch(clearRealTimeMetrics());
    };
  }, [dispatch, id]);

  const handleBack = () => {
    navigate('/');
  };

  if (detailLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (!campaignDetail) {
    return (
      <Box px={{ xs: 2, sm: 3.75 }} py={3}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            Campaign not found
          </Typography>
          <Button variant="contained" onClick={handleBack} sx={{ mt: 2 }}>
            Back to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return (
    <Box px={{ xs: 2, sm: 3.75 }} py={3}>
      <Stack direction="row" alignItems="center" spacing={2} mb={3}>
        <Button variant="contained" onClick={handleBack}>
          Back
        </Button>
        <Typography variant="h5" fontWeight={700}>
          Campaign Details
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {/* Campaign Info */}
        <Grid item xs={12} lg={5}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6" fontWeight={700}>
                {campaignDetail.name}
              </Typography>
              <Chip
                label={campaignDetail.status.charAt(0).toUpperCase() + campaignDetail.status.slice(1)}
                color={statusColors[campaignDetail.status]}
                size="small"
              />
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Campaign ID
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {campaignDetail.id}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Brand ID
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {campaignDetail.brand_id}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Budget
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  ${campaignDetail.budget.toLocaleString()}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Daily Budget
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  ${campaignDetail.daily_budget.toLocaleString()}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Created At
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {new Date(campaignDetail.created_at).toLocaleDateString()}
                </Typography>
              </Grid>

              <Grid item xs={6}>
                <Typography variant="caption" color="text.secondary" display="block">
                  Platforms
                </Typography>
                <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                  {campaignDetail.platforms.map((platform) => (
                    <Chip key={platform} label={platform} variant="outlined" size="small" />
                  ))}
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Campaign Metrics */}
        <Grid item xs={12} lg={7}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <IconifyIcon icon="solar:graph-up-bold" color="primary.main" />
              <Typography variant="h6" fontWeight={600}>
                Performance Metrics
              </Typography>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {metricsLoading ? (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress size={32} />
              </Box>
            ) : campaignMetrics ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <MetricCard
                    icon="solar:eye-bold"
                    iconColor="primary.main"
                    iconBg="transparent.primary.main"
                    title="Impressions"
                    value={campaignMetrics.impressions.toLocaleString()}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MetricCard
                    icon="solar:cursor-bold"
                    iconColor="success.main"
                    iconBg="transparent.success.main"
                    title="Clicks"
                    value={campaignMetrics.clicks.toLocaleString()}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MetricCard
                    icon="solar:cart-check-bold"
                    iconColor="warning.main"
                    iconBg="transparent.warning.main"
                    title="Conversions"
                    value={campaignMetrics.conversions.toLocaleString()}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <MetricCard
                    icon="solar:dollar-bold"
                    iconColor="error.main"
                    iconBg="transparent.error.main"
                    title="Total Spend"
                    value={`$${campaignMetrics.spend.toLocaleString()}`}
                  />
                </Grid>
              </Grid>
            ) : (
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography color="text.secondary">No metrics available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Rate Metrics */}
        {campaignMetrics && (
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Stack direction="row" alignItems="center" spacing={1} mb={2}>
                <IconifyIcon icon="solar:chart-square-bold" color="info.main" />
                <Typography variant="h6" fontWeight={600}>
                  Conversion Rates
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
                      {campaignMetrics.ctr.toFixed(2)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Click-Through Rate (CTR)
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
                      ${campaignMetrics.cpc.toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Cost Per Click (CPC)
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
                      {campaignMetrics.conversion_rate.toFixed(2)}%
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mt={1}>
                      Conversion Rate
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}

        {/* Real-Time Metrics */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <IconifyIcon icon="solar:pulse-2-bold" color="error.main" />
                <Typography variant="h6" fontWeight={600}>
                  Real-Time Metrics
                </Typography>
              </Stack>
              <Chip
                icon={
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: sseConnected ? 'success.main' : 'error.main',
                      animation: sseConnected ? 'pulse 2s infinite' : 'none',
                      '@keyframes pulse': {
                        '0%': { opacity: 1 },
                        '50%': { opacity: 0.5 },
                        '100%': { opacity: 1 },
                      },
                    }}
                  />
                }
                label={sseConnected ? 'Live' : 'Disconnected'}
                color={sseConnected ? 'success' : 'error'}
                size="small"
                variant="outlined"
              />
            </Stack>

            <Divider sx={{ mb: 3 }} />

            {realTimeMetrics ? (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      bgcolor: 'transparent.primary.main',
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          height: 40,
                          width: 40,
                          minWidth: 40,
                          bgcolor: 'primary.main',
                          borderRadius: 1.5,
                        }}
                      >
                        <IconifyIcon icon="solar:eye-bold" fontSize="body1.fontSize" color="white" />
                      </Stack>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          Impressions
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="primary.main" noWrap>
                          {(realTimeMetrics.impressions ?? 0).toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      bgcolor: 'transparent.success.main',
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          height: 40,
                          width: 40,
                          minWidth: 40,
                          bgcolor: 'success.main',
                          borderRadius: 1.5,
                        }}
                      >
                        <IconifyIcon icon="solar:cursor-bold" fontSize="body1.fontSize" color="white" />
                      </Stack>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          Clicks
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="success.main" noWrap>
                          {(realTimeMetrics.clicks ?? 0).toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      bgcolor: 'transparent.warning.main',
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          height: 40,
                          width: 40,
                          minWidth: 40,
                          bgcolor: 'warning.main',
                          borderRadius: 1.5,
                        }}
                      >
                        <IconifyIcon icon="solar:cart-check-bold" fontSize="body1.fontSize" color="white" />
                      </Stack>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          Conversions
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="warning.main" noWrap>
                          {(realTimeMetrics.conversions ?? 0).toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <Paper
                    elevation={0}
                    sx={{
                      p: 2.5,
                      bgcolor: 'transparent.info.main',
                      borderRadius: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                          height: 40,
                          width: 40,
                          minWidth: 40,
                          bgcolor: 'info.main',
                          borderRadius: 1.5,
                        }}
                      >
                        <IconifyIcon icon="solar:users-group-rounded-bold" fontSize="body1.fontSize" color="white" />
                      </Stack>
                      <Box sx={{ minWidth: 0, flex: 1 }}>
                        <Typography variant="caption" color="text.secondary" noWrap>
                          Active Users
                        </Typography>
                        <Typography variant="h6" fontWeight={700} color="info.main" noWrap>
                          {(realTimeMetrics.active_users ?? 0).toLocaleString()}
                        </Typography>
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>

                {/* Timestamp */}
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.disabled" textAlign="right" display="block">
                    Last updated: {realTimeMetrics.timestamp ? new Date(realTimeMetrics.timestamp).toLocaleTimeString() : '-'}
                  </Typography>
                </Grid>
              </Grid>
            ) : (
              <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="120px">
                {sseConnected ? (
                  <CircularProgress size={32} />
                ) : (
                  <>
                    <IconifyIcon icon="solar:wifi-router-minimalistic-bold" fontSize={40} color="text.disabled" />
                    <Typography color="text.secondary" mt={1} variant="body2">
                      Connecting to real-time stream...
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CampaignDetail;
