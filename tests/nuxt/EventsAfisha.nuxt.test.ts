import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { EventAfishaItem } from '#shared/types/events'
import { API_IMAGE_HOST } from '#shared/utils/apiImageHost'
import EventsAfisha from '~/components/events/Afisha.vue'

const item: EventAfishaItem = {
  id: 'concert',
  imageSrc: `https://${API_IMAGE_HOST}/storage/events/concert.jpg`,
  imageAlt: 'Концерт в атриуме',
  dateStart: { day: '29', month: 'сентября' },
  title: 'Концерт в атриуме',
  description: 'Описание мероприятия',
  tagLabel: 'Афиша',
}

describe('EventsAfisha', () => {
  it('картинку API отдаёт через ipx', async () => {
    const wrapper = await mountSuspended(EventsAfisha, { props: { item } })

    const image = wrapper.find('img')

    expect(image.exists()).toBe(true)
    expect(image.attributes('src')).toContain('/_ipx/')
    expect(image.attributes('alt')).toBe('Концерт в атриуме')
  })
})
