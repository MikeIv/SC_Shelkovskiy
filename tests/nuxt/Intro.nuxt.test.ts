import { describe, expect, it } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { HomeIntroSlide } from '#shared/types/home'
import Intro from '~/components/home/Intro.vue'

const slides: HomeIntroSlide[] = [
  {
    id: '901',
    title: 'Первый слайд',
    description: 'Описание первого слайда',
    imageSrc: '/images/home/intro-1.png',
    imageSrcMobile: '/images/home/intro-1-mobile.jpg',
    imageAlt: 'Первый слайд',
  },
  {
    id: '902',
    title: 'Второй слайд',
    imageSrc: '/images/home/intro-2.png',
    imageAlt: 'Второй слайд',
  },
]

async function mountIntro(items: HomeIntroSlide[] = slides) {
  return mountSuspended(Intro, { props: { slides: items } })
}

describe('components/home/Intro', () => {
  it('рендерит по кадру на слайд и отмечает активный', async () => {
    const wrapper = await mountIntro()
    const frames = wrapper.findAll('picture')

    expect(frames).toHaveLength(2)
    expect(frames[0]!.element.closest('[aria-hidden]')?.getAttribute('aria-hidden')).toBe('false')
    expect(frames[1]!.element.closest('[aria-hidden]')?.getAttribute('aria-hidden')).toBe('true')
  })

  it('строит srcset через ipx и не фиксирует размеры кадра', async () => {
    const wrapper = await mountIntro()
    const image = wrapper.findAll('img')[0]!

    expect(image.attributes('src')).toContain('/_ipx/')
    expect(image.attributes('src')).toContain('f_webp')
    expect(image.attributes('srcset')).toContain('/_ipx/')
    expect(image.attributes('sizes')).toContain('100vw')
    expect(image.attributes('width')).toBeUndefined()
    expect(image.attributes('height')).toBeUndefined()
  })

  it('отдаёт alt только активному слайду', async () => {
    const wrapper = await mountIntro()
    const images = wrapper.findAll('img')

    expect(images[0]!.attributes('alt')).toBe('Первый слайд')
    expect(images[1]!.attributes('alt')).toBe('')
  })

  it('портретный кадр — в img, широкий — в source для desktop', async () => {
    const wrapper = await mountIntro()
    const [portrait, wideOnly] = wrapper.findAll('picture')

    const source = portrait!.find('source')
    expect(source.attributes('media')).toBe('(min-width: 1280px)')
    expect(source.attributes('srcset')).toContain('intro-1.png')
    expect(portrait!.find('img').attributes('src')).toContain('intro-1-mobile.jpg')

    expect(wideOnly!.find('source').exists()).toBe(false)
    expect(wideOnly!.find('img').attributes('src')).toContain('intro-2.png')
  })

  it('первый слайд грузится сразу, остальные — лениво', async () => {
    const wrapper = await mountIntro()
    const images = wrapper.findAll('img')

    expect(images[0]!.attributes('loading')).toBe('eager')
    expect(images[0]!.attributes('fetchpriority')).toBe('high')
    expect(images[1]!.attributes('loading')).toBe('lazy')
  })

  it('заголовок слайда — h2, h1 остаётся странице', async () => {
    const wrapper = await mountIntro()

    expect(wrapper.find('h1').exists()).toBe(false)
    expect(wrapper.find('h2').text()).toBe('Первый слайд')
  })

  it('без слайдов секция не рендерится', async () => {
    const wrapper = await mountIntro([])

    expect(wrapper.find('section').exists()).toBe(false)
  })

  it('переключает слайд по кнопке и показывает счётчик', async () => {
    const wrapper = await mountIntro()

    expect(wrapper.find('[aria-live="polite"]').text()).toBe('1/2')

    await wrapper.find('button[data-direction="right"]').trigger('click')

    expect(wrapper.find('[aria-live="polite"]').text()).toBe('2/2')
    expect(wrapper.findAll('img')[1]!.attributes('alt')).toBe('Второй слайд')
    expect(wrapper.findAll('img')[0]!.attributes('alt')).toBe('')
  })

  it('ставит слайдер на паузу и снимает её', async () => {
    const wrapper = await mountIntro()
    const pause = wrapper.find('button[aria-pressed]')

    expect(pause.attributes('aria-pressed')).toBe('false')

    await pause.trigger('click')

    expect(wrapper.find('button[aria-pressed]').attributes('aria-pressed')).toBe('true')
    expect(wrapper.find('button[aria-pressed]').text()).toBe('Запустить слайдер')
  })

  it('единственный слайд — без навигации и прогресса', async () => {
    const wrapper = await mountIntro([slides[0]!])

    expect(wrapper.find('button[data-direction="right"]').exists()).toBe(false)
    expect(wrapper.find('[aria-live="polite"]').exists()).toBe(false)
  })
})
