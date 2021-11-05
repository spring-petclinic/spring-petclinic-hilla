import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { View } from '../views/view';
import { CrashEndpoint } from 'Frontend/generated/endpoints';

@customElement('error-view')
export class ErrorView extends View {
  @state()
  result?: string;

  async connectedCallback() {
    super.connectedCallback();
    this.result = await CrashEndpoint.triggerException();
  }

  render() {
    return html`
      <p>See JS console for errors.</p>
      <p>
        For more information see the Fusion
        <a
          href="https://vaadin.com/docs/latest/fusion/application/error-handling">
          Error Handling
        </a>
        documentation.
      </p>
    `;
  }
}
