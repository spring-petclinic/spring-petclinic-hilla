import { Route } from '@vaadin/router';
import './views/error-view';
import './views/home-view';
import './views/main-layout';
import './views/owners/create-or-update-owner-view';
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
    name: 'home',
    component: 'home-view',
    icon: 'la la-home',
    title: 'Home',
  },
  {
    // Included on root level to include in navigation menu. Otherwise this
    // could be as a child of the '/owners-fusion' item below.
    path: '/owners-fusion/find',
    name: 'find-owners',
    component: 'find-owners-view',
    icon: 'la la-search',
    title: 'Find owners',
  },
  {
    path: '/owners-fusion',
    name: 'owners-base',
    children: [
      {
        path: '/',
        name: 'owners-list',
        component: 'owners-list-view',
      },
      {
        path: '/new',
        name: 'new-owner',
        component: 'create-or-update-owner-view',
      },
      {
        path: '/([0-9]+)',
        children: [
          {
            path: '/',
            name: 'owner-details',
            component: 'owner-details-view',
          },
          {
            path: '/edit',
            name: 'edit-owner',
            component: 'create-or-update-owner-view',
          },
          {
            path: '/pets/new',
            name: 'add-pet',
            component: '',
          },
          {
            path: '/pets/([0-9]+)/edit',
            name: 'edit-pet',
            component: '',
          },
          {
            path: '/pets/([0-9]+)/visits/new',
            name: 'add-visit',
            component: '',
          },
        ],
      },
    ],
  },
  {
    path: '/vets-fusion',
    name: 'vets-list',
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
