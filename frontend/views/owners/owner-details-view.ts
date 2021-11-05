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
import { router } from 'Frontend/index';
import { OwnerEndpoint, VisitEndpoint } from 'Frontend/generated/endpoints';
import Owner from 'Frontend/generated/org/springframework/samples/petclinic/owner/Owner';
import Pet from 'Frontend/generated/org/springframework/samples/petclinic/owner/Pet';
import { Binder } from '@vaadin/form';
import OwnerModel from 'Frontend/generated/org/springframework/samples/petclinic/owner/OwnerModel';
import { renderOwnerForm } from 'Frontend/views/owners/render-blocks';

@customElement('owner-details-view')
export class OwnerDetailsView extends View {
  @state()
  private owner?: Owner;

  private binder = new Binder(this, OwnerModel);

  connectedCallback() {
    super.connectedCallback();
    const id = parseInt(router.location.params.ownerId as string);
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

  getEditOwnerHref(ownerId: number | undefined) {
    if (ownerId === undefined) return '';
    return router.urlForName('edit-owner', { ownerId: ownerId.toString() });
  }

  getAddNewPetHref(ownerId: number | undefined) {
    if (ownerId === undefined) return '';
    return router.urlForName('add-pet', { ownerId: ownerId.toString() });
  }

  getEditPetHref(ownerId: number | undefined, petId: number | undefined) {
    if (ownerId === undefined || petId === undefined) return '';
    return router.urlForName('edit-pet', {
      ownerId: ownerId.toString(),
      petId: petId.toString(),
    });
  }

  getAddVisitHref(ownerId: number | undefined, petId: number | undefined) {
    if (ownerId === undefined || petId === undefined) return '';
    return router.urlForName('add-visit', {
      ownerId: ownerId.toString(),
      petId: petId.toString(),
    });
  }

  render() {
    const { owner } = this;
    const model = this.binder.model;
    return html`
      <h2>Owner Information</h2>

      ${renderOwnerForm(model, true)}

      <br />
      <div class="flex gap-m">
        <a href="${this.getEditOwnerHref(owner?.id)}">
          <vaadin-button class="btn-link" tabindex="-1">
            Edit Owner
          </vaadin-button>
        </a>
        <a href="${this.getAddNewPetHref(owner?.id)}">
          <vaadin-button class="btn-link" tabindex="-1">
            Add New Pet
          </vaadin-button>
        </a>
      </div>
      <br />
      <h2>Pets and Visits</h2>

      <div class="flex flex-col pet-list">
        ${owner?.pets.map(
          (pet) => html`
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
                <vaadin-grid
                  .items=${pet.visits}
                  theme="compact"
                  all-rows-visible>
                  <vaadin-grid-column
                    header="Visit Date"
                    path="date"></vaadin-grid-column>
                  <vaadin-grid-column path="description"></vaadin-grid-column>
                </vaadin-grid>
                <div class="flex gap-m">
                  <a href="${this.getEditPetHref(owner.id, pet.id)}">
                    <vaadin-button class="btn-link" tabindex="-1">
                      Edit Pet
                    </vaadin-button>
                  </a>
                  <a href="${this.getAddVisitHref(owner.id, pet.id)}">
                    <vaadin-button class="btn-link" tabindex="-1">
                      Add Visit
                    </vaadin-button>
                  </a>
                </div>
              </div>
            </div>
          `
        )}
      </div>
    `;
  }
}
