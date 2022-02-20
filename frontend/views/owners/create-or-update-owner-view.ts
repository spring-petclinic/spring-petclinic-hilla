import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Binder, ValidationError } from '@hilla/form';
import { Router } from '@vaadin/router';
import '@vaadin/button';
import '@vaadin/form-layout';
import '@vaadin/text-field';
import { View } from '../../views/view';
import { router } from 'Frontend/index';
import { OwnerEndpoint } from 'Frontend/generated/endpoints';
import Owner from 'Frontend/generated/org/springframework/samples/petclinic/owner/Owner';
import OwnerModel from 'Frontend/generated/org/springframework/samples/petclinic/owner/OwnerModel';
import { EndpointError } from '@hilla/frontend';
import { ownerForm } from 'Frontend/views/owners/blocks';

@customElement('create-or-update-owner-view')
export class CreateOrUpdateOwnerView extends View {
  @state() owner?: Owner;
  @state() error = '';

  private binder = new Binder(this, OwnerModel);

  connectedCallback() {
    super.connectedCallback();
    if (router.location.route?.name === 'edit-owner') {
      const id = parseInt(router.location.params.ownerId as string);
      this.fetchOwner(id);
    }
  }

  async fetchOwner(id: number) {
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
    const submitButtonText = this.owner ? 'Update Owner' : 'Add Owner';
    return html`
      <div class="flex flex-col gap-m items-start">
        <h2>Owner</h2>

        ${ownerForm(model)}
        <vaadin-button @click=${this.submit}>
          ${submitButtonText}
        </vaadin-button>

        ${this.error ? html`<p class="error">${this.error}</p>` : nothing}
      </div>
    `;
  }

  async submit() {
    let ownerId: number;

    try {
      ownerId = await this.binder.submitTo(OwnerEndpoint.save);
    } catch (e) {
      if (e instanceof EndpointError) {
        this.error = 'Saving owner failed due to server error';
      } else if (e instanceof ValidationError) {
        this.error = 'Saving owner failed due to validation error(s).';
      } else {
        this.error =
          'Saving owner failed due to network error. Try again later.';
      }
      console.error(e);
      return;
    }

    Router.go(`/owners/${ownerId}`);
  }
}
