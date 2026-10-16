import { pageEndpoint } from '#shared/api/endpoints'
import { readApiSlug } from '../../utils/apiQuery'
import { defineApiProxy } from '../../utils/apiProxy'

export default defineApiProxy(pageEndpoint, { slug: readApiSlug })
