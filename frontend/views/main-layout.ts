import '@vaadin/vaadin-app-layout';
import '@vaadin/vaadin-avatar/vaadin-avatar';
import '@vaadin/vaadin-context-menu';
import '@vaadin/vaadin-lumo-styles/utility';
import '@vaadin/vaadin-tabs';
import '@vaadin/vaadin-tabs/vaadin-tab';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { router } from '../index';
import { views } from '../routes';
import { appStore } from '../stores/app-store';
import { Layout } from './view';

interface RouteInfo {
  path: string;
  title: string;
  icon: string;
}

@customElement('main-layout')
export class MainLayout extends Layout {
  render() {
    return html`
      <vaadin-app-layout>
        <header class="bg-base border-b border-contrast-10 box-border flex flex-col w-full" slot="navbar">
          <nav class="flex gap-s overflow-auto px-m">
            <a href="/" router-ignore class="flex mx-s p-s relative text-secondary">
              <span class="la la-home me-s text-l"></span>
              <span class="font-medium text-s">Original Home</span>
            </a>
            ${this.getMenuRoutes().map(
      (viewRoute) => html`
                <a
                  ?highlight=${viewRoute.path == appStore.location}
                  class="flex 
                  h-m items-center px-s relative text-secondary"
                  href=${router.urlForPath(viewRoute.path)}
                >
                  <span class="${viewRoute.icon} me-s text-l"></span>
                  <span class="font-medium text-s whitespace-nowrap">${viewRoute.title}</span>
                </a>
              `
    )}
          </nav>
        </header>
        <div class="px-m">
          <div class="mx-auto max-w-screen-lg my-xl">
            <main>
              <slot></slot>
            </main>
    
            <footer class="mt-xl text-center">
              <img src="/resources/images/spring-pivotal-logo.png" alt="Sponsored by Pivotal" />
            </footer>
          </div>
        </div>
      </vaadin-app-layout>
    `;
  }

  connectedCallback() {
    super.connectedCallback();
    this.classList.add('block', 'h-full');
  }

  private getMenuRoutes(): RouteInfo[] {
    return views.filter((route) => route.title) as RouteInfo[];
  }
}
