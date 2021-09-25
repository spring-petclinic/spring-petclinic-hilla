import { Router, RouterLocation } from '@vaadin/router';
import { routes } from './routes';
import { appStore } from './stores/app-store';

export const router = new Router(document.querySelector('#outlet'));

router.setRoutes(routes);

type RouterLocationChangedEvent = CustomEvent<{
  router: Router;
  location: RouterLocation;
}>;

window.addEventListener(
  'vaadin-router-location-changed',
  (e: RouterLocationChangedEvent) => {
    appStore.setLocation(e.detail.location);
    const title = appStore.currentViewTitle;
    if (title) {
      document.title = title + ' | ' + appStore.applicationName;
    } else {
      document.title = appStore.applicationName;
    }
  }
);
