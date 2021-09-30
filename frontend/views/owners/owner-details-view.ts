import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { View } from '../../views/view';
import { router } from 'Frontend/index';
import { OwnerEndpoint } from 'Frontend/generated/endpoints';
import Owner
  from 'Frontend/generated/org/springframework/samples/petclinic/owner/Owner';

@customElement('owner-details-view')
export class OwnerDetailsView extends View {
  @state()
  private owner?: Owner;

  connectedCallback() {
    super.connectedCallback();
    const id = parseInt(router.location.params.ownerId as string);
    this.fetchOwner(id);
  }

  async fetchOwner(id: number) {
    this.owner = await OwnerEndpoint.findById(id);
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
    return html`
      <h2>Owner Information</h2>
      
      <table class="table table-striped">
        <tr>
          <th>Name</th>
          <td><b>${owner?.firstName} ${owner?.lastName}</b></td>
        </tr>
        <tr>
          <th>Address</th>
          <td>${owner?.address}</td>
        </tr>
        <tr>
          <th>City</th>
          <td>${owner?.city}</td>
        </tr>
        <tr>
          <th>Telephone</th>
          <td>${owner?.telephone}</td>
        </tr>
      </table>
    
      <a href="${this.getEditOwnerHref(owner?.id)}" class="btn btn-default">Edit
        Owner</a>
      <a href="${this.getAddNewPetHref(owner?.id)}" class="btn btn-default">Add
        New Pet</a>
    
      <br />
      <br />
      <br />
      <h2>Pets and Visits</h2>
    
      <table class="table table-striped">
        ${owner?.pets.map((pet) => html`
        <tr>
          <td valign="top">
            <dl class="dl-horizontal">
              <dt>Name</dt>
              <dd>${pet.name}</dd>
              
              <dt>Birth Date</dt>
              <dd>${pet.birthDate}</dd>
              
              <dt>Type</dt>
              <dd>${pet.type?.name}</dd>
            </dl>
          </td>
          <td valign="top">
            <table class="table-condensed">
              <thead>
                <tr>
                  <th>Visit Date</th>
                  <th>Description</th>
                </tr>
              </thead>
              ${pet.visits.map((visit) => html`
              <tr>
                <td>${visit.date}</td>
                <td>${visit.description}</td>
              </tr>
              `)}
              <tr>
                <td><a href="${this.getEditPetHref(owner.id, pet.id)}">Edit Pet</a></td>
                <td><a href="${this.getAddVisitHref(owner.id, pet.id)}">Add Visit</a></td>
              </tr>
            </table>
          </td>
        </tr>
        `)}
    
      </table>
    `;
  }
}
