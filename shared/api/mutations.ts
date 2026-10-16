import type { ApiWriteMethod } from '#shared/types/api'
import type { FeedbackFormPayload, FeedbackFormResult } from '#shared/types/forms'
import { isFeedbackTopic } from '#shared/types/forms'
import { ApiContractError } from './errors'
import type { ApiWriteRequest } from './request'

/**
 * Контракты мутаций: путь, метод, чтение тела и разбор ответа.
 *
 * Как и `endpoints.ts`, модуль общий для обоих транспортов: серверную ручку Nitro
 * и клиент в прямом режиме исполняет один и тот же `load`, поэтому путь к Laravel
 * не дублируется в composables. Кэша и ключа у записи нет.
 */

/** Контракт мутации: вход проверяется до обращения к API. */
export type ApiMutation<Payload, Data> = {
  /** Путь same-origin ручки Nitro (`/api/...`). */
  route: string
  /** HTTP-метод записи. */
  method: ApiWriteMethod
  /** Подпись ручки в текстах ошибок. */
  label: string
  /** Тело от вызывающего кода: на сервере это `readBody`, поэтому вход — `unknown`. */
  payload: (input: unknown) => Payload
  /** Запрос к Laravel, проверка формы ответа и маппинг. */
  load: (request: ApiWriteRequest, payload: Payload) => Promise<Data>
}

function readText(value: unknown, message: string): string {
  if (typeof value !== 'string') throw new ApiContractError(400, message)

  return value
}

/** Тело формы: мусор отбивается 400, чтобы запрос не уходил в API (правила полей — на Laravel). */
export function readFeedbackPayload(input: unknown): FeedbackFormPayload {
  if (typeof input !== 'object' || input === null) {
    throw new ApiContractError(400, 'Feedback payload is invalid')
  }

  const body = input as Record<string, unknown>
  const topic = body.topic
  const website = body.website_url
  /** Хонейпот: `null` и пустую строку считаем незаполненным — так шлёт клиент прошлой версии. */
  const honeypot = typeof website === 'string' ? website : ''

  if (typeof topic !== 'string' || !isFeedbackTopic(topic)) {
    throw new ApiContractError(400, 'Feedback topic is invalid')
  }

  if (typeof body.consent !== 'boolean') {
    throw new ApiContractError(400, 'Feedback consent is invalid')
  }

  if (website !== undefined && website !== null && typeof website !== 'string') {
    throw new ApiContractError(400, 'Feedback honeypot is invalid')
  }

  return {
    consent: body.consent,
    topic,
    name: readText(body.name, 'Feedback name is invalid'),
    phone: readText(body.phone, 'Feedback phone is invalid'),
    email: readText(body.email, 'Feedback email is invalid'),
    message: readText(body.message, 'Feedback message is invalid'),
    ...(honeypot ? { website_url: honeypot } : {}),
  }
}

/**
 * Форма «Написать нам»: `POST /api/v1/forms/feedback`.
 *
 * Ответ формой не проверяем: заявку Laravel уже принял, и падение на незнакомом теле
 * показало бы пользователю ошибку при успешной отправке. `FeedbackFormResult` описывает
 * контракт ответа для того, кому поле понадобится.
 */
export const feedbackMutation: ApiMutation<FeedbackFormPayload, FeedbackFormResult> = {
  route: '/api/forms/feedback',
  method: 'POST',
  label: 'Feedback form',
  payload: readFeedbackPayload,
  load: (request, payload) =>
    request<FeedbackFormResult>('/forms/feedback', { method: 'POST', body: payload }),
}
