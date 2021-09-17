import '@vaadin/vaadin-button';
import '@vaadin/vaadin-text-field';
import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { View } from '../../views/view';

@customElement('hello-world-view')
export class HelloWorldView extends View {
    name = '';

    render() {
        return html`
      <vaadin-text-field label="Your name" @value-changed=${this.nameChanged}></vaadin-text-field>
      <vaadin-button @click=${this.sayHello}>Say hello</vaadin-button>
    `;
    }

    nameChanged(e: CustomEvent) {
        this.name = e.detail.value;
    }

    sayHello() {
        alert(`Hello ${this.name}`);
    }
}
