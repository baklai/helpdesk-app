import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/docs/',
  outDir: '../dist/docs',

  appearance: true,
  cleanUrls: true,
  i18nRouting: true,

  title: 'HD Documentation',
  titleTemplate: 'HD Documentation - :title',
  description: 'Documentation of technical support',

  head: [['meta', { property: 'og:title', content: 'HD Documentation' }]],

  locales: {
    root: {
      lang: 'uk',
      link: '/',
      label: 'Українська',
      themeConfig: {
        langMenuLabel: 'Змінити мову',
        outlineTitle: 'На цій сторінці',
        docFooter: {
          prev: 'Попередня сторінка',
          next: 'Наступна сторінка'
        },
        sidebar: [
          {
            text: 'Helpdesk service',
            items: [
              { text: 'Calendar of events', link: '/calendar-events' },
              { text: 'Network information', link: '/network-info' },
              { text: 'Help Desk Live Log', link: '/hd-live-log' },
              { text: 'PC SysInspector', link: '/pc-sys-inspector' }
            ]
          }
        ]
      }
    },
    ru: {
      lang: 'ru',
      link: '/ru/',
      label: 'Русский',
      themeConfig: {
        langMenuLabel: 'Изменить язык',
        outlineTitle: 'На этой странице',
        docFooter: {
          prev: 'Предыдущая страница',
          next: 'Следущая страница'
        },
        sidebar: [
          {
            text: 'Helpdesk service',
            items: [
              { text: 'Calendar of events', link: '/ru/calendar-events' },
              { text: 'Network information', link: '/ru/network-info' },
              { text: 'Help Desk Live Log', link: '/ru/hd-live-log' },
              { text: 'PC SysInspector', link: '/ru/pc-sys-inspector' }
            ]
          }
        ]
      }
    }
  },

  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Пошук',
                buttonAriaLabel: 'Показати детальний список'
              },
              modal: {
                noResultsText: 'Немає результатів для',
                resetButtonTitle: 'Скинути пошук',
                footer: {
                  selectText: 'вибрати',
                  navigateText: 'для навігації'
                }
              }
            }
          },
          ru: {
            translations: {
              button: {
                buttonText: 'Поиск',
                buttonAriaLabel: 'Показать подробный список'
              },
              modal: {
                noResultsText: 'Нет результатов для',
                resetButtonTitle: 'Сбросить поиск',
                footer: {
                  selectText: 'выбирать',
                  navigateText: 'для навигации'
                }
              }
            }
          }
        }
      }
    },
    nav: [{ text: 'HELPDESK', link: '/' }],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/baklai' },
      {
        icon: 'linkedin',
        link: 'https://www.linkedin.com/in/baklai/'
      },
      { icon: 'twitter', link: 'https://twitter.com/baklaiDi' },
      { icon: 'facebook', link: 'https://www.facebook.com/dmitrii.baklai' },
      { icon: 'instagram', link: 'https://www.instagram.com/baklai.di/' }
    ]
  }
});
