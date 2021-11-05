import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { View } from '../views/view';

@customElement('home-view')
export class HomeView extends View {
  render() {
    return html`
      <h2>Welcome</h2>
      <div class="row">
        <div class="col-md-12">
          <img class="img-responsive" src="/resources/images/pets.png" />
        </div>
      </div>
    `;
  }
}
