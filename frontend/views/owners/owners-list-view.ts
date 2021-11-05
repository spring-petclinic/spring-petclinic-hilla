import { html, nothing, render } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { View } from '../../views/view';
import '@vaadin/grid';
import type { GridBodyRenderer } from '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-column';
import { router } from 'Frontend/index';
import Owner from 'Frontend/generated/org/springframework/samples/petclinic/owner/Owner';
import { OwnerEndpoint } from 'Frontend/generated/endpoints';
import type {
  BeforeEnterObserver,
  PreventAndRedirectCommands,
  Router,
  RouterLocation,
} from '@vaadin/router';
import './find-owners-view';

interface OwnerGridItem extends Owner {
  fullNameForSorting: string;
  petsString: string;
}

@customElement('owners-list-view')
export class OwnersListView extends View implements BeforeEnterObserver {
  @state()
  private owners: Owner[] = [];

  private lastNameQuery?: string;

  // Called by Router
  async onBeforeEnter(
    location: RouterLocation,
    commands: PreventAndRedirectCommands,
    _router: Router
  ) {
    await this.processSearch(location);
    if (this.owners?.length === 1) {
      return commands.redirect(this.getOwnerHref(this.owners[0]));
    }
    return;
  }

  popStateHandler = (_e: PopStateEvent) => {
    this.processSearch();
  };

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener('popstate', this.popStateHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener('popstate', this.popStateHandler);
  }

  async processSearch(location: RouterLocation = router.location) {
    const searchParams = new URLSearchParams(location.search);
    this.lastNameQuery = searchParams.get('lastName') || '';
    this.owners = await OwnerEndpoint.findByLastName(this.lastNameQuery);
  }

  private nameRenderer: GridBodyRenderer<Owner> = (root, _, model) => {
    const owner = model.item;
    render(
      html`<a href="${this.getOwnerHref(owner)}">
        ${owner.firstName} ${owner.lastName}
      </a>`,
      root
    );
  };

  private petRenderer: GridBodyRenderer<Owner> = (root, _, model) => {
    const owner = model.item;
    render(html`${owner.pets.flatMap((p) => p.name).join(', ')}`, root);
  };

  render() {
    if (!this.owners) {
      return nothing;
    }
    if (this.owners.length === 0) {
      return this.renderNotFound();
    }
    return this.renderList();
  }

  renderNotFound() {
    return html`
      <find-owners-view
        .last-name=${this.lastNameQuery}
        hint-text="has not been found"></find-owners-view>
    `;
  }

  renderList() {
    return html`
      <h2>Owners</h2>

      <vaadin-grid .items=${this.owners} theme="row-stripes" all-rows-visible>
        <vaadin-grid-column
          header="Name"
          path="fullNameForSorting"
          .renderer=${this.nameRenderer}></vaadin-grid-column>
        <vaadin-grid-column path="address"></vaadin-grid-column>
        <vaadin-grid-column path="city"></vaadin-grid-column>
        <vaadin-grid-column path="telephone"></vaadin-grid-column>
        <vaadin-grid-column
          header="Pets"
          .renderer=${this.petRenderer}></vaadin-grid-column>
      </vaadin-grid>
    `;
  }

  getOwnerHref(owner: Owner) {
    return router.urlForName('owner-details', { ownerId: `${owner.id}` });
  }
}
