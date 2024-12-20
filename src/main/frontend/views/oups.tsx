import { ViewConfig } from '@vaadin/hilla-file-router/types.js';
import {VerticalLayout} from "@vaadin/react-components";
import {translate} from "@vaadin/hilla-react-i18n";
import {useEffect} from "react";
import {ping} from "../generated/ErrorService";
import { useErrorBoundary } from "react-error-boundary";

export const config: ViewConfig = {
    menu: { order: 4, icon: 'vaadin:warning' },
    title: 'error',
};

export default function ErrorView() {
    const { showBoundary } = useErrorBoundary();
    useEffect(() => {
        ping().then(
            response => {
                // Set data in state and re-render
            },
            error => {
                // Show error boundary
                showBoundary(error);
            }
        );
    }, []);
    return (
        <>
            <VerticalLayout theme="padding spacing"
                            className="w-full items-center justify-center">
                <h2>{translate('error')}</h2>
            </VerticalLayout>
        </>
    );
}
