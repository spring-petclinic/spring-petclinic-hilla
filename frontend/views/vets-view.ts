import { html, HTMLTemplateResult, nothing, render } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@vaadin/vaadin-grid/vaadin-grid';
import type { GridBodyRenderer } from '@vaadin/vaadin-grid';
import '@vaadin/vaadin-grid/vaadin-grid-column';
import '@vaadin/vaadin-grid/vaadin-grid-sort-column';
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
    const templateJoin = (values: HTMLTemplateResult[], joiner: HTMLTemplateResult) => values.map((v, i) => [v, i < values.length - 1 ? joiner : nothing]);
    render(
      (vet.specialties.length > 0)
        ? templateJoin(
          vet.specialties.map(
            (specialty) => html`<span>${specialty.name}</span>`
          ),
          html`, ` // Add a comma between the items
        )
        : html`<span>none</span>`,
      root
    );
  }

  constructor() {
    super();
    VetEndpoint.list().then(
      (vets) =>
        this.vetsGridItems = vets.map(
          (vet) => ({
            ...vet,
            fullNameForSorting: `${vet.lastName} ${vet.firstName}`,
          })
        )
    );
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
