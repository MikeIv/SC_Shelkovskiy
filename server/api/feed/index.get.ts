import { feedEndpoint } from '#shared/api/endpoints'
import { readApiQuery } from '../../utils/apiQuery'
import { defineApiProxy } from '../../utils/apiProxy'

export default defineApiProxy(feedEndpoint, { query: readApiQuery })
