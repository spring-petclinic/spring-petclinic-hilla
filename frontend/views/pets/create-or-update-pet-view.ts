import { html, nothing, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref';
import { Binder, field, ValidationError } from '@hilla/form';
import { BeforeEnterObserver, Router, RouterLocation } from '@vaadin/router';
import { selectRenderer } from 'lit-vaadin-helpers';
import { formatISO } from 'date-fns';
import '@vaadin/button';
import '@vaadin/date-picker';
import '@vaadin/form-layout';
import '@vaadin/form-layout/vaadin-form-item';
import '@vaadin/item';
import '@vaadin/list-box';
import '@vaadin/select';
import type { Select, SelectItem } from '@vaadin/select';
import '@vaadin/text-field';
import { View } from '../../views/view';
import { OwnerEndpoint, PetEndpoint } from 'Frontend/generated/endpoints';
import Owner from 'Frontend/generated/org/springframework/samples/petclinic/owner/Owner';
import PetDTO from 'Frontend/generated/org/springframework/samples/petclinic/dto/PetDTO';
import PetDTOModel from 'Frontend/generated/org/springframework/samples/petclinic/dto/PetDTOModel';
import { EndpointError } from '@hilla/frontend';
import PetType from 'Frontend/generated/org/springframework/samples/petclinic/owner/PetType';

@customElement('create-or-update-pet-view')
export class CreateOrUpdatePetView extends View implements BeforeEnterObserver {
  @state() owner?: Owner;
  @state() pet?: PetDTO;
  @state() petTypes: SelectItem[] = [];
  @state() error = '';
  @state() today = formatISO(Date.now(), { representation: 'date' });

  private binder = new Binder(this, PetDTOModel);
  private selectRef: Ref<Select> = createRef();

  onBeforeEnter(location: RouterLocation) {
    const id = parseInt(location.params.ownerId as string);
    this.fetchOwner(id);
    this.fetchPetTypes();
    if (location.route?.name === 'edit-pet') {
      const petId = parseInt(location.params.petId as string);
      this.fetchPet(petId);
    }
  }

  async fetchOwner(id: number) {
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
    try {
      const types = await PetEndpoint.findPetTypes();
      // Convert to SelectItem for <vaadin-select>
      this.petTypes = types.map((type) => ({
        label: type.name + '',
        value: type.id + '',
      }));
    } finally {
      if (!this.petTypes) {
        this.error = `Error fetching pet types`;
      }
    }
  }

  async fetchPet(id: number) {
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
          .items=${this.petTypes}
          ${ref(this.selectRef)}
          ${field(model.typeId)}></vaadin-select>
        <vaadin-button @click=${this.submit}>${submitButtonText}</vaadin-button>
      </div>
      <p class="error">${this.error}</p>
    `;
  }

  async submit() {
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

    Router.go(`/owners/${this.owner?.id}`);
  }
}
