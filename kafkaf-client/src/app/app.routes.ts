import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Consumers } from './pages/consumers/consumers';
import { BrokersList } from './pages/brokers-list/brokers-list';
import { TopicsList } from './pages/topics-list/topics-list';
import { TopicOverview } from './pages/topic-overview/topic-overview';
import { TopicMessages } from './pages/topic-messages/topic-messages';
import { TopicConsumers } from './pages/topic-consumers/topic-consumers';
import { TopicSettings } from './pages/topic-settings/topic-settings';
import { TopicStatistics } from './pages/topic-statistics/topic-statistics';
import { BrokerDetails } from './pages/broker-details/broker-details';

export const routes: Routes = [
  { path: '', component: Dashboard },
  {
    path: 'clusters/:cluster/brokers',
    component: BrokersList,
    title: 'Cluster %cluster% > Brokers list',
  },
  {
    path: 'clusters/:cluster/brokers/:broker',
    component: BrokerDetails,
    title: 'Cluster %cluster% > Broker %broker% ',
  },

  {
    path: 'clusters/:cluster/topics',
    component: TopicsList,
    title: 'Cluster %cluster% > Topics list',
  },
  {
    path: 'clusters/:cluster/topics/:topic',
    component: TopicOverview,
    title: 'Cluster %cluster% > Topic %topic%',
  },
  {
    path: 'clusters/:cluster/topics/:topic/messages',
    component: TopicMessages,
    title: 'Cluster %cluster% > Topic %topic% > Messages',
  },
  {
    path: 'clusters/:cluster/topics/:topic/consumers',
    component: TopicConsumers,
    title: 'Cluster %cluster% > Topic %topic% > Consumers',
  },
  {
    path: 'clusters/:cluster/topics/:topic/settings',
    component: TopicSettings,
    title: 'Cluster %cluster% > Topic %topic% > Settings',
  },
  {
    path: 'clusters/:cluster/topics/:topic/statistics',
    component: TopicStatistics,
    title: 'Cluster %cluster% > Topic %topic% > Statistics',
  },

  {
    path: 'clusters/:cluster/consumers',
    component: Consumers,
    title: 'Cluster %cluster% > Consumers',
  },
];
