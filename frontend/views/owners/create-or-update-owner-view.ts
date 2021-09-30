import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Binder, field } from '@vaadin/form';
import { Router } from '@vaadin/router';
import '@vaadin/vaadin-button/vaadin-button';
import '@vaadin/vaadin-form-layout/vaadin-form-layout';
import '@vaadin/vaadin-text-field/vaadin-text-field';
import { View } from '../../views/view';
import { router } from 'Frontend/index';
import { OwnerEndpoint } from 'Frontend/generated/endpoints';
import Owner
  from 'Frontend/generated/org/springframework/samples/petclinic/owner/Owner';
import OwnerModel
  from 'Frontend/generated/org/springframework/samples/petclinic/owner/OwnerModel';
import { EndpointError } from '@vaadin/flow-frontend';

@customElement('create-or-update-owner-view')
export class CreateOrUpdateOwnerView extends View {
  @state()
  private owner?: Owner;

  @state()
  private error?: string;

  private binder = new Binder(this, OwnerModel);

  connectedCallback() {
    super.connectedCallback();
    if (router.location.route?.name === 'edit-owner') {
      const id = parseInt(router.location.params.ownerId as string);
      this.fetchOwner(id);
    }
  }

  async fetchOwner(id: number) {
    this.owner = undefined;
    this.error = undefined;
    this.binder.clear();
    try {
      this.owner = await OwnerEndpoint.findById(id);
    } finally {
      if (this.owner) {
        this.binder.read(this.owner);
      } else {
        this.error = `No owner found with id ${id}`;
      }
    }
  }

  render() {
    const model = this.binder.model;
    const submitButtonText = !this.owner ? 'Add Owner' : 'Update Owner';
    return html`
      <h2>Owner</h2>
      
      <vaadin-form-layout>
        <vaadin-text-field label="First Name" ${field(model.firstName)}></vaadin-text-field>
        <vaadin-text-field label="Last Name" ${field(model.lastName)}></vaadin-text-field>
        <vaadin-text-field label="Address" colspan="2" ${field(model.address)}></vaadin-text-field>
        <vaadin-text-field label="City" ${field(model.city)}></vaadin-text-field>
        <vaadin-text-field label="Telephone" ${field(model.telephone)}></vaadin-text-field>
      </vaadin-form-layout>
      <vaadin-button @click="${this.submit}">${submitButtonText}</vaadin-button><br>
      ${this.error !== undefined
        ? html`<p class="error">${this.error}</p>`
        : nothing }
    `;
  }

  async submit() {
    this.error = undefined;
    let ownerId: number;
    try {
      ownerId = await this.binder.submitTo(OwnerEndpoint.save);
    } catch (e) {
      if (!(e instanceof EndpointError)) {
        this.error = 'Saving owner failed due to network error. Try again later.';
      } else {
        this.error = 'Saving owner failed due to server error';
      }
      console.error(e.type, e.message);
      return;
    }
    const targetUrl = router.urlForName('owner-details', { ownerId: ownerId.toString() });
    Router.go(targetUrl);
  }
}
