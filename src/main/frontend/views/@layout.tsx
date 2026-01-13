import { Button } from '@vaadin/react-components/Button';
import { createMenuItems, useViewConfig } from '@vaadin/hilla-file-router/runtime.js';
import {
    AppLayout,
    Icon,
    Tabs,
    Tab,
    VerticalLayout
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
        <VerticalLayout role="alert" className="w-full items-center justify-between my-l">
            <h1>Something went wrong</h1>
            <p style={{ color: "red" }}>{error.message}</p>
            <Button theme="primary" onClick={(e) => {
             resetErrorBoundary();
            }}>Retry</Button>
        </VerticalLayout>
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
          <header>
              <HorizontalLayout slot="navbar" theme="dark padding" id="header" className="w-full items-center justify-between">
                  <a href="/" className="navbar-brand"><span>{translate(key`home`)}</span></a>

                  <Tabs className="side-nav-top" ref={tabsRef}>
                      {menuItems.map(({to, title, icon}) => (
                          <Tab key={to}>
                              <NavLink to={to} key={to}>
                                {icon ?
                                    <Icon icon={icon} slot="prefix"></Icon> : <></>}
                                {i18n.translateDynamic(title)}
                              </NavLink>
                          </Tab>
                      ))}
                  </Tabs>
              </HorizontalLayout>
          </header>
          <main>
              <ErrorBoundary FallbackComponent={Fallback} key={location.pathname}>
                  <Suspense>
                      <div style={{display: 'contents'}}><Outlet/></div>
                  </Suspense>
              </ErrorBoundary>
          </main>
          <footer className="footer">
              <img src="./images/vaadin.png" alt="Vaadin"/>
              <img src="./images/spring-logo.svg" alt="Spring"/>
          </footer>
      </AppLayout>
  );
}
