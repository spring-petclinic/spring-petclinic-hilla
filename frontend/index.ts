import { Router, RouterLocation } from '@vaadin/router';
import { routes } from './routes';
import { appStore } from './stores/app-store';
/*
 * TODO: This style-modules.js import here is a workaround to fix broken theme.
 * Remove when https://github.com/vaadin/flow/pull/12017 is resolved.
 */
import '@vaadin/polymer-legacy-adapter/style-modules.js';

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
