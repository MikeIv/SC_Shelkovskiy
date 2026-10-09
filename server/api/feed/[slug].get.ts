import { feedItemEndpoint } from '#shared/api/endpoints'
import { readApiSlug } from '../../utils/apiQuery'
import { defineApiProxy } from '../../utils/apiProxy'

export default defineApiProxy(feedItemEndpoint, { slug: readApiSlug })
