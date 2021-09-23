import { Route } from '@vaadin/router';
import './views/error-view';
import './views/home-view';
import './views/main-layout';
import './views/owners/find-owners-view';
import './views/owners/owners-list-view';
import './views/owners/owner-details-view';
import './views/vets-view';

export type ViewRoute = Route & {
  title?: string;
  icon?: string;
  children?: ViewRoute[];
};

export const views: ViewRoute[] = [
  // place routes below (more info https://vaadin.com/docs/latest/fusion/routing/overview)
  {
    path: '/',
    component: 'home-view',
    icon: '',
    title: '',
  },
  {
    path: '/home-fusion',
    component: 'home-view',
    icon: 'la la-home',
    title: 'Home',
  },
  {
    // Included on root level to include in navigation menu. Otherwise this
    // could be as a child of the '/owners-fusion' item below.
    path: '/owners-fusion/find',
    component: 'find-owners-view',
    icon: 'la la-search',
    title: 'Find owners',
  },
  {
    path: '/owners-fusion',
    children: [
      {
        path: '/',
        component: 'owners-list-view',
      },
      {
        path: '/([0-9]+)',
        component: 'owner-details-view',
      },
    ],
  },
  {
    path: '/vets-fusion',
    component: 'vets-view',
    icon: 'la la-th-list',
    title: 'Veterinarians',
  },
  {
    path: '/error-fusion',
    component: 'error-view',
    icon: 'la la-exclamation-triangle',
    title: 'Error',
  },
];

export const routes: ViewRoute[] = [
  {
    path: '/',
    component: 'main-layout',
    children: [...views],
  },
];
