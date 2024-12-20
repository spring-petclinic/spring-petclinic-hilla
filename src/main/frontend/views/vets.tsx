import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { useSignal } from '@vaadin/hilla-react-signals';
import {Grid, GridColumn, VerticalLayout} from "@vaadin/react-components";
import {useEffect} from "react";
import { findAllVets } from '../generated/VetService';
import {translate} from "@vaadin/hilla-react-i18n";
import VetRecord
    from "../generated/org/springframework/samples/petclinic/endpoint/record/VetRecord";

export const config: ViewConfig = {
  menu: { order: 2, icon: 'vaadin:list' },
  title: 'veterinarians',
};

export default function VetsView() {
  const name = useSignal('');
    const items = useSignal<VetRecord[]>([]);
    useEffect(() => {
        (findAllVets)().then((value) => {
            items.value =  value.map((vet) => ({
                ...vet
            }));
        })
    }, []);
  return (
      <>
          <VerticalLayout theme="padding spacing"
                          className="w-full justify-center">
              <h2>{translate('veterinarians')}</h2>
              <Grid items={items.value}>
                  <GridColumn path="fullName" header={translate('name')} />
                  <GridColumn path="specialties" header={translate('specialties')} />
              </Grid>
          </VerticalLayout>
      </>
  );
}
