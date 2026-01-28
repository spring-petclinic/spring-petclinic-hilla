import {
    ComboBox,
    DatePicker,
    FormItem,
    FormLayout, Grid, GridColumn,
    TextField,
    VerticalLayout
} from "@vaadin/react-components";
import {key, translate} from "@vaadin/hilla-react-i18n";
import {useForm, useFormArrayPart} from "@vaadin/hilla-react-form";
import OwnerModel
    from "../../../generated/org/springframework/samples/petclinic/backend/owner/OwnerModel";
import {Button} from "@vaadin/react-components/Button.js";
import {OwnerService} from "../../../generated/endpoints";
import {useNavigate, useParams} from "react-router";
import {useEffect} from "react";
import {ViewConfig} from "@vaadin/hilla-file-router/types.js";
import {HorizontalLayout} from "@vaadin/react-components/HorizontalLayout.js";

export const config: ViewConfig = {
    menu: { exclude: true}
};

export default function ViewOwnerView() {
    const { ownerId } = useParams();
    const navigate = useNavigate();
    const { read, model, submit,  field } = useForm(OwnerModel, {
        onSubmit: async (owner) => {
            const savedOwner = await OwnerService.save(owner);
            if (savedOwner) {
                navigate('/owners/' + savedOwner.id);
            }
        }
    });
    const { items } = useFormArrayPart(model.pets);

    useEffect(() => {
        OwnerService.findOwner(Number(ownerId)).then(read);
    }, [ownerId])
    return (
        <>
            <VerticalLayout theme="padding spacing"
                            className="w-full">
                <FormLayout
                    responsiveSteps={[{minWidth: '0', columns: 1},
                        {minWidth: '600px', columns: 1}]

                    }>
                    <h2>{translate(key`ownerInformation`)}</h2>
                    <FormItem>
                        <label slot="label">{translate(key`firstName`)}</label>
                        <TextField
                            readonly {...field(model.firstName)}></TextField>
                    </FormItem>
                    <FormItem>
                        <label slot="label">{translate(key`lastName`)}</label>
                        <TextField
                            readonly {...field(model.lastName)}></TextField>
                    </FormItem>
                    <FormItem>
                        <label slot="label">{translate(key`address`)}</label>
                        <TextField
                            readonly {...field(model.address)}></TextField>
                    </FormItem>
                    <FormItem>
                        <label slot="label">{translate(key`city`)}</label>
                        <TextField readonly {...field(model.city)}></TextField>
                    </FormItem>
                    <FormItem>
                        <label slot="label">{translate(key`telephone`)}</label>
                        <TextField
                            readonly {...field(model.telephone)}></TextField>
                    </FormItem>
                    <FormItem>
                        <HorizontalLayout theme="spacing">
                            <Button onClick={(e) => {
                                navigate('/owners/' + ownerId + '/edit')
                            }}>{translate(key`editOwner`)}</Button>
                            <Button onClick={(e) => {
                                navigate('/owners/' + ownerId + '/pets/new')
                            }}>{translate(key`addNewPet`)}</Button>
                        </HorizontalLayout>
                    </FormItem>
                    <VerticalLayout theme="spacing">
                        <h2>{translate(key`petsAndVisits`)}</h2>

                        {
                            items.map((pet) => (
                                <HorizontalLayout key={`${pet.id}`} className="pet-row" theme="spacing">
                            <FormLayout
                                responsiveSteps={[{minWidth: '0', columns: 1},
                                    {minWidth: '600px', columns: 1}]

                                }>
                                <FormItem>
                                    <label slot="label">{translate(key`name`)}</label>
                                    <TextField
                                        readonly {...field(pet.name)}></TextField>
                                </FormItem>
                                <FormItem>
                                    <label slot="label">{translate(key`birthDate`)}</label>
                                    <DatePicker
                                        readonly {...field(pet.birthDate)}></DatePicker>
                                </FormItem>
                                <FormItem>
                                    <label slot="label">{translate(key`type`)}</label>
                                    <ComboBox itemLabelPath="name"
                                        readonly {...field(pet.type)}></ComboBox>
                                </FormItem>
                            </FormLayout>
                                    <VerticalLayout className="visits" theme="padding spacing">
                                        <Grid items={Array.from(pet.visits)} allRowsVisible>
                                            <GridColumn path="value.date" header={translate(key`visitDate`)} />
                                            <GridColumn path="value.description" header={translate(key`description`)} />
                                        </Grid>
                                        <HorizontalLayout theme="spacing">
                                            <Button onClick={(e) => {
                                                navigate('/owners/' + ownerId + '/pets/'+pet.id + '/edit')
                                            }}>{translate(key`editPet`)}</Button>
                                            <Button onClick={(e) => {
                                                navigate('/owners/' + ownerId + '/pets/'+pet.id+'/visits/new')
                                            }}>{translate(key`addVisit`)}</Button>
                                        </HorizontalLayout>
                                    </VerticalLayout>
                                </HorizontalLayout>
                            ))
                        }
                    </VerticalLayout>
                </FormLayout>
            </VerticalLayout>
        </>
    );
}
