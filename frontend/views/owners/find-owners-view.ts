import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@vaadin/button';
import '@vaadin/icons';
import '@vaadin/icon';
import '@vaadin/text-field';
import type { TextField } from '@vaadin/text-field';
import { View } from '../../views/view';
import { router } from 'Frontend/index';
import { Router } from '@vaadin/router';

@customElement('find-owners-view')
export class FindOwnersView extends View {
  @property({ type: String, attribute: 'last-name' })
  lastName: string = '';

  @property({ type: String, attribute: 'hint-text' })
  hintText: string = '';

  render() {
    return html`
      <h2>Find Owners</h2>

      <div class="flex gap-m items-baseline">
        <vaadin-text-field
          label="Last name"
          .value=${this.lastName}
          @change=${this.lastNameChanged}
          @keyup=${this.textFieldKeyUp}
          helper-text=${this.hintText}
          clear-button-visible>
          <vaadin-icon slot="prefix" icon="vaadin:search"></vaadin-icon>
        </vaadin-text-field>
        <vaadin-button @click=${this.findOwner} theme="primary">
          Find Owner
        </vaadin-button>
        <vaadin-button @click=${this.addOwner}>Add Owner</vaadin-button>
      </div>
    `;
  }

  lastNameChanged(event: Event) {
    const textField = event.target as TextField;
    this.lastName = textField.value;
  }

  textFieldKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.findOwner();
    }
  }

  findOwner() {
    let targetUrl = router.urlForName('owners-list');
    if (this.lastName !== '') {
      targetUrl += '?lastName=' + encodeURIComponent(this.lastName);
    }
    Router.go(targetUrl);
  }

  addOwner() {
    Router.go(router.urlForName('new-owner'));
  }
}
