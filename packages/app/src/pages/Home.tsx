import { instructions } from '#data/filters'
import { presets } from '#data/lists'
import { appRoutes } from '#data/routes'
import {
  Icon,
  List,
  ListItem,
  PageLayout,
  SkeletonTemplate,
  Spacer,
  Text,
  useResourceFilters,
  useTokenProvider
} from '@commercelayer/app-elements'
import { Link, useLocation } from 'wouter'
import { useSearch } from 'wouter/use-location'
import { useListCounters } from '../metricsApi/useListCounters'

export function Home(): JSX.Element {
  const {
    dashboardUrl,
    settings: { mode }
  } = useTokenProvider()

  const [, setLocation] = useLocation()
  const search = useSearch()
  const { data: counters, isLoading: isLoadingCounters } = useListCounters()

  const { adapters, SearchWithNav } = useResourceFilters({
    instructions
  })

  return (
    <PageLayout
      title='Returns'
      mode={mode}
      gap='only-top'
      onGoBack={() => {
        window.location.href =
          dashboardUrl != null ? `${dashboardUrl}/hub` : '/'
      }}
    >
      <SearchWithNav
        hideFiltersNav
        onFilterClick={() => {}}
        onUpdate={(qs) => {
          setLocation(appRoutes.list.makePath(qs))
        }}
        queryString={search}
      />

      <SkeletonTemplate isLoading={isLoadingCounters}>
        <Spacer bottom='14'>
          <List title='Open'>
            <Link
              href={appRoutes.list.makePath(
                adapters.adaptFormValuesToUrlQuery({
                  formValues: presets.requested
                })
              )}
            >
              <ListItem
                tag='a'
                icon={
                  <Icon name='chatCircle' background='orange' gap='small' />
                }
              >
                <Text weight='semibold'>
                  {presets.requested.viewTitle}{' '}
                  {formatCounter(counters?.requested)}
                </Text>
                <Icon name='caretRight' />
              </ListItem>
            </Link>

            <Link
              href={appRoutes.list.makePath(
                adapters.adaptFormValuesToUrlQuery({
                  formValues: presets.approved
                })
              )}
            >
              <ListItem
                tag='a'
                icon={<Icon name='check' background='orange' gap='small' />}
              >
                <Text weight='semibold'>
                  {presets.approved.viewTitle}{' '}
                  {formatCounter(counters?.approved)}
                </Text>
                <Icon name='caretRight' />
              </ListItem>
            </Link>

            <Link
              href={appRoutes.list.makePath(
                adapters.adaptFormValuesToUrlQuery({
                  formValues: presets.shipped
                })
              )}
            >
              <ListItem
                tag='a'
                icon={
                  <Icon name='arrowUpRight' background='orange' gap='small' />
                }
              >
                <Text weight='semibold'>
                  {presets.shipped.viewTitle} {formatCounter(counters?.shipped)}
                </Text>
                <Icon name='caretRight' />
              </ListItem>
            </Link>
          </List>
        </Spacer>

        <Spacer bottom='14'>
          <List title='Browse'>
            <Link
              href={appRoutes.list.makePath(
                adapters.adaptFormValuesToUrlQuery({
                  formValues: presets.history
                })
              )}
            >
              <ListItem
                tag='a'
                icon={<Icon name='asterisk' background='black' gap='small' />}
              >
                <Text weight='semibold'>{presets.history.viewTitle}</Text>
                <Icon name='caretRight' />
              </ListItem>
            </Link>
            <Link
              href={appRoutes.list.makePath(
                adapters.adaptFormValuesToUrlQuery({
                  formValues: presets.archived
                })
              )}
            >
              <ListItem
                tag='a'
                icon={<Icon name='minus' background='gray' gap='small' />}
              >
                <Text weight='semibold'>{presets.archived.viewTitle}</Text>
                <Icon name='caretRight' />
              </ListItem>
            </Link>
          </List>
        </Spacer>
      </SkeletonTemplate>
    </PageLayout>
  )
}

function formatCounter(counter = 0): string {
  return `(${Intl.NumberFormat().format(counter)})`
}
