import { html, nothing, PropertyValueMap, render } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import '@vaadin/button';
import '@vaadin/icons';
import '@vaadin/icon';
import '@vaadin/grid';
import '@vaadin/text-field';
import type { TextField } from '@vaadin/text-field';
import { View } from '../../views/view';
import { router } from 'Frontend/index';
import { Router } from '@vaadin/router';
import Owner from 'Frontend/generated/org/springframework/samples/petclinic/owner/Owner';
import { OwnerEndpoint } from 'Frontend/generated/endpoints';
import { GridBodyRenderer } from '@vaadin/grid';

@customElement('find-owners-view')
export class FindOwnersView extends View {
  @state() lastName = '';
  @state() owners: Owner[] = [];

  async firstUpdated() {
    this.owners = await OwnerEndpoint.findByLastName('');
  }

  render() {
    return html`
      <div class="flex flex-col gap-l">
        <h2>Find Owners</h2>

        <div class="flex gap-m items-baseline">
          <vaadin-text-field
            label="Last name"
            .value=${this.lastName}
            @change=${this.lastNameChanged}
            @keyup=${this.textFieldKeyUp}
            helper-text=${this.owners.length === 0 ? 'Owner was not found' : ''}
            clear-button-visible>
            <vaadin-icon slot="prefix" icon="vaadin:search"></vaadin-icon>
          </vaadin-text-field>
          <vaadin-button @click=${this.findOwner} theme="primary">
            Find Owner
          </vaadin-button>
          <vaadin-button @click=${this.addOwner}>Add Owner</vaadin-button>
        </div>

        ${this.owners.length > 0
          ? html`
              <vaadin-grid
                .items=${this.owners}
                theme="row-stripes"
                all-rows-visible>
                <vaadin-grid-column
                  header="Name"
                  .renderer=${this.nameRenderer}></vaadin-grid-column>
                <vaadin-grid-column path="address"></vaadin-grid-column>
                <vaadin-grid-column path="city"></vaadin-grid-column>
                <vaadin-grid-column path="telephone"></vaadin-grid-column>
                <vaadin-grid-column
                  header="Pets"
                  .renderer=${this.petRenderer}></vaadin-grid-column>
              </vaadin-grid>
            `
          : nothing}
      </div>
    `;
  }

  lastNameChanged(event: Event) {
    const textField = event.target as TextField;
    this.lastName = textField.value;
  }

  textFieldKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.findOwner();
    }
  }

  async findOwner() {
    this.owners = await OwnerEndpoint.findByLastName(this.lastName);
  }

  addOwner() {
    Router.go(router.urlForName('new-owner'));
  }

  private nameRenderer: GridBodyRenderer<Owner> = (root, _, model) => {
    const owner = model.item;
    render(
      html`<a href=${`/owners/${owner.id}`}>
        ${owner.firstName} ${owner.lastName}
      </a>`,
      root
    );
  };

  private petRenderer: GridBodyRenderer<Owner> = (root, _, model) => {
    const owner = model.item;
    render(html`${owner.pets.flatMap((p) => p.name).join(', ')}`, root);
  };
}
