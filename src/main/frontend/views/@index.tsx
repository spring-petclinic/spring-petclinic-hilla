import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {VerticalLayout} from "@vaadin/react-components";
import {key, translate} from "@vaadin/hilla-react-i18n";

export const config: ViewConfig = {
  menu: { order: 0, icon: 'vaadin:home' },
  title: 'home',
};

export default function HomeView() {
  return (
      <VerticalLayout theme="padding spacing"
                      className="w-full items-center justify-center home">
          <h2>{translate(key`welcome`)}</h2>
          <img src="./images/pets.png" alt="Pets" />
      </VerticalLayout>
  );
}
