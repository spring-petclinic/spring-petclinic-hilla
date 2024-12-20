import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { useSignal } from '@vaadin/hilla-react-signals';
import {
    Grid,
    GridColumn, GridDataProviderCallback,
    GridDataProviderParams, GridSorterDefinition,
    VerticalLayout
} from "@vaadin/react-components";
import {useMemo} from "react";
import {translate} from "@vaadin/hilla-react-i18n";
import {
    countByLastName,
    findByLastName
} from "../../generated/OwnerService";
import Owner
    from "../../generated/org/springframework/samples/petclinic/backend/owner/Owner";
import {HorizontalLayout} from "@vaadin/react-components/HorizontalLayout.js";
import {TextField} from "@vaadin/react-components/TextField.js";
import {Button} from "@vaadin/react-components/Button.js";
import {NavLink, useNavigate} from "react-router-dom";

export const config: ViewConfig = {
  menu: { order: 1, icon: 'vaadin:search' },
  title: 'findOwners',
};

type OwnerEnhanced = Owner & { fullName: string };

async function fetchOwners(params: {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortOrders: GridSorterDefinition[];
}) {
    const { page, pageSize, searchTerm, sortOrders } = params;
    // Pagination
    const result = await findByLastName(searchTerm, {    pageNumber: page,
        pageSize: pageSize, sort: { orders: []}/*,
        sort: sortOrders*/});
    const count = await countByLastName(searchTerm);
    return { people: result.map((person) => ({
            ...person,
            fullName: `${person.firstName} ${person.lastName}`,
        })), count };
}


const editRenderer = (person: OwnerEnhanced) => (
    <NavLink to={"/owners/" + person.id}>{person.firstName} {person.lastName}</NavLink>
);

const petsRenderer = (owner: OwnerEnhanced) => (
    <span>
    {owner.pets.map(pet => pet.name).join(", ")}
  </span>
);

export default function FindOwnersView() {
    const searchTerm = useSignal('');
    const searchFieldValue = useSignal('');
    const navigate = useNavigate();


    const dataProvider = useMemo(
        () =>
            async (
                params: GridDataProviderParams<Owner>,
                callback: GridDataProviderCallback<Owner>
            ) => {
                const { page, pageSize, sortOrders } = params;

                const { people, count } = await fetchOwners({
                    page,
                    pageSize,
                    sortOrders,
                    searchTerm: searchTerm.value,
                });

                callback(people, count);
            },
        [searchTerm.value]
    );
  return (
      <>
          <VerticalLayout theme="padding spacing"
                          className="w-full justify-center">
              <h2>{translate('findOwners')}</h2>
              <HorizontalLayout  theme="spacing" className="items-baseline">
                  <TextField label={translate('lastName')}
                             onValueChanged={(e) => {
                                 searchFieldValue.value = e.detail.value.trim();
                  }}></TextField>

                  <Button theme="primary" onClick={(e) => {
                      searchTerm.value = searchFieldValue.value;
}}>{translate('findOwner')}</Button>
                  <Button onClick={(e) => {
                      navigate('/owners/new')
                  }}>{translate('addOwner')}</Button>
              </HorizontalLayout>
              <Grid dataProvider={dataProvider}>
                  <GridColumn header={translate('name')}>
                      {({ item }) => editRenderer(item)}
                  </GridColumn>
                  <GridColumn path="address" header={translate('address')} />
                  <GridColumn path="city" header={translate('city')} />
                  <GridColumn path="telephone" header={translate('telephone')} />-
                  <GridColumn header={translate('pets')} >
                      {({ item }) => petsRenderer(item)}
                  </GridColumn>
              </Grid>
          </VerticalLayout>
      </>
  );
}
