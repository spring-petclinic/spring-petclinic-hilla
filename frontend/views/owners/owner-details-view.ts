import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import '@vaadin/button';
import '@vaadin/form-layout';
import '@vaadin/form-layout/vaadin-form-item';
import '@vaadin/text-field';
import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-column';
import '@vaadin/grid/vaadin-grid-sort-column';
import { View } from '../../views/view';
import { OwnerEndpoint, VisitEndpoint } from 'Frontend/generated/endpoints';
import Owner from 'Frontend/generated/org/springframework/samples/petclinic/owner/Owner';
import Pet from 'Frontend/generated/org/springframework/samples/petclinic/owner/Pet';
import { Binder } from '@hilla/form';
import OwnerModel from 'Frontend/generated/org/springframework/samples/petclinic/owner/OwnerModel';
import { ownerForm } from 'Frontend/views/owners/blocks';
import { BeforeEnterObserver, RouterLocation } from '@vaadin/router';

@customElement('owner-details-view')
export class OwnerDetailsView extends View implements BeforeEnterObserver {
  @state()
  private owner?: Owner;
  private binder = new Binder(this, OwnerModel);

  onBeforeEnter(location: RouterLocation) {
    const id = parseInt(location.params.ownerId as string);
    this.fetchOwner(id);
  }

  async fetchOwner(id: number) {
    this.binder.clear();
    this.owner = await OwnerEndpoint.findById(id);
    if (!this.owner) return;

    // Fetch visits for pets
    if (this.owner.pets) {
      let pets: Pet[] = [];
      for (const pet of this.owner.pets) {
        const visits = await VisitEndpoint.findByPetId(pet.id);
        pets.push({ ...pet, visits });
      }
      this.owner = { ...this.owner, pets };
    }
    this.binder.read(this.owner);
  }

  render() {
    const { model } = this.binder;

    return html`
      <div class="flex flex-wrap gap-xl w-full justify-between">

        <div class="flex flex-col gap-m">

          <h2>Owner Information</h2>
          
          ${ownerForm(model, true)}

          <div class="flex gap-m">
            <a href=${`/owners/${this.owner?.id}/edit`}>
              <vaadin-button class="btn-link" tabindex="-1">
                Edit Owner
              </vaadin-button>
            </a>
            <a href=${`/owners/${this.owner?.id}/pets/new`}>
              <vaadin-button class="btn-link" tabindex="-1">
                Add New Pet
              </vaadin-button>
            </a>
          </div>
        </div>

        <div class="flex flex-col gap-m flex-grow">
          
        <h2>Pets and Visits</h2>

          <div class="flex flex-col pet-list">
            ${this.owner?.pets.map((pet) => this.petLayout(pet))}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  petLayout(pet: Pet) {
    return html`
      <div class="flex p-m gap-l">
        <div class="flex flex-col">
          <vaadin-text-field
            readonly
            label="Name"
            .value=${pet.name}></vaadin-text-field>
          <vaadin-date-picker
            label="Birth Date"
            value=${pet.birthDate}
            readonly></vaadin-date-picker>
          <vaadin-text-field
            readonly
            label="Type"
            .value=${pet.type?.name}></vaadin-text-field>
        </div>

        <div class="w-full flex flex-col gap-m">
          <vaadin-grid .items=${pet.visits} theme="compact" all-rows-visible>
            <vaadin-grid-column
              header="Visit Date"
              path="date"></vaadin-grid-column>
            <vaadin-grid-column path="description"></vaadin-grid-column>
          </vaadin-grid>
          <div class="flex gap-m">
            <a href=${`/owners/${this.owner?.id}/pets/${pet.id}/edit`}>
              <vaadin-button class="btn-link" tabindex="-1">
                Edit Pet
              </vaadin-button>
            </a>
            <a href=${`/owners/${this.owner?.id}/pets/${pet.id}/visits/new`}>
              <vaadin-button class="btn-link" tabindex="-1">
                Add Visit
              </vaadin-button>
            </a>
          </div>
        </div>
      </div>
    `;
  }
}
