import { defineComponent, h, ref } from 'vue'
import { readFormError } from '#shared/api/formErrors'
import { feedbackMutation } from '#shared/api/mutations'
import type { FeedbackFormPayload } from '#shared/types/forms'

/** Тело формы для пробников отправки. */
export const feedbackPayload: FeedbackFormPayload = {
  consent: true,
  topic: 'general',
  name: 'Иван Иванов',
  phone: '+7 (499) 677-88-77',
  email: 'ivan@example.com',
  message: 'Здравствуйте',
}

/**
 * Пробник `useApiMutation`: отправляет форму по клику — как модалка контактов,
 * то есть вызов идёт вне setup, после монтирования.
 */
export const FormProbe = defineComponent({
  setup() {
    const state = ref('idle')

    async function send(): Promise<void> {
      try {
        await useApiMutation(feedbackMutation, feedbackPayload)
        state.value = 'ok'
      } catch (error: unknown) {
        state.value = readFormError(error)?.message ?? 'unknown'
      }
    }

    return () =>
      h('div', {
        'data-state': state.value,
        onClick: () => {
          void send()
        },
      })
  },
})
