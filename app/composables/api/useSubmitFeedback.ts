import { feedbackMutation } from '#shared/api/mutations'
import type { FeedbackFormPayload } from '#shared/types/forms'
import { useApiMutation } from '~/composables/useApi'

/**
 * Отправка обратной связи: прокси Nitro или прямой Laravel — решает режим `public.apiBase`,
 * путь и тело берутся из контракта `feedbackMutation`.
 */
export function useSubmitFeedback() {
  async function submit(payload: FeedbackFormPayload): Promise<void> {
    await useApiMutation(feedbackMutation, payload)
  }

  return { submit }
}
