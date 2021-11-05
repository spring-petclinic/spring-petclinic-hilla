import { html, nothing, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref';
import { Binder, field, ValidationError } from '@vaadin/form';
import { Router } from '@vaadin/router';
import { selectRenderer } from 'lit-vaadin-helpers';
import { formatISO } from 'date-fns';
import '@vaadin/button';
import '@vaadin/date-picker';
import '@vaadin/form-layout';
import '@vaadin/form-layout/vaadin-form-item';
import '@vaadin/item';
import '@vaadin/list-box';
import '@vaadin/select';
import type { Select } from '@vaadin/select';
import '@vaadin/text-field';
import { View } from '../../views/view';
import { router } from 'Frontend/index';
import { OwnerEndpoint, PetEndpoint } from 'Frontend/generated/endpoints';
import Owner from 'Frontend/generated/org/springframework/samples/petclinic/owner/Owner';
import PetDTO from 'Frontend/generated/org/springframework/samples/petclinic/dto/PetDTO';
import PetDTOModel from 'Frontend/generated/org/springframework/samples/petclinic/dto/PetDTOModel';
import { EndpointError } from '@vaadin/fusion-frontend';
import PetType from 'Frontend/generated/org/springframework/samples/petclinic/owner/PetType';

@customElement('create-or-update-pet-view')
export class CreateOrUpdatePetView extends View {
  @state()
  private owner?: Owner;

  @state()
  private pet?: PetDTO;

  @state()
  private petTypes?: PetType[];

  @state()
  private error?: string;

  @state()
  private today = formatISO(Date.now(), { representation: 'date' });

  private binder = new Binder(this, PetDTOModel);

  private selectRef: Ref<Select> = createRef();

  connectedCallback() {
    super.connectedCallback();
    const ownerId = parseInt(router.location.params.ownerId as string);
    this.fetchOwner(ownerId);
    this.fetchPetTypes();
    if (router.location.route?.name === 'edit-pet') {
      const petId = parseInt(router.location.params.petId as string);
      this.fetchPet(petId);
    }
  }

  async fetchOwner(id: number) {
    this.owner = undefined;
    try {
      this.owner = await OwnerEndpoint.findById(id);
      if (this.owner?.id) {
        this.binder.value = { ...this.binder.value, ownerId: this.owner.id };
      }
    } finally {
      if (!this.owner) {
        this.error = `No owner found with id ${id}`;
      }
    }
  }

  async fetchPetTypes() {
    this.petTypes = undefined;
    try {
      this.petTypes = await PetEndpoint.findPetTypes();
      // Preselect first pet type when not editing an existing pet
      if (!this.pet) {
        this.binder.value = {
          ...this.binder.value,
          typeId: this.petTypes[0].id!,
        };
      }
    } finally {
      if (!this.petTypes) {
        this.error = `Error fetching pet types`;
      }
    }
  }

  async fetchPet(id: number) {
    this.owner = undefined;
    this.pet = undefined;
    this.binder.clear();
    try {
      this.pet = await PetEndpoint.findById(id);
    } finally {
      if (this.pet) {
        this.binder.read(this.pet);
      } else {
        this.error = `No pet found with id ${id}`;
      }
    }
  }

  async updated(changedProperties: PropertyValues) {
    if (changedProperties.has('petTypes')) {
      // Need to manually trigger the select renderer whenever the item set changes dynamically
      this.selectRef.value?.requestContentUpdate();
    }
  }

  render() {
    const { model } = this.binder;
    const submitButtonText = !this.pet ? 'Add Pet' : 'Update Pet';
    return html`
      <h2>Pet</h2>

      <div class="flex flex-col items-start">
        <vaadin-text-field
          label="Owner"
          .value=${`${this.owner?.firstName} ${this.owner?.lastName}`}
          readonly></vaadin-text-field>

        <vaadin-text-field
          label="Name"
          ${field(model.name)}></vaadin-text-field>
        <vaadin-date-picker
          label="Birth Date"
          ${field(model.birthDate)}
          .max=${this.today}></vaadin-date-picker>
        <vaadin-select
          label="Type"
          ${ref(this.selectRef)}
          ${field(model.typeId)}
          ${selectRenderer(
            () => html`
              <vaadin-list-box>
                ${this.petTypes?.map(
                  ({ id, name }) =>
                    html`<vaadin-item .value=${id}>${name}</vaadin-item>`
                )}
              </vaadin-list-box>
            `
          )}></vaadin-select>
        <vaadin-button @click=${this.submit}>${submitButtonText}</vaadin-button>
      </div>
      ${this.error !== undefined
        ? html`<p class="error">${this.error}</p>`
        : nothing}
    `;
  }

  async submit() {
    this.error = undefined;
    let petId: number;
    try {
      petId = await this.binder.submitTo(PetEndpoint.save);
    } catch (e) {
      if (e instanceof EndpointError) {
        this.error = 'Saving pet failed due to server error';
      } else if (e instanceof ValidationError) {
        this.error = 'Saving pet failed due to validation error(s).';
      } else {
        this.error = 'Saving pet failed due to network error. Try again later.';
      }
      console.error(e);
      return;
    }
    const targetUrl = router.urlForName('owner-details', {
      ownerId: this.owner!.id!.toString(),
    });
    Router.go(targetUrl);
  }
}
