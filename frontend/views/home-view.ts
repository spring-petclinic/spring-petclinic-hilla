import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { View } from '../views/view';

@customElement('home-view')
export class HomeView extends View {
  render() {
    return html`
      <p>Home view</p>
    `;
  }
}
