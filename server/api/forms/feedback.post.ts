import type { FeedbackFormResult } from '#shared/types/forms'
import { buildApiFetchOptions } from '../../utils/apiFetch'
import { proxyFormPost } from '../../utils/proxyFormPost'

/** Прокси `POST /api/v1/forms/feedback` → Laravel. */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const options = buildApiFetchOptions(useRuntimeConfig(event))

  return proxyFormPost<FeedbackFormResult>(options, '/forms/feedback', body)
})
