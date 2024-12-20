import {
    FormItem,
    FormLayout,
    TextField,
    VerticalLayout
} from "@vaadin/react-components";
import {translate} from "@vaadin/hilla-react-i18n";
import {useForm} from "@vaadin/hilla-react-form";
import OwnerModel
    from "../../../generated/org/springframework/samples/petclinic/backend/owner/OwnerModel";
import {Button} from "@vaadin/react-components/Button.js";
import {OwnerService} from "../../../generated/endpoints";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect} from "react";
import {ViewConfig} from "@vaadin/hilla-file-router/types.js";
import ValidationErrors, {
    handleKeyDown
} from "../../../ValidationErrors";
import {useSignal} from "@vaadin/hilla-react-signals";

export const config: ViewConfig = {
    menu: { exclude: true}
};

export default function EditOwnerView() {
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

    useEffect(() => {
        OwnerService.get(Number(ownerId)).then(read);
    }, [ownerId]);

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
                    responsiveSteps={[{ minWidth: '0', columns: 1 },
                        { minWidth: '600px', columns: 1 }]

                    }>
                    <h2>{translate('owner')}</h2>
                    <FormItem>
                        <label slot="label">{translate('firstName')}</label>
                        <TextField {...field(model.firstName)}></TextField>
                    </FormItem>
                    <FormItem>
                        <label slot="label">{translate('lastName')}</label>
                        <TextField {...field(model.lastName)}></TextField>
                    </FormItem>
                    <FormItem>
                        <label slot="label">{translate('address')}</label>
                        <TextField {...field(model.address)}></TextField>
                    </FormItem>
                    <FormItem>
                        <label slot="label">{translate('city')}</label>
                        <TextField {...field(model.city)}></TextField>
                    </FormItem>
                    <FormItem>
                        <label slot="label">{translate('telephone')}</label>
                        <TextField {...field(model.telephone)}></TextField>
                    </FormItem>
                    <FormItem>
                        <Button  onClick={submitWithErrors} className="edit-button">{translate('updateOwner')}</Button>
                    </FormItem>
                </FormLayout>
            </VerticalLayout>
        </>
    );
}
