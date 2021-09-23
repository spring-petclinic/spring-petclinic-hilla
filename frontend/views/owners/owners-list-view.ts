import { html, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { View } from '../../views/view';
import { router } from 'Frontend/index';
import Owner
  from 'Frontend/generated/org/springframework/samples/petclinic/owner/Owner';
import { OwnerEndpoint } from 'Frontend/generated/endpoints';
import type { BeforeEnterObserver, PreventAndRedirectCommands, Router, RouterLocation } from '@vaadin/router';
import './find-owners-view';

@customElement('owners-list-view')
export class OwnersListView extends View implements BeforeEnterObserver {
  @state()
  private owners?: Readonly<Array<Owner>>;

  private lastNameQuery?: string;

  constructor() {
    super();
    this.popStateHandler = this.popStateHandler.bind(this);
  }

  // Called by Router
  async onBeforeEnter(location: RouterLocation, commands: PreventAndRedirectCommands, _router: Router) {
    await this.processSearch(location);
    if (this.owners?.length === 1) {
      return commands.redirect(this.getOwnerHref(this.owners[0]));
    }
    return;
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', this.popStateHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this.popStateHandler);
  }

  popStateHandler(_e: PopStateEvent) {
    this.processSearch();
  }

  async processSearch(location: RouterLocation = router.location) {
    const searchParams = new URLSearchParams(location.search);
    this.lastNameQuery = searchParams.get('lastName') || '';
    this.owners = await OwnerEndpoint.findByLastName(this.lastNameQuery);
  }

  render() {
    const { owners } = this;
    if (!owners) {
      return nothing;
    }
    if (owners.length === 0) {
      return this.renderNotFound();
    }
    return this.renderList(owners);
  }

  renderNotFound() {
    return html`
      <find-owners-view initial-last-name="${this.lastNameQuery}" hint-text="has not been found"></find-owners-view>
    `;
  }

  renderList(owners: Readonly<Array<Owner>>) {
    return html`
      <h2>Owners</h2>

      <table id="owners" class="table table-striped">
        <thead>
        <tr>
          <th style="width: 150px;">Name</th>
          <th style="width: 200px;">Address</th>
          <th>City</th>
          <th style="width: 120px;">Telephone</th>
          <th>Pets</th>
        </tr>
        </thead>
        <tbody>
        ${owners.map(
          (owner) => html`
              <tr>
                <td><a href="${this.getOwnerHref(owner)}">${owner.firstName} ${owner.lastName}</a></td>
                <td>${owner.address}</td>
                <td>${owner.city}</td>
                <td>${owner.telephone}</td>
                <td><span>${owner.pets.map((pet) => pet.name).join(', ')}</span></td>
              </tr>
            `
        )}
        </tbody>
      </table>
    `;
  }

  getOwnerHref(owner: Owner) {
    return router.urlForPath('/owners-fusion/:id', { id: `${owner.id}` });
  }
}
