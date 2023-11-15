import {
  Button,
  ListItem,
  Section,
  Text,
  navigateTo,
  useTokenProvider,
  withSkeletonTemplate
} from '@commercelayer/app-elements'
import type { Return } from '@commercelayer/sdk'

interface Props {
  returnObj: Return
}

export const ReturnInfo = withSkeletonTemplate<Props>(
  ({ returnObj }): JSX.Element => {
    const {
      canAccess,
      settings: { mode }
    } = useTokenProvider()

    const returnOrderNumber = `#${returnObj?.order?.number}`
    const navigateToOrder = canAccess('orders')
      ? navigateTo({
          destination: {
            app: 'orders',
            resourceId: returnObj?.order?.id,
            mode
          }
        })
      : {}

    const returnCustomerEmail = returnObj?.customer?.email
    const navigateToCustomer = canAccess('customers')
      ? navigateTo({
          destination: {
            app: 'customers',
            resourceId: returnObj?.customer?.id,
            mode
          }
        })
      : {}

    return (
      <Section title='Info'>
        <ListItem tag='div'>
          <Text tag='div' variant='info'>
            Order
          </Text>
          <Text tag='div' weight='semibold'>
            {canAccess('orders') ? (
              <Button variant='link' {...navigateToOrder}>
                {returnOrderNumber}
              </Button>
            ) : (
              returnOrderNumber
            )}
          </Text>
        </ListItem>
        <ListItem tag='div'>
          <Text tag='div' variant='info'>
            Customer
          </Text>
          <Text tag='div' weight='semibold'>
            {canAccess('customers') ? (
              <Button variant='link' {...navigateToCustomer}>
                {returnCustomerEmail}
              </Button>
            ) : (
              returnCustomerEmail
            )}
          </Text>
        </ListItem>
      </Section>
    )
  }
)