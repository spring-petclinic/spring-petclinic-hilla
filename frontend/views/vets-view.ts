import { html, render } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@vaadin/grid';
import type { GridBodyRenderer } from '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-column';
import '@vaadin/grid/vaadin-grid-sort-column';
import { View } from '../views/view';
import Vet
  from 'Frontend/generated/org/springframework/samples/petclinic/vet/Vet';
import { VetEndpoint } from 'Frontend/generated/endpoints';

interface VetGridItem extends Vet {
  fullNameForSorting: string;
}

@customElement('vets-view')
export class VetsView extends View {
  @state()
  vetsGridItems: VetGridItem[] = [];

  private nameRenderer: GridBodyRenderer<Vet> = (root, _, model) => {
    const vet = model.item;
    render(html`${vet.firstName} ${vet.lastName}`, root);
  }

  private specialtiesRenderer: GridBodyRenderer<Vet> = (root, _, model) => {
    const vet = model.item;
    render(
      (vet.specialties.length > 0)
        ? html`<span>${vet.specialties.map((specialty) => specialty.name).join(', ')}</span>`
        : html`<span>none</span>`,
      root
    );
  }

  async connectedCallback() {
    super.connectedCallback();
    const vets = await VetEndpoint.list();
    this.vetsGridItems = vets.map(
      (vet) => ({
        ...vet,
        fullNameForSorting: `${vet.lastName} ${vet.firstName}`,
      })
    )
  }

  render() {
    return html`
      <h2>Veterinarians</h2>
      
      <vaadin-grid .items="${this.vetsGridItems}" theme="row-stripes" all-rows-visible>
        <vaadin-grid-sort-column header="Name" path="fullNameForSorting" .renderer="${this.nameRenderer}"></vaadin-grid-sort-column>
        <vaadin-grid-column header="Specialties" .renderer="${this.specialtiesRenderer}"></vaadin-grid-column>
      </vaadin-grid>
    `;
  }
}
