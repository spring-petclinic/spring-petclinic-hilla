import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { View } from '../views/view';
import Vet
  from "Frontend/generated/org/springframework/samples/petclinic/vet/Vet";
import {VetEndpoint} from "Frontend/generated/endpoints";

@customElement('vets-view')
export class VetsView extends View {
  @state()
  vets: Array<Vet> = [];

  async firstUpdated(changedProperties: any) {
    super.firstUpdated(changedProperties);

    // Retrieve data from the server-side endpoint.
    this.vets = (await VetEndpoint.list() as Array<Vet>);
  }

  render() {
    return html`
      <h2>Veterinarians</h2>
      
      <table id="vets" class="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Specialties</th>
          </tr>
        </thead>
        <tbody>
          ${this.vets.map(
            (vet) => html`
              <tr>
                <td>${vet.firstName} ${vet.lastName}</td>
                <td>
                  ${(vet.specialties.length > 0)
                    ? vet.specialties.map(
                      (specialty) => html`
                      <span>${specialty.name} </span>
                    `)
                    : html`<span>none</span>`}
                </td>
              </tr>
            `
          )}
        </tbody>
      </table>
    `;
  }
}
