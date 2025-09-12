import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Brokers } from './pages/brokers/brokers';
import { Topics } from './pages/topics/topics';
import { Consumers } from './pages/consumers/consumers';

export const routes: Routes = [
 { path: '', component: Dashboard },
 { path: 'clusters/:cluster/brokers', component: Brokers },
 { path: 'clusters/:cluster/topics', component: Topics },
 { path: 'clusters/:cluster/consumers', component: Consumers },
];
