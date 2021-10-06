import { html, nothing, PropertyValues } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref';
import { Binder, field, ValidationError } from '@vaadin/form';
import { Router } from '@vaadin/router';
import { selectRenderer } from 'lit-vaadin-helpers';
import { formatISO } from 'date-fns';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import '@vaadin/vaadin-button/vaadin-button';
import '@vaadin/vaadin-date-picker/vaadin-date-picker';
import type { DatePickerDate, DatePickerElement } from '@vaadin/vaadin-date-picker/vaadin-date-picker';
import '@vaadin/vaadin-form-layout/vaadin-form-layout';
import '@vaadin/vaadin-form-layout/vaadin-form-item';
import '@vaadin/vaadin-item/vaadin-item';
import '@vaadin/vaadin-list-box/vaadin-list-box';
import '@vaadin/vaadin-select/vaadin-select';
import type { Select } from '@vaadin/vaadin-select/vaadin-select';
import '@vaadin/vaadin-text-field/vaadin-text-field';
import { View } from '../../views/view';
import { router } from 'Frontend/index';
import { OwnerEndpoint, PetEndpoint } from 'Frontend/generated/endpoints';
import Owner
  from 'Frontend/generated/org/springframework/samples/petclinic/owner/Owner';
import PetDTO
  from 'Frontend/generated/org/springframework/samples/petclinic/dto/PetDTO';
import PetDTOModel
  from 'Frontend/generated/org/springframework/samples/petclinic/dto/PetDTOModel';
import { EndpointError } from '@vaadin/fusion-frontend';
import PetType
  from 'Frontend/generated/org/springframework/samples/petclinic/owner/PetType';

@customElement('create-or-update-pet-view')
export class CreateOrUpdatePetView extends View {
  @state()
  private owner?: Owner;

  @state()
  private pet?: PetDTO;

  @state()
  private petTypes?: ReadonlyArray<PetType>;

  @state()
  private error?: string;

  @state()
  private today = formatISO(Date.now(), { representation: 'date' });

  private binder = new Binder(this, PetDTOModel);

  private selectRef: Ref<Select> = createRef();

  private datePickerRef: Ref<DatePickerElement> = createRef();

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
        this.binder.value = { ...this.binder.value, typeId: this.petTypes[0].id! };
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

  firstUpdated() {
    this.configureDatePicker();
  }

  configureDatePicker() {
    const formatDateIso8601 = (dateParts: DatePickerDate): string => {
      const { year, month, day } = dateParts;
      const date = new Date(year, month, day);

      return dateFnsFormat(date, 'yyyy-MM-dd');
    };

    const parseDateIso8601 = (inputValue: string): DatePickerDate => {
      const date = dateFnsParse(inputValue, 'yyyy-MM-dd', new Date());

      return { year: date.getFullYear(), month: date.getMonth(), day: date.getDate() };
    };

    if (this.datePickerRef.value) {
      this.datePickerRef.value.i18n = {
        ...this.datePickerRef.value.i18n,
        formatDate: formatDateIso8601,
        parseDate: parseDateIso8601,
      };
    }
  }

  async updated(changedProperties: PropertyValues) {
    if (changedProperties.has('petTypes')) {
      // Need to manually trigger the select renderer whenever the item set changes dynamically
      this.selectRef.value?.requestContentUpdate();
    }
  }

  render() {
    const model = this.binder.model;
    const submitButtonText = !this.pet ? 'Add Pet' : 'Update Pet';
    return html`
      <h2>Pet</h2>
      
      <vaadin-form-layout>
        <vaadin-form-item colspan="2">
          <span slot="label">Owner</span>
          ${this.owner?.firstName} ${this.owner?.lastName}
        </vaadin-form-item>
        <vaadin-form-item>
          <label slot="label">Name</label>
          <vaadin-text-field ${field(model.name)}></vaadin-text-field>
        </vaadin-form-item>
        <vaadin-form-item>
          <label slot="label">Birth Date</label>
          <vaadin-date-picker
            ${ref(this.datePickerRef)}
            ${field(model.birthDate)}
            .max="${this.today}"
          ></vaadin-date-picker>
        </vaadin-form-item>
        <vaadin-form-item>
          <label slot="label">Type</label>
          <vaadin-select
            ${ref(this.selectRef)}
            ${field(model.typeId)}
            ${selectRenderer(
              () => html`
                <vaadin-list-box>
                  ${this.petTypes?.map(
                    ({ id, name }) =>
                      html`<vaadin-item .value="${id}">${name}</vaadin-item>` 
                  )}
                </vaadin-list-box>
              `
            )}
          ></vaadin-select>
        </vaadin-form-item>
      </vaadin-form-layout>
      <vaadin-button @click="${this.submit}">${submitButtonText}</vaadin-button><br>
      ${this.error !== undefined
        ? html`<p class="error">${this.error}</p>`
        : nothing }
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
    const targetUrl = router.urlForName('owner-details', { ownerId: this.owner!.id!.toString() });
    Router.go(targetUrl);
  }
}
