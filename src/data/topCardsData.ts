export interface TopCard {
  id: string | number;
  key: 'total' | 'active' | 'paused' | 'completed';
  icon: string;
  title: string;
  iconColor: string;
  iconBg: string;
}

export const topCardsData: TopCard[] = [
  {
    id: 1,
    key: 'total',
    icon: 'solar:chart-2-bold',
    title: 'Total Campaigns',
    iconColor: 'primary.main',
    iconBg: 'transparent.primary.main',
  },
  {
    id: 2,
    key: 'active',
    icon: 'solar:play-circle-bold',
    title: 'Active Campaigns',
    iconColor: 'success.main',
    iconBg: 'transparent.success.main',
  },
  {
    id: 3,
    key: 'paused',
    icon: 'solar:pause-circle-bold',
    title: 'Paused Campaigns',
    iconColor: 'warning.main',
    iconBg: 'transparent.warning.main',
  },
  {
    id: 4,
    key: 'completed',
    icon: 'solar:check-circle-bold',
    title: 'Completed Campaigns',
    iconColor: 'info.main',
    iconBg: 'transparent.info.main',
  },
];
