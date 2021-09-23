import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { View } from '../../views/view';
import { router } from 'Frontend/index';
import { OwnerEndpoint } from 'Frontend/generated/endpoints';
import Owner
  from 'Frontend/generated/org/springframework/samples/petclinic/owner/Owner';

@customElement('create-or-update-owner-view')
export class CreateOrUpdateOwnerView extends View {
  @state()
  private owner?: Readonly<Owner>;

  connectedCallback() {
    super.connectedCallback();
    const id = parseInt(router.location.params[0] as string);
    this.fetchOwner(id);
  }

  async fetchOwner(id: number) {
    this.owner = await OwnerEndpoint.findById(id);
  }

  render() {
    return html`
      <h2>Owner</h2>
      
      <p>${this.owner?.firstName} ${this.owner?.lastName}</p>
      <p>TODO...</p>
    `;
  }
}
