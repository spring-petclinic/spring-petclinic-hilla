import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref';
import { Binder, field, ValidationError } from '@vaadin/form';
import { Router } from '@vaadin/router';
import { formatISO } from 'date-fns';
import '@vaadin/button';
import '@vaadin/date-picker';
import type { DatePicker } from '@vaadin/date-picker';
import '@vaadin/form-layout';
import '@vaadin/form-layout/vaadin-form-item';
import '@vaadin/text-field';
import { View } from '../../views/view';
import { router } from 'Frontend/index';
import { PetEndpoint, VisitEndpoint } from 'Frontend/generated/endpoints';
import PetDTO
  from 'Frontend/generated/org/springframework/samples/petclinic/dto/PetDTO';
import { EndpointError } from '@vaadin/fusion-frontend';
import { configureDatePicker } from 'Frontend/utils';
import VisitModel
  from 'Frontend/generated/org/springframework/samples/petclinic/visit/VisitModel';
import Visit
  from 'Frontend/generated/org/springframework/samples/petclinic/visit/Visit';

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

  private datePickerRef: Ref<DatePicker> = createRef();

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
    configureDatePicker(this.datePickerRef.value!);
    // Preselect today's date
    this.binder.value = { ...this.binder.value, date: this.today };
  }

  render() {
    const model = this.binder.model;
    return html`
      <h2>New Visit</h2>
      
      <b>Pet</b>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Birth Date</th>
            <th>Type</th>
            <th>Owner</th>
          </tr>
        </thead>
        <tr>
          <td>${this.pet?.name}</td>
          <td>${this.pet?.birthDate}</td>
          <td>${this.pet?.typeName}</td>
          <td>${this.pet?.ownerFirstName} ${this.pet?.ownerLastName}</td>
        </tr>
      </table>
    
      <form class="form-horizontal" method="post">
        <div class="form-group has-feedback">
          <vaadin-form-layout>
            <vaadin-form-item colspan="2">
              <span slot="label">Date</span>
              <vaadin-date-picker
                ${ref(this.datePickerRef)}
                ${field(model.date)}
                .max="${this.today}"
              ></vaadin-date-picker>
            </vaadin-form-item>
            <vaadin-form-item colspan="2">
              <label slot="label">Description</label>
              <vaadin-text-field
                ${field(model.description)}
                style="width: 100%;"
              ></vaadin-text-field>
            </vaadin-form-item>
            <vaadin-form-item colspan="2">
              <vaadin-button @click="${this.submit}">Add Visit</vaadin-button>
            </vaadin-form-item>
          </vaadin-form-layout>
        </div>
      </form>
    
      <br />
      <b>Previous Visits</b>
      <table class="table table-striped">
        <tr>
          <th>Date</th>
          <th>Description</th>
        </tr>
        ${this.visits?.map(
          ({ date, description }) => html`
            <tr>
              <td>${date}</td>
              <td>${description}</td>
            </tr>
          `
        )}
      </table>
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
        this.error = 'Saving visit failed due to network error. Try again later.';
      }
      console.error(e);
      return;
    }
    const targetUrl = router.urlForName('owner-details', { ownerId: this.pet!.ownerId!.toString() });
    Router.go(targetUrl);
  }
}
