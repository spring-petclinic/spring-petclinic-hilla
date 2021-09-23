import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { ref, createRef } from 'lit/directives/ref';
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

  @property({ type: String, attribute: 'initial-last-name' })
  initialLastName?: string;

  @property({ type: String, attribute: 'hint-text' })
  hintText?: string;

  private textFieldRef = createRef<TextFieldElement>();

  connectedCallback() {
    super.connectedCallback();
    const searchParams = new URLSearchParams(router.location.search);
    const lastNameQuery = searchParams.get('lastName');
    if (typeof lastNameQuery === 'string') {
      this.initialLastName = lastNameQuery;
    }
  }

  render() {
    return html`
      <h2>Find Owners</h2>
      
      <vaadin-text-field label="Last name" .value="${this.initialLastName}" helper-text="${this.hintText}" clear-button-visible ${ref(this.textFieldRef)}>
        <vaadin-icon slot="prefix" icon="vaadin:search"></vaadin-icon>
      </vaadin-text-field>
      <vaadin-button @click="${this.findOwner}">Find Owner</vaadin-button><br>
      <br>
      <vaadin-button @click="${this.addOwner}">Add Owner</vaadin-button>
    `;
  }

  findOwner() {
    const lastName = this.textFieldRef.value?.value || '';
    const targetUrl = router.urlForPath('/owners-fusion') + '?lastName=' + encodeURIComponent(lastName);
    Router.go(targetUrl);
  }

  addOwner() {
    Router.go(router.urlForPath('/owners-fusion/new'));
  }
}
