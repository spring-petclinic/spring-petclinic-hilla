import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { useSignal } from '@vaadin/hilla-react-signals';
import {VerticalLayout} from "@vaadin/react-components";
import {translate} from "@vaadin/hilla-react-i18n";

export const config: ViewConfig = {
  menu: { order: 0, icon: 'vaadin:home' },
  title: 'home',
};

export default function HomeView() {
  const name = useSignal('');

  return (
      <>
          <VerticalLayout theme="padding spacing"
                          className="w-full items-center justify-center">
              <h2>{translate('welcome')}</h2>
              <img src="./images/pets.png" alt="Pets" />
          </VerticalLayout>
      </>
  );
}
