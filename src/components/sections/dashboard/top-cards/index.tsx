import { useMemo } from 'react';
import Grid from '@mui/material/Grid';
import TopCard from './TopCard';
import { topCardsData } from 'data/topCardsData';
import { useAppSelector } from 'store/hooks';

const TopCards = () => {
  const campaignsList = useAppSelector((state) => state.campaigns.campaignsList);

  const campaignStats = useMemo(() => {
    const total = campaignsList.length;
    const active = campaignsList.filter((c) => c.status === 'active').length;
    const paused = campaignsList.filter((c) => c.status === 'paused').length;
    const completed = campaignsList.filter((c) => c.status === 'completed').length;

    return { total, active, paused, completed };
  }, [campaignsList]);

  return (
    <Grid container spacing={3.75}>
      {topCardsData.map((item) => (
        <Grid item key={item.id} xs={12} sm={6} lg={3}>
          <TopCard data={item} count={campaignStats[item.key]} />
        </Grid>
      ))}
    </Grid>
  );
};

export default TopCards;
