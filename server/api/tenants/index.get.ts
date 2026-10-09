import { tenantsEndpoint } from '#shared/api/endpoints'
import { readApiQuery } from '../../utils/apiQuery'
import { defineApiProxy } from '../../utils/apiProxy'

export default defineApiProxy(tenantsEndpoint, { query: readApiQuery })
