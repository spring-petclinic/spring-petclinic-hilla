import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Binder, ValidationError } from '@vaadin/form';
import { Router } from '@vaadin/router';
import '@vaadin/button';
import '@vaadin/form-layout';
import '@vaadin/text-field';
import { View } from '../../views/view';
import { router } from 'Frontend/index';
import { OwnerEndpoint } from 'Frontend/generated/endpoints';
import Owner from 'Frontend/generated/org/springframework/samples/petclinic/owner/Owner';
import OwnerModel from 'Frontend/generated/org/springframework/samples/petclinic/owner/OwnerModel';
import { EndpointError } from '@vaadin/fusion-frontend';
import { renderOwnerForm } from 'Frontend/views/owners/render-blocks';

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

      <form>
        ${renderOwnerForm(model)}
        <vaadin-button @click=${this.submit}>
          ${submitButtonText}
        </vaadin-button>
        <br />
        ${this.error !== undefined
          ? html`<p class="error">${this.error}</p>`
          : nothing}
      </form>
    `;
  }

  async submit() {
    this.error = undefined;
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
    const targetUrl = router.urlForName('owner-details', {
      ownerId: ownerId.toString(),
    });
    Router.go(targetUrl);
  }
}
