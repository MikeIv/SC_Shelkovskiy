import type { FeedbackFormPayload, FeedbackFormResult } from '#shared/types/forms'
import { useApiPost } from '~/composables/useApi'

const FEEDBACK_PATH = '/api/forms/feedback'

/** Отправка обратной связи: прокси Nitro или прямой Laravel. */
export function useSubmitFeedback() {
  async function submit(payload: FeedbackFormPayload): Promise<FeedbackFormResult> {
    return useApiPost<FeedbackFormResult>(FEEDBACK_PATH, payload)
  }

  return { submit }
}
