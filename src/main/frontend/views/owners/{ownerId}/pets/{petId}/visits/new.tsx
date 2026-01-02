import {
    DatePicker,
    FormItem,
    FormLayout, Grid, GridColumn,
    TextField,
    VerticalLayout
} from "@vaadin/react-components";
import {key, translate} from "@vaadin/hilla-react-i18n";
import {useForm} from "@vaadin/hilla-react-form"
import {Button} from "@vaadin/react-components/Button.js";
import {useNavigate, useParams} from "react-router";
import {ViewConfig} from "@vaadin/hilla-file-router/types.js";
import {
    OwnerService,
    PetService,
    VisitService
} from "../../../../../../generated/endpoints";
import {useSignal} from "@vaadin/hilla-react-signals";
import PetType
    from "../../../../../../generated/org/springframework/samples/petclinic/backend/owner/PetType";
import {useEffect} from "react";
import VisitCreateRecordModel
    from "../../../../../../generated/org/springframework/samples/petclinic/endpoint/record/VisitCreateRecordModel";
import ValidationErrors, {
    handleKeyDown
} from "../../../../../../ValidationErrors";


export const config: ViewConfig = {
    menu: {exclude: true}
};

export default function NewVisitView() {
    const {ownerId, petId} = useParams();
    const items = useSignal<PetType[]>([]);
    useEffect(() => {
        PetService.findPetTypes().then((data) => {
            items.value = data;
        });
        VisitService.get(Number(ownerId), Number(petId)).then(read);
    }, []);
    const navigate = useNavigate();
    const {
        value,
        read,
        model,
        submit,
        field
    } = useForm(VisitCreateRecordModel, {
        onSubmit: async (visitCreateRecord) => {
            await VisitService.saveVisit(visitCreateRecord);
            navigate('/owners/' + ownerId);
        }
    });

    const validationErrorSignal = useSignal(null as unknown);
    const submitWithErrors = async () => {
        try {
            validationErrorSignal.value = null;
            await submit();
        } catch (error) {
            validationErrorSignal.value = error;
        }
    }
    return (
        <>
            <VerticalLayout theme="padding spacing"
                            className="w-full justify-center items-stretch">
                <h2>{translate(key`newVisit`)}</h2>

                <h2>{translate(key`pet`)}</h2>
                <FormLayout
                    responsiveSteps={[{minWidth: '0', columns: 1},
                        {minWidth: '600px', columns: 4}]
                    }>
                    <TextField label={translate(key`name`)}
                               readonly {...field(model.petName)}></TextField>
                    <DatePicker label={translate(key`birthDate`)}
                                readonly {...field(model.petBirthDate)}></DatePicker>

                    <TextField label={translate(key`type`)}
                               readonly {...field(model.petType)}></TextField>
                    <TextField label={translate(key`owner`)}
                               readonly {...field(model.petOwner)}></TextField>
                </FormLayout>
                <ValidationErrors errors={validationErrorSignal.value}/>
                <FormLayout
                    onKeyDown={(e) => handleKeyDown(e, submitWithErrors)}
                    responsiveSteps={[{minWidth: '0', columns: 1},
                        {minWidth: '600px', columns: 1}]
                    }>
                    <FormItem>
                        <label slot="label">{translate(key`visitDate`)}</label>
                        <DatePicker {...field(model.visitDate)}></DatePicker>
                    </FormItem>
                    <FormItem>
                        <label slot="label">{translate(key`description`)}</label>
                        <TextField {...field(model.description)}
                                   className="w-full"></TextField>
                    </FormItem>
                    <FormItem>
                        <Button
                            onClick={submitWithErrors}>{translate(key`addVisit`)}</Button>
                    </FormItem>
                </FormLayout>
                <Grid items={value.previousVisits} allRowsVisible>
                    <GridColumn path="date" header={translate(key`visitDate`)}/>
                    <GridColumn path="description"
                                header={translate(key`description`)}/>
                </Grid>

            </VerticalLayout>
        </>
    );
}
