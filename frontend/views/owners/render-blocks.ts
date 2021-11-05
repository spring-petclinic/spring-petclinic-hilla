import { html } from 'lit';
import { field } from '@vaadin/form';
import '@vaadin/form-layout';
import '@vaadin/text-field';
import OwnerModel from 'Frontend/generated/org/springframework/samples/petclinic/owner/OwnerModel';

export function renderOwnerForm(model: OwnerModel, readonly = false) {
  return html`
    <div class="flex flex-col items-start">
      <vaadin-text-field
        name="firstName"
        label="First Name"
        ${field(model.firstName)}
        ?readonly=${readonly}></vaadin-text-field>
      <vaadin-text-field
        name="lastName"
        label="Last Name"
        ${field(model.lastName)}
        ?readonly=${readonly}></vaadin-text-field>
      <vaadin-text-field
        name="address"
        label="Address"
        colspan="2"
        ${field(model.address)}
        ?readonly=${readonly}></vaadin-text-field>
      <vaadin-text-field
        name="city"
        label="City"
        ${field(model.city)}
        ?readonly=${readonly}></vaadin-text-field>
      <vaadin-text-field
        name="telephone"
        label="Telephone"
        ${field(model.telephone)}
        ?readonly=${readonly}></vaadin-text-field>
    </div>
  `;
}
