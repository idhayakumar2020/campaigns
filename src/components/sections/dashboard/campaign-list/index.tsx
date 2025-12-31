import { createSelector } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from 'store/store';
import type { Campaign, CampaignsState } from 'types/campaigns';
import CommonTable, { ColumnConfig } from './DataTable';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';

const statusColors: Record<Campaign['status'], 'success' | 'warning' | 'default'> = {
  active: 'success',
  paused: 'warning',
  completed: 'default',
};

const selectCampaigns = createSelector(
  (state: RootState) => state.campaigns,
  (campaigns: CampaignsState) => ({
    campaignsList: campaigns.campaignsList,
    loading: campaigns.loading,
  })
);

const CampaignListTable = () => {
  const { campaignsList, loading } = useSelector(selectCampaigns);
  const navigate = useNavigate();

  const handleViewDetails = (id: string) => {
    navigate(`/campaigns/${id}`);
  };

  const columns: ColumnConfig<Campaign>[] = [
    {
      id: 'brand_id',
      label: 'Brand ID',
    },
    {
      id: 'name',
      label: 'Campaign Name',
      disablePadding: true,
    },
    {
      id: 'status',
      label: 'Status',
      render: (row) => (
        <Chip
          label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
          color={statusColors[row.status]}
          size="small"
        />
      ),
    },
    {
      id: 'budget',
      label: 'Budget',
      numeric: true,
      render: (row) => `$${row.budget.toLocaleString()}`,
    },
    {
      id: 'daily_budget',
      label: 'Daily Budget',
      numeric: true,
      render: (row) => `$${row.daily_budget.toLocaleString()}`,
    },
    {
      id: 'platforms',
      label: 'Platforms',
      render: (row) => row.platforms.join(', '),
    },
    {
      id: 'created_at',
      label: 'Created At',
      render: (row) => new Date(row.created_at).toLocaleDateString(),
    },
    {
      id: 'actions',
      label: 'Actions',
      sortable: false,
      align: 'center',
      render: (row) => (
        <Button
          variant="contained"
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            handleViewDetails(row.id);
          }}
        >
          Details
        </Button>
      ),
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <CommonTable<Campaign>
      data={campaignsList}
      columns={columns}
      title="Campaign List"
      rowKey="id"
      selectable={true}
      defaultOrderBy="created_at"
      defaultOrder="desc"
    />
  );
};

export default CampaignListTable;
