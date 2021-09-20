import { Route } from '@vaadin/router';
import './views/helloworld/hello-world-view';
import './views/home-view';
import './views/vets-view';
import './views/error-view';
import './views/main-layout';

export type ViewRoute = Route & {
  title?: string;
  icon?: string;
  children?: ViewRoute[];
};

export const views: ViewRoute[] = [
  // place routes below (more info https://vaadin.com/docs/latest/fusion/routing/overview)
  {
    path: '',
    component: 'hello-world-view',
    icon: '',
    title: '',
  },
  {
    path: 'hello',
    component: 'hello-world-view',
    icon: 'la la-globe',
    title: 'Hello World',
  },
  {
    path: 'home-fusion',
    component: 'home-view',
    icon: 'la la-home',
    title: 'Home',
  },
  {
    path: 'vets-fusion',
    component: 'vets-view',
    icon: 'la la-th-list',
    title: 'Veterinarians',
  },
  {
    path: 'error-fusion',
    component: 'error-view',
    icon: 'la la-exclamation-triangle',
    title: 'Error',
  },
];
export const routes: ViewRoute[] = [
  {
    path: '',
    component: 'main-layout',
    children: [...views],
  },
];
