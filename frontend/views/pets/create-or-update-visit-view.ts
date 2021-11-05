import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { Binder, field, ValidationError } from '@vaadin/form';
import { Router } from '@vaadin/router';
import { formatISO } from 'date-fns';
import '@vaadin/button';
import '@vaadin/date-picker';
import '@vaadin/form-layout';
import '@vaadin/text-field';
import '@vaadin/grid';
import '@vaadin/grid/vaadin-grid-column';
import '@vaadin/grid/vaadin-grid-sort-column';
import { View } from '../../views/view';
import { router } from 'Frontend/index';
import { PetEndpoint, VisitEndpoint } from 'Frontend/generated/endpoints';
import PetDTO from 'Frontend/generated/org/springframework/samples/petclinic/dto/PetDTO';
import { EndpointError } from '@vaadin/fusion-frontend';
import VisitModel from 'Frontend/generated/org/springframework/samples/petclinic/visit/VisitModel';
import Visit from 'Frontend/generated/org/springframework/samples/petclinic/visit/Visit';

@customElement('create-or-update-visit-view')
export class CreateOrUpdateVisitView extends View {
  @state()
  private pet?: PetDTO;

  @state()
  private visits?: Visit[];

  @state()
  private error?: string;

  @state()
  private today = formatISO(Date.now(), { representation: 'date' });

  private binder = new Binder(this, VisitModel);

  connectedCallback() {
    super.connectedCallback();
    const petId = parseInt(router.location.params.petId as string);
    this.fetchPet(petId);
    this.fetchVisits(petId);
  }

  async fetchPet(id: number) {
    this.pet = undefined;
    try {
      this.pet = await PetEndpoint.findById(id);
    } finally {
      if (!this.pet) {
        this.error = `No pet found with id ${id}`;
      }
    }
  }

  async fetchVisits(petId: number) {
    this.visits = undefined;
    try {
      this.visits = await VisitEndpoint.findByPetId(petId);
    } finally {
      if (!this.visits) {
        this.error = `Error fetching visits`;
      }
    }
  }

  firstUpdated() {
    // Preselect today's date
    this.binder.value = { ...this.binder.value, date: this.today };
  }

  render() {
    const model = this.binder.model;
    return html`
      <h2>New Visit</h2>

      <h3>Pet</h3>

      <div class="flex flex-wrap gap-m">
        <vaadin-text-field
          readonly
          label="Name"
          value=${this.pet?.name}></vaadin-text-field>
        <vaadin-date-picker
          readonly
          label="Birth Date"
          value=${this.pet?.birthDate}></vaadin-date-picker>
        <vaadin-text-field
          readonly
          label="Type"
          value=${this.pet?.typeName}></vaadin-text-field>
        <vaadin-text-field
          readonly
          label="Owner"
          value="${this.pet?.ownerFirstName} ${this.pet
            ?.ownerLastName}"></vaadin-text-field>
      </div>

      <div class="form-group has-feedback">
        <vaadin-date-picker
          label="Date"
          ${field(model.date)}
          .max=${this.today}></vaadin-date-picker>
        <vaadin-text-field
          label="Description"
          ${field(model.description)}
          class="w-full"></vaadin-text-field>
        <vaadin-button @click=${this.submit}>Add Visit</vaadin-button>
      </div>

      <h3>Previous Visits</h3>
      <vaadin-grid .items=${this.visits} all-rows-visible>
        <vaadin-grid-sort-column
          header="Visit Date"
          path="date"></vaadin-grid-sort-column>
        <vaadin-grid-column path="description"></vaadin-grid-column>
      </vaadin-grid>
    `;
  }

  private saveVisit = (visit: Visit | undefined) =>
    VisitEndpoint.save(visit, this.pet?.id);

  async submit() {
    this.error = undefined;
    let visitId: number;
    try {
      visitId = await this.binder.submitTo(this.saveVisit);
    } catch (e) {
      if (e instanceof EndpointError) {
        this.error = 'Saving visit failed due to server error';
      } else if (e instanceof ValidationError) {
        this.error = 'Saving visit failed due to validation error(s).';
      } else {
        this.error =
          'Saving visit failed due to network error. Try again later.';
      }
      console.error(e);
      return;
    }
    const targetUrl = router.urlForName('owner-details', {
      ownerId: this.pet!.ownerId!.toString(),
    });
    Router.go(targetUrl);
  }
}
