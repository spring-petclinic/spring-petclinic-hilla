/******************************************************************************
 * Add the initialization for the language
 ******************************************************************************/

import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from 'Frontend/generated/routes.js';
import { i18n } from '@vaadin/hilla-react-i18n';

i18n.configure({ language: document.documentElement.lang }).then(() => {
    createRoot(document.getElementById('outlet')!).render(createElement(App));

});

function App() {
    return <RouterProvider router={router} />;
}
