import {
    ComboBox,
    DatePicker,
    FormItem,
    FormLayout,
    TextField,
    VerticalLayout
} from "@vaadin/react-components";
import {translate} from "@vaadin/hilla-react-i18n";
import {useForm} from "@vaadin/hilla-react-form"
import {Button} from "@vaadin/react-components/Button.js";
import {useNavigate, useParams} from "react-router-dom";
import {ViewConfig} from "@vaadin/hilla-file-router/types.js";
import PetModel
    from "../../../../../generated/org/springframework/samples/petclinic/backend/owner/PetModel";
import {OwnerService, PetService} from "../../../../../generated/endpoints";
import {useSignal} from "@vaadin/hilla-react-signals";
import PetType
    from "../../../../../generated/org/springframework/samples/petclinic/backend/owner/PetType";
import {useEffect} from "react";
import OwnerName
    from "../../../../../generated/org/springframework/samples/petclinic/backend/owner/OwnerName";
import ValidationErrors, {
    handleKeyDown
} from "../../../../../ValidationErrors";


export const config: ViewConfig = {
    menu: {exclude: true}
};

export default function EditPetView() {
    const {ownerId, petId} = useParams();
    const items = useSignal<PetType[]>([]);
    const owner = useSignal<OwnerName | undefined>(undefined);
    useEffect(() => {
        PetService.findPetById(Number(petId)).then(read);
        PetService.findPetTypes().then((data) => {
            items.value = data;
        });
        OwnerService.findPersonById(Number(ownerId)).then(
            person => {
                owner.value = person;
            }
        );
    }, []);
    const navigate = useNavigate();
    const {read, model, submit, field} = useForm(PetModel, {
        onSubmit: async (pet) => {
            const savedPet = await PetService.update(pet);
            if (savedPet) {
                navigate('/owners/' + ownerId);
            }
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
                <ValidationErrors errors={validationErrorSignal.value}/>
                <FormLayout
                    onKeyDown={(e) => handleKeyDown(e, submitWithErrors)}
                    responsiveSteps={[{minWidth: '0', columns: 1},
                        {minWidth: '600px', columns: 1}]

                    }>
                    <h2>{translate('newPet')}</h2>
                    {(owner.value) ?
                        <FormItem>
                            <label slot="label">{translate('owner')}</label>
                            <TextField
                                value={`${owner.value.firstName} ${owner.value.lastName}`}
                                readonly></TextField>
                        </FormItem>
                        : <></>
                    }
                    <FormItem>
                        <label slot="label">{translate('name')}</label>
                        <TextField {...field(model.name)}></TextField>
                    </FormItem>
                    <FormItem>
                        <label slot="label">{translate('birthDate')}</label>
                        <DatePicker {...field(model.birthDate)}></DatePicker>
                    </FormItem>
                    <FormItem>
                        <label slot="label">{translate('type')}</label>
                        <ComboBox {...field(model.type)} itemLabelPath="name"
                                  items={items.value}></ComboBox>
                    </FormItem>
                    <FormItem>
                        <Button
                            onClick={submitWithErrors}>{translate('updatePet')}</Button>
                    </FormItem>
                </FormLayout>
            </VerticalLayout>
        </>
    );
}
