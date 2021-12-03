import '@vaadin/app-layout';
import '@vaadin/vaadin-lumo-styles/utility';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { router } from '../index';
import { views } from '../routes';
import { appStore } from '../stores/app-store';
import { Layout } from './view';
import type { RouterLocation } from '@vaadin/router';

@customElement('main-layout')
export class MainLayout extends Layout {
  render() {
    return html`
      <vaadin-app-layout>
        <header
          class="bg-base border-b border-contrast-10 box-border flex flex-col w-full"
          slot="navbar">
          <nav
            class="flex gap-s px-m py-l items-center justify-between"
            theme="dark">
            <img
              src="/resources/images/spring-logo-dataflow-mobile.png"
              alt="Spring"
              class="" />

            <div class="flex gap-s">
              ${this.getMenuRoutes().map(
                (viewRoute) => html`
                  <a
                    ?highlight=${this.highlightNav(viewRoute.path)}
                    class="flex 
                  h-m items-center px-s relative text-secondary"
                    href=${router.urlForPath(viewRoute.path)}>
                    <span class="${viewRoute.icon} me-s text-l"></span>
                    <span
                      class="font-medium text-s whitespace-nowrap uppercase">
                      ${viewRoute.title}
                    </span>
                  </a>
                `
              )}
            </div>
          </nav>
        </header>
        <div class="px-m">
          <div class="mx-auto max-w-screen-lg my-xl">
            <main>
              <slot></slot>
            </main>

            <footer class="mt-xl flex gap-m items-center ">
              <img src="/resources/images/vaadin.png" alt="Built with Vaadin" />
              <img
                src="/resources/images/spring-pivotal-logo.png"
                alt="Sponsored by Pivotal" />
            </footer>
          </div>
        </div>
      </vaadin-app-layout>
    `;
  }

  isSubRoute(location: RouterLocation, parentRouteName: string) {
    return (
      location.routes.find((r) => r.name === parentRouteName) !== undefined
    );
  }

  highlightNav(routePath: string) {
    // Highlight route '/'
    if (routePath === '/' && appStore.location === routePath) {
      return true;
    }
    // Generic highlight for most routes
    if (routePath !== '/' && appStore.location.startsWith(routePath)) {
      return true;
    }
    // Highlight "Find owners" if this is any view under the owners-base route
    if (
      routePath === router.urlForName('find-owners') &&
      this.isSubRoute(router.location, 'owners-base')
    ) {
      return true;
    }
    return false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add('block', 'h-full');
  }

  private getMenuRoutes() {
    return views.filter((route) => route.title);
  }
}
