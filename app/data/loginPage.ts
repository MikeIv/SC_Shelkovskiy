/** Временные данные до контракта API. */
export const loginPage = {
  title: 'ТРЦ «Щёлковский»',
  titleLead: 'вход',
  description: 'Для доступа к кабинету арендатора необходимо указать логин и пароль',
  loginPlaceholder: 'Логин',
  passwordPlaceholder: 'Пароль',
  forgotLabel: 'Забыли пароль?',
  submitLabel: 'Войти',
  fieldErrors: {
    login: 'Такой логин не найден',
    password: 'Пароль неверный',
  },
  watermarkSrc: '/images/login/watermark.svg',
} as const

export const loginRecoverTitle = {
  title: 'Восстановление',
  titleLead: 'пароля',
} as const

export const loginForgot = {
  ...loginRecoverTitle,
  description: 'Введите почту, к которой привязан аккаунт',
  emailPlaceholder: 'Почта',
  submitLabel: 'Восстановить',
  cancelLabel: 'Отмена',
} as const

export const loginSent = {
  description: 'Новый пароль отправлен на почту',
  resendLabel: 'Отправить ещё раз',
  submitLabel: 'Войти в личный кабинет',
} as const
