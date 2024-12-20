import {
    ComboBox,
    DatePicker,
    FormItem,
    FormLayout, Grid, GridColumn,
    TextField,
    VerticalLayout
} from "@vaadin/react-components";
import {translate} from "@vaadin/hilla-react-i18n";
import {useForm, useFormArrayPart} from "@vaadin/hilla-react-form";
import OwnerModel
    from "../../../generated/org/springframework/samples/petclinic/backend/owner/OwnerModel";
import {Button} from "@vaadin/react-components/Button.js";
import {OwnerService} from "../../../generated/endpoints";
import {useNavigate, useParams} from "react-router-dom";
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
                            className="w-full justify-center">
                <FormLayout
                    responsiveSteps={[{minWidth: '0', columns: 1},
                        {minWidth: '600px', columns: 1}]

                    }>
                    <h2>{translate('ownerInformation')}</h2>
                    <FormItem>
                        <label slot="label">{translate('firstName')}</label>
                        <TextField
                            readonly {...field(model.firstName)}></TextField>
                    </FormItem>
                    <FormItem>
                        <label slot="label">{translate('lastName')}</label>
                        <TextField
                            readonly {...field(model.lastName)}></TextField>
                    </FormItem>
                    <FormItem>
                        <label slot="label">{translate('address')}</label>
                        <TextField
                            readonly {...field(model.address)}></TextField>
                    </FormItem>
                    <FormItem>
                        <label slot="label">{translate('city')}</label>
                        <TextField readonly {...field(model.city)}></TextField>
                    </FormItem>
                    <FormItem>
                        <label slot="label">{translate('telephone')}</label>
                        <TextField
                            readonly {...field(model.telephone)}></TextField>
                    </FormItem>
                    <FormItem>
                        <HorizontalLayout theme="spacing">
                            <Button onClick={(e) => {
                                navigate('/owners/' + ownerId + '/edit')
                            }}>{translate('editOwner')}</Button>
                            <Button onClick={(e) => {
                                navigate('/owners/' + ownerId + '/pets/new')
                            }}>{translate('addNewPet')}</Button>
                        </HorizontalLayout>
                    </FormItem>
                    <VerticalLayout theme="spacing" className="pet-container">
                        <h2>{translate('petsAndVisits')}</h2>

                        {
                            items.map((pet) => (
                                <HorizontalLayout key={`${pet.id}`} className="pet-row" theme="spacing">
                            <FormLayout
                                responsiveSteps={[{minWidth: '0', columns: 1},
                                    {minWidth: '600px', columns: 1}]

                                }>
                                <FormItem>
                                    <label slot="label">{translate('name')}</label>
                                    <TextField
                                        readonly {...field(pet.name)}></TextField>
                                </FormItem>
                                <FormItem>
                                    <label slot="label">{translate('birthDate')}</label>
                                    <DatePicker
                                        readonly {...field(pet.birthDate)}></DatePicker>
                                </FormItem>
                                <FormItem>
                                    <label slot="label">{translate('type')}</label>
                                    <ComboBox itemLabelPath="name"
                                        readonly {...field(pet.type)}></ComboBox>
                                </FormItem>
                            </FormLayout>
                                    <VerticalLayout className="visits" theme="padding spacing">
                                        <Grid items={Array.from(pet.visits)} allRowsVisible>
                                            <GridColumn path="value.date" header={translate('visitDate')} />
                                            <GridColumn path="value.description" header={translate('description')} />
                                        </Grid>
                                        <HorizontalLayout theme="spacing">
                                            <Button onClick={(e) => {
                                                navigate('/owners/' + ownerId + '/pets/'+pet.id + '/edit')
                                            }}>{translate('editPet')}</Button>
                                            <Button onClick={(e) => {
                                                navigate('/owners/' + ownerId + '/pets/'+pet.id+'/visits/new')
                                            }}>{translate('addVisit')}</Button>
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
