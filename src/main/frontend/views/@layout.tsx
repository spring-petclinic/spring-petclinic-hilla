import { Button } from '@vaadin/react-components/Button';
import { createMenuItems, useViewConfig } from '@vaadin/hilla-file-router/runtime.js';
import {
    AppLayout,
    Icon,
    Tabs,
    Tab
} from '@vaadin/react-components';
import { Suspense, useEffect, useRef } from 'react';
import { Outlet, useLocation, NavLink } from 'react-router';
import {HorizontalLayout} from "@vaadin/react-components/HorizontalLayout.js";
import '@vaadin/icons';
import {key, translate, i18n} from "@vaadin/hilla-react-i18n";


import { ErrorBoundary } from "react-error-boundary";

const defaultTitle = document.title;

// @ts-ignore
function Fallback({ error, resetErrorBoundary }) {
    return (
        <div role="alert" className="error-fallback">
            <h1>Something went wrong</h1>
            <p style={{ color: "red" }}>{error.message}</p>
            {error.type && <p><strong>Type:</strong> {error.type}</p>}
            {error.detail && (
                <pre>
                    {typeof error.detail === 'string' ? error.detail : JSON.stringify(error.detail, null, 2)}
                </pre>
            )}
            <Button theme="primary" onClick={() => resetErrorBoundary()}>Retry</Button>
        </div>
    );
}

export default function MainLayout() {
  const currentTitle = (useViewConfig()?.title) ? (i18n.translateDynamic(useViewConfig()?.title) + " — Spring PetClinic"):  defaultTitle;
  const location = useLocation();

  const menuItems = createMenuItems();
  const tabsRef = useRef<any>(null);

  useEffect(() => {
      // On page load/reload, sync selected tab with the active NavLink
      tabsRef.current.selected = [...tabsRef.current?.querySelectorAll('vaadin-tab')]
        .findIndex((tab: Element) => tab.querySelector('a.active'));
  }, []);

  useEffect(() => {
    document.title = currentTitle;
  }, [currentTitle]);

  return (
      <AppLayout>
          <HorizontalLayout slot="navbar" theme="dark padding" id="header" className="w-full items-center justify-between">
              <a href="/" className="navbar-brand"><span>{translate(key`home`)}</span></a>
              <Tabs ref={tabsRef}>
                  {menuItems.map(({to, title, icon}) => (
                      <Tab key={to}>
                          <NavLink to={to}>
                              {icon ? <Icon icon={icon} slot="prefix"></Icon> : <></>}
                              {i18n.translateDynamic(title)}
                          </NavLink>
                      </Tab>
                  ))}
              </Tabs>
          </HorizontalLayout>
          <div className="content-wrapper">
              <main>
                  <ErrorBoundary FallbackComponent={Fallback} key={location.pathname}>
                      <Suspense>
                          <Outlet />
                      </Suspense>
                  </ErrorBoundary>
              </main>
              <footer className="footer">
                  <img src="./images/vaadin.png" alt="Vaadin" />
                  <img src="./images/spring-logo.svg" alt="Spring" />
              </footer>
          </div>
      </AppLayout>
  );
}
