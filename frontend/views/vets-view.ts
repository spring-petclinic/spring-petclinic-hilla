import { html, render } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-column';
import '@vaadin/grid/vaadin-grid-sort-column';
import type { GridBodyRenderer } from '@vaadin/grid';
import { View } from '../views/view';
import Vet from 'Frontend/generated/org/springframework/samples/petclinic/vet/Vet';
import { VetEndpoint } from 'Frontend/generated/endpoints';

@customElement('vets-view')
export class VetsView extends View {
  @state()
  vets: Vet[] = [];

  private nameRenderer: GridBodyRenderer<Vet> = (root, _, model) => {
    const vet = model.item;
    render(html`${vet.firstName} ${vet.lastName}`, root);
  };

  private specialtiesRenderer: GridBodyRenderer<Vet> = (root, _, model) => {
    const vet = model.item;
    render(
      vet.specialties.length > 0
        ? html`<span>
            ${vet.specialties.map((specialty) => specialty.name).join(', ')}
          </span>`
        : html`<span>none</span>`,
      root
    );
  };

  async connectedCallback() {
    super.connectedCallback();
    this.vets = await VetEndpoint.list();
  }

  render() {
    return html`
      <h2>Veterinarians</h2>

      <vaadin-grid .items=${this.vets} theme="row-stripes" all-rows-visible>
        <vaadin-grid-column
          header="Name"
          .renderer=${this.nameRenderer}></vaadin-grid-column>
        <vaadin-grid-column
          header="Specialties"
          .renderer=${this.specialtiesRenderer}></vaadin-grid-column>
      </vaadin-grid>
    `;
  }
}
