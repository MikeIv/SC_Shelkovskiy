/**
 * Тело ответа внутреннего API виджета Афиши (`https://mapi.afisha.ru/api/v21`).
 *
 * Это тот же запрос, которым живёт iframe виджета: `GET /places/{placeId}/schedule?limit=N`
 * с заголовком `X-Application-key: <ключ виджета>` — ключ публичный, партнёрский не нужен,
 * белый список IP тоже (проверено запросом с машины разработчика). Документации у эндпоинта
 * нет, поэтому поля читаем как `unknown` и сверяем их в маппере.
 *
 * Поля, которые использует раздел:
 * - `creationSchedules[]` → `{ creation, sessions[] }`;
 * - `creation`: `id`, `name`, `genres` (JSON-строка с русскими подписями), `ageRestriction`
 *   (число), `isSaleAvailable`, `siteLink`, `imageUrl` / `thumbnailUrl`,
 *   `mainPhotoCrops[]` с `aspectRatio: '1:2'` — постер под рамку карточки;
 * - `sessions[]`: `time` (`2026-11-06T22:00:00`, время московское, без часового пояса),
 *   `minPrice`, `hasAvailablePlaces`.
 *
 * Размер страницы задаёт `limit`: по умолчанию площадка отдаёт только три фильма.
 */

export type AfishaPlaceScheduleResponseDto = {
  creationSchedules?: unknown[]
  place?: unknown
  pageInfo?: unknown
}
