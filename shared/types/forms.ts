/** Тема обратной связи: `POST /forms/feedback`. */
export type FeedbackTopic = 'general' | 'lease' | 'ads' | 'press'

/** Тело `POST /api/v1/forms/feedback` (JSON). */
export type FeedbackFormPayload = {
  consent: boolean
  topic: FeedbackTopic
  name: string
  phone: string
  email: string
  message: string
  /** Honeypot: пустое или отсутствует. */
  website_url?: string | null
  /** Яндекс SmartCaptcha, если включена на бэкенде. */
  captcha_token?: string | null
}

/** Успешный ответ формы обратной связи. */
export type FeedbackFormResult = {
  data: {
    id: number
  }
}

export const FEEDBACK_TOPICS: readonly FeedbackTopic[] = [
  'general',
  'lease',
  'ads',
  'press',
] as const

export function isFeedbackTopic(value: string): value is FeedbackTopic {
  return (FEEDBACK_TOPICS as readonly string[]).includes(value)
}
