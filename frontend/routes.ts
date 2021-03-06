import { Route } from '@vaadin/router';
import './views/error-view';
import './views/home-view';
import './views/main-layout';
import './views/owners/create-or-update-owner-view';
import './views/owners/find-owners-view';
import './views/owners/owner-details-view';
import './views/pets/create-or-update-pet-view';
import './views/pets/create-or-update-visit-view';

export type ViewRoute = Route & {
  title?: string;
  icon?: string;
  children?: ViewRoute[];
};

export const views: ViewRoute[] = [
  // place routes below (more info https://hilla.dev/docs/routing/defining)
  {
    path: '/',
    name: 'home',
    component: 'home-view',
    icon: 'la la-home',
    title: 'Home',
  },
  {
    // Included on root level to include in navigation menu.
    path: '/owners/find',
    name: 'find-owners',
    component: 'find-owners-view',
    icon: 'la la-search',
    title: 'Find owners',
  },
  {
    path: '/owners',
    name: 'owners-base',
    component: 'span',
    children: [
      {
        path: '/',
        component: 'find-owners-view',
      },
      {
        path: '/new',
        name: 'new-owner',
        component: 'create-or-update-owner-view',
      },
      {
        path: '/:ownerId([0-9]+)',
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
            component: 'create-or-update-pet-view',
          },
          {
            path: '/pets/:petId([0-9]+)/edit',
            name: 'edit-pet',
            component: 'create-or-update-pet-view',
          },
          {
            path: '/pets/:petId([0-9]+)/visits/new',
            name: 'add-visit',
            component: 'create-or-update-visit-view',
          },
        ],
      },
    ],
  },
  {
    path: '/vets',
    name: 'vets-list',
    component: 'vets-view',
    icon: 'la la-th-list',
    title: 'Veterinarians',
    // Defer the load of the Vets view until it is accessed
    action: async () => {
      await import('./views/vets-view');
    },
  },
  {
    path: '/oups',
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
