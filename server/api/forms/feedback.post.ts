import { feedbackMutation } from '#shared/api/mutations'
import { defineApiMutationProxy } from '../../utils/apiMutationProxy'

/** Прокси `POST /api/v1/forms/feedback` → Laravel по контракту `feedbackMutation`. */
export default defineApiMutationProxy(feedbackMutation)
