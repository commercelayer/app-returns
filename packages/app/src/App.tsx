import { ErrorNotFound } from '#pages/ErrorNotFound'
import { Filters } from '#pages/Filters'
import { Home } from '#pages/Home'
import { RestockReturn } from '#pages/RestockReturn'
import { ReturnDetails } from '#pages/ReturnDetails'
import { ReturnsList } from '#pages/ReturnsList'
import {
  CoreSdkProvider,
  ErrorBoundary,
  GTMProvider,
  MetaTags,
  PageSkeleton,
  TokenProvider
} from '@commercelayer/app-elements'
import { SWRConfig } from 'swr'
import { Route, Router, Switch } from 'wouter'
import { appRoutes } from './data/routes'

const isDev = Boolean(import.meta.env.DEV)

export function App(): JSX.Element {
  const basePath =
    import.meta.env.PUBLIC_PROJECT_PATH != null
      ? `/${import.meta.env.PUBLIC_PROJECT_PATH}`
      : undefined

  return (
    <ErrorBoundary hasContainer>
      <SWRConfig
        value={{
          revalidateOnFocus: false
        }}
      >
        <TokenProvider
          appSlug='returns'
          kind='returns'
          domain={window.clAppConfig.domain}
          reauthenticateOnInvalidAuth={!isDev}
          loadingElement={<PageSkeleton />}
          devMode={isDev}
          organizationSlug={import.meta.env.PUBLIC_SELF_HOSTED_SLUG}
        >
          <GTMProvider gtmId={window.clAppConfig.gtmId}>
            <MetaTags />
            <CoreSdkProvider>
              <Router base={basePath}>
                <Switch>
                  <Route path={appRoutes.home.path}>
                    <Home />
                  </Route>
                  <Route path={appRoutes.list.path}>
                    <ReturnsList />
                  </Route>
                  <Route path={appRoutes.filters.path}>
                    <Filters />
                  </Route>
                  <Route path={appRoutes.details.path}>
                    <ReturnDetails />
                  </Route>
                  <Route path={appRoutes.restock.path}>
                    <RestockReturn />
                  </Route>
                  <Route>
                    <ErrorNotFound />
                  </Route>
                </Switch>
              </Router>
            </CoreSdkProvider>
          </GTMProvider>
        </TokenProvider>
      </SWRConfig>
    </ErrorBoundary>
  )
}
