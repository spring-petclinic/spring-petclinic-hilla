import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import { useSignal } from '@vaadin/hilla-react-signals';
import {
    Grid,
    GridColumn, GridDataProviderCallback,
    GridDataProviderParams, GridSorterDefinition,
    VerticalLayout
} from "@vaadin/react-components";
import {useMemo} from "react";
import {key, translate} from "@vaadin/hilla-react-i18n";
import {
    countByLastName,
    findByLastName
} from "../../generated/OwnerService";
import Owner
    from "../../generated/org/springframework/samples/petclinic/backend/owner/Owner";
import {HorizontalLayout} from "@vaadin/react-components/HorizontalLayout.js";
import {TextField} from "@vaadin/react-components/TextField.js";
import {Button} from "@vaadin/react-components/Button.js";
import {NavLink, useNavigate} from "react-router";

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
              <h2>{translate(key`findOwners`)}</h2>
              <HorizontalLayout  theme="spacing" className="items-baseline">
                  <TextField label={translate(key`lastName`)}
                             onValueChanged={(e) => {
                                 searchFieldValue.value = e.detail.value.trim();
                  }}></TextField>

                  <Button theme="primary" onClick={(e) => {
                      searchTerm.value = searchFieldValue.value;
}}>{translate(key`findOwner`)}</Button>
                  <Button onClick={(e) => {
                      navigate('/owners/new')
                  }}>{translate(key`addOwner`)}</Button>
              </HorizontalLayout>
              <Grid dataProvider={dataProvider}>
                  <GridColumn header={translate(key`name`)}>
                      {({ item }) => editRenderer(item)}
                  </GridColumn>
                  <GridColumn path="address" header={translate(key`address`)} />
                  <GridColumn path="city" header={translate(key`city`)} />
                  <GridColumn path="telephone" header={translate(key`telephone`)} />-
                  <GridColumn header={translate(key`pets`)} >
                      {({ item }) => petsRenderer(item)}
                  </GridColumn>
              </Grid>
          </VerticalLayout>
      </>
  );
}
