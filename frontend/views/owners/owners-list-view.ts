import { html, nothing, render } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { View } from '../../views/view';
import '@vaadin/vaadin-grid/vaadin-grid';
import type { GridBodyRenderer } from '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-column';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column';
import { router } from 'Frontend/index';
import Owner
  from 'Frontend/generated/org/springframework/samples/petclinic/owner/Owner';
import { OwnerEndpoint } from 'Frontend/generated/endpoints';
import type { BeforeEnterObserver, PreventAndRedirectCommands, Router, RouterLocation } from '@vaadin/router';
import './find-owners-view';

interface OwnerGridItem extends Owner {
  fullNameForSorting: string;
  petsString: string;
}

@customElement('owners-list-view')
export class OwnersListView extends View implements BeforeEnterObserver {
  @state()
  private owners?: Readonly<Array<Owner>>;

  @state()
  private ownersGridItems: Array<OwnerGridItem> = [];

  private lastNameQuery?: string;

  private nameRenderer: GridBodyRenderer<Owner> = (root, _, model) => {
    const owner = model.item;
    render(html`<a href="${this.getOwnerHref(owner)}">${owner.firstName} ${owner.lastName}</a>`, root);
  }

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
    this.ownersGridItems = this.owners.map((owner) => ({
      ...owner,
      fullNameForSorting: `${owner.lastName} ${owner.firstName}`,
      petsString: owner.pets.map((pet) => pet.name).join(', '),
    }));
  }

  render() {
    const { owners } = this;
    if (!owners) {
      return nothing;
    }
    if (owners.length === 0) {
      return this.renderNotFound();
    }
    return this.renderList();
  }

  renderNotFound() {
    return html`
      <find-owners-view initial-last-name="${this.lastNameQuery}" hint-text="has not been found"></find-owners-view>
    `;
  }

  renderList() {
    return html`
      <h2>Owners</h2>
      
      <vaadin-grid .items="${this.ownersGridItems}" theme="row-stripes" all-rows-visible>
        <vaadin-grid-sort-column header="Name" path="fullNameForSorting" .renderer="${this.nameRenderer}"></vaadin-grid-sort-column>
        <vaadin-grid-column path="address"></vaadin-grid-column>
        <vaadin-grid-sort-column path="city"></vaadin-grid-sort-column>
        <vaadin-grid-column path="telephone"></vaadin-grid-column>
        <vaadin-grid-column header="Pets" path="petsString"></vaadin-grid-column>
      </vaadin-grid>
    `;
  }

  getOwnerHref(owner: Owner) {
    return router.urlForPath('/owners-fusion/:id', { id: `${owner.id}` });
  }
}
