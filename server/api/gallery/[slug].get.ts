import { galleryAlbumEndpoint } from '#shared/api/endpoints'
import { readApiSlug } from '../../utils/apiQuery'
import { defineApiProxy } from '../../utils/apiProxy'

export default defineApiProxy(galleryAlbumEndpoint, { slug: readApiSlug })
