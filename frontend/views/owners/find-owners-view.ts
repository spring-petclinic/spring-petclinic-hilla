import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import '@vaadin/vaadin-button/vaadin-button'
import '@vaadin/vaadin-icons/vaadin-iconset'
import '@vaadin/vaadin-icon/vaadin-icon'
import '@vaadin/vaadin-text-field/vaadin-text-field'
import type { TextFieldElement } from '@vaadin/vaadin-text-field/vaadin-text-field';
import { View } from '../../views/view';
import { router } from 'Frontend/index';
import { Router } from '@vaadin/router';

@customElement('find-owners-view')
export class FindOwnersView extends View {

  @property({ type: String, attribute: 'last-name' })
  lastName: string = '';

  @property({ type: String, attribute: 'hint-text' })
  hintText?: string;

  render() {
    return html`
      <h2>Find Owners</h2>
      
      <vaadin-text-field label="Last name" .value="${this.lastName}" @change="${this.lastNameChanged}" helper-text="${this.hintText}" clear-button-visible>
        <vaadin-icon slot="prefix" icon="vaadin:search"></vaadin-icon>
      </vaadin-text-field>
      <vaadin-button @click="${this.findOwner}">Find Owner</vaadin-button><br>
      <br>
      <vaadin-button @click="${this.addOwner}">Add Owner</vaadin-button>
    `;
  }

  lastNameChanged(event: Event) {
    const textField = event.target as TextFieldElement;
    this.lastName = textField.value;
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
