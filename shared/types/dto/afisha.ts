/**
 * Тела ответов Афиши API v3 (`https://api.afisha.ru/v3`).
 *
 * Контракт — вендорский swagger (`/swagger/v3/swagger.json`). Перечисления в нём объявлены
 * целыми, но по правилам вендора приходят текстом (`"Movie"`, `"Audience18"`), поэтому
 * элементы массивов маппер читает как `unknown` и сверяет с известными значениями.
 *
 * Поля, которые мы используем:
 * - `GET /v3/cities` → `{ Id, Name }`;
 * - `GET /v3/places?CityId&CreationType&WidgetKey` → `{ Id, CityId, Type, Name }`;
 * - `GET /v3/places/{id}/schedule?WidgetKey` → `{ Creation, Sessions[] }`, где у `Creation`
 *   есть `Id`, `Name`, `Genres[]`, `AgeRestriction`, `Images[]` (`Type: 'Poster'`), `AfishaCreationUrl`,
 *   а у сеанса — `IsSaleAvailable` и `SessionDateTime`.
 */

export type AfishaCitiesResponseDto = unknown[]

export type AfishaPlacesResponseDto = unknown[]

export type AfishaPlaceScheduleResponseDto = unknown[]
