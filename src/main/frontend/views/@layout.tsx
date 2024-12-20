import { Button } from '@vaadin/react-components/Button';
import { createMenuItems, useViewConfig } from '@vaadin/hilla-file-router/runtime.js';
import {
    AppLayout,
    DrawerToggle,
    Icon,
    SideNav,
    SideNavItem,
    VerticalLayout
} from '@vaadin/react-components';
import { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {HorizontalLayout} from "@vaadin/react-components/HorizontalLayout.js";
import '@vaadin/icons';
import {translate} from "@vaadin/hilla-react-i18n";

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
  const currentTitle = (useViewConfig()?.title) ? (translate(useViewConfig()?.title!)+ " - Spring PetClinic"):  defaultTitle;
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    document.title = currentTitle;
  }, [currentTitle]);

  return (
      <AppLayout>
          <header>
              <HorizontalLayout slot="navbar" theme="dark padding" id="header" className="w-full items-center justify-between">
                  <a href="/" className="navbar-brand"><span>{translate('home')}</span></a>
                  <SideNav className="side-nav-top" onNavigate={({path}) => navigate(path!)}
                           location={location}>
                      {createMenuItems().map(({to, title, icon}) => (
                          <SideNavItem path={to} key={to}>
                              {icon ?
                                  <Icon icon={icon} slot="prefix"></Icon> : <></>}
                              {translate(title!)}
                          </SideNavItem>
                      ))}
                  </SideNav>
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
