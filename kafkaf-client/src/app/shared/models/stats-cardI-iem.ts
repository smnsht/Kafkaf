export type tStatsCardItemIcon = 'info' | 'success' | 'warning' | 'danger';

export interface StatsCardItem {
  label: string;
  value: string | number;
  icon?: tStatsCardItemIcon;
}
