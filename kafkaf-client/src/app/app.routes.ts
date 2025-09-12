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
 { path: 'clusters/:cluster/brokers', component: BrokersList },
 { path: 'clusters/:cluster/brokers/:id', component: BrokerDetails },

 { path: 'clusters/:cluster/topics', component: TopicsList },
 { path: 'clusters/:cluster/topics/:id/overview', component: TopicOverview },
 { path: 'clusters/:cluster/topics/:id/messages', component: TopicMessages },
 { path: 'clusters/:cluster/topics/:id/consumers', component: TopicConsumers },
 { path: 'clusters/:cluster/topics/:id/settings', component: TopicSettings },
 { path: 'clusters/:cluster/topics/:id/statistics', component: TopicStatistics },

 { path: 'clusters/:cluster/consumers', component: Consumers },
];
