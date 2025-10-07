import { Routes } from '@angular/router';
import { clusterBrokerGuardFn, clusterGuardFn } from './app.guards';

import { Dashboard } from './pages/dashboard/dashboard';
import { Consumers } from './pages/consumers/consumers';
import { BrokersList } from './pages/brokers-list/brokers-list';
import { TopicsList } from './pages/topics-list/topics-list';
import { TopicDetails } from './pages/topic-details/topic-details';
import { TopicMessages } from './pages/topic-messages/topic-messages';
import { TopicConsumers } from './pages/topic-consumers/topic-consumers';
import { TopicSettings } from './pages/topic-settings/topic-settings';
import { TopicStatistics } from './pages/topic-statistics/topic-statistics';
import { BrokerDetails } from './pages/broker-details/broker-details';
import { BrokerConfigs } from './pages/broker-configs/broker-configs';
import { BrokerMetrics } from './pages/broker-metrics/broker-metrics';
import { BrokerLogDirectories } from './pages/broker-log-directories/broker-log-directories';
import { TopicOverview } from './pages/topic-overview/topic-overview';
import { TopicsCreate } from './pages/topics-create/topics-create';


export const routes: Routes = [
  { path: '', component: Dashboard },

  {
    path: 'clusters/:cluster/brokers',
    component: BrokersList,
    canMatch: [clusterGuardFn],
    title: 'Cluster %cluster% > Brokers list',
  },

  {
    path: 'clusters/:cluster/brokers/:broker',
    component: BrokerDetails,
    canMatch: [clusterBrokerGuardFn],
    title: 'Cluster %cluster% > Broker %broker% ',
    children: [
      {
        path: '',
        outlet: 'broker',
        component: BrokerLogDirectories,
      },
      {
        path: 'configs',
        outlet: 'broker',
        component: BrokerConfigs,
      },
      {
        path: 'metrics',
        outlet: 'broker',
        component: BrokerMetrics,
      },
    ],
  },

  {
    path: 'clusters/:cluster/topics',
    component: TopicsList,
    canMatch: [clusterGuardFn],
    title: 'Cluster %cluster% > Topics list',
  },

  {
    path: 'clusters/:cluster/topics/create',
    component: TopicsCreate,
    title: 'Cluster %cluster% > Create New Topic',
    canMatch: [clusterGuardFn],
  },

  {
    path: 'clusters/:cluster/topics/:topic',
    component: TopicDetails,
    canMatch: [clusterGuardFn],
    title: 'Cluster %cluster% > Topic %topic%',
    children: [
      {
        path: '',
        component: TopicOverview,
        title: 'Cluster %cluster% > Topic %topic% > Overview',
        outlet: 'topic',
      },
      {
        path: 'messages',
        component: TopicMessages,
        title: 'Cluster %cluster% > Topic %topic% > Messages',
        outlet: 'topic',
      },
      {
        path: 'consumers',
        component: TopicConsumers,
        title: 'Cluster %cluster% > Topic %topic% > Consumers',
        outlet: 'topic',
      },
      {
        path: 'settings',
        component: TopicSettings,
        title: 'Cluster %cluster% > Topic %topic% > Settings',
        outlet: 'topic',
      },
      {
        path: 'statistics',
        component: TopicStatistics,
        title: 'Cluster %cluster% > Topic %topic% > Statistics',
        outlet: 'topic',
      },
    ],
  },

  {
    path: 'clusters/:cluster/consumers',
    component: Consumers,
    canMatch: [clusterGuardFn],
    title: 'Cluster %cluster% > Consumers',
  },
];
