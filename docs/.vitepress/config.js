import { defineConfig } from 'vitepress';

export default defineConfig({
  base: '/docs/',
  srcDir: './src',
  outDir: '../dist/docs',

  appearance: true,
  cleanUrls: true,
  lastUpdated: true,
  i18nRouting: true,

  lang: 'en-En',
  title: 'Documentation',
  titleTemplate: 'HD Documentation • :title',
  description: 'Documentation of technical support',

  head: [
    ['meta', { property: 'name', content: 'Dmitrii Baklai' }],
    ['meta', { property: 'keywords', content: 'helpdesk, documentation, windows, cmd, bat' }],
    ['meta', { property: 'language', content: 'en-En' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],

  markdown: {
    theme: 'vitesse-dark',
    languages: ['cmd', 'bat', 'vb', 'powershell', 'ps', 'ps1'],
    lineNumbers: false
  },

  locales: {
    root: {
      lang: 'en',
      link: '/',
      label: 'English',
      themeConfig: {
        siteTitle: 'Documentation',
        langMenuLabel: 'Change the language',
        outlineTitle: 'On this page',
        nav: [{ text: 'HELPDESK', link: '/' }],
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
        ],
        editLink: {
          pattern: 'https://github.com/baklai/helpdesk-app-v1/edit/main/docs/src/:path',
          text: 'Edit this page on GitHub'
        },
        lastUpdatedText: 'Latest update',
        lastUpdated: {
          text: 'Latest update',
          formatOptions: { dateStyle: 'short' }
        },
        docFooter: {
          prev: 'Previous page',
          next: 'Next page'
        },
        footer: {
          message:
            'License <a href="https://github.com/baklai/helpdesk-app-v1/blob/main/LICENSE">MIT</a>',
          copyright: `All rights reserved © 2022-${new Date().getFullYear()} <a href="https://github.com/baklai">Dmitrii Baklai</a>`
        },
        darkModeSwitchLabel: 'Appearance',
        sidebarMenuLabel: 'Menu',
        returnToTopLabel: 'Return to the beginning',
        notFound: {
          title: 'PAGE NOT FOUND',
          quote:
            "If you don't change your direction and keep looking, you may end up where you're headed.",
          linkLabel: 'go home',
          linkText: 'To the main page',
          code: '404'
        }
      }
    },
    ua: {
      lang: 'ua',
      link: '/ua/',
      label: 'Українська',
      themeConfig: {
        siteTitle: 'Документація',
        langMenuLabel: 'Змінити мову',
        outlineTitle: 'На цій сторінці',
        nav: [{ text: 'HELPDESK', link: '/ua/' }],
        sidebar: [
          {
            text: 'Helpdesk service',
            items: [
              { text: 'Календар подій', link: '/ua/calendar-events' },
              { text: 'Мережева інформація', link: '/ua/network-info' },
              { text: 'Журнал техпідтримки', link: '/ua/hd-live-log' },
              { text: 'ПК SysInspector', link: '/ua/pc-sys-inspector' }
            ]
          }
        ],
        editLink: {
          pattern: 'https://github.com/baklai/helpdesk-app-v1/edit/main/docs/src/:path',
          text: 'Відредагуйте цю сторінку на GitHub'
        },
        lastUpdatedText: 'Останнє оновлення',
        lastUpdated: {
          text: 'Останнє оновлення',
          formatOptions: { dateStyle: 'short' }
        },
        docFooter: {
          prev: 'Попередня сторінка',
          next: 'Наступна сторінка'
        },
        footer: {
          message:
            'Ліцензія <a href="https://github.com/baklai/helpdesk-app-v1/blob/main/LICENSE">MIT</a>',
          copyright: `Всі права захищені © 2022-${new Date().getFullYear()} <a href="https://github.com/baklai">Dmitrii Baklai</a>`
        },
        darkModeSwitchLabel: 'Зовнішній вигляд',
        sidebarMenuLabel: 'Меню',
        returnToTopLabel: 'Повернення до початку',
        notFound: {
          title: 'СТОРІНКУ НЕ ЗНАЙДЕНО',
          quote:
            'Якщо ви не зміните свій напрямок і не продовжите шукати, ви можете потрапити туди, куди прямуєте.',
          linkLabel: 'Іди додому',
          linkText: 'На головну сторінку',
          code: '404'
        }
      }
    },
    ru: {
      lang: 'ru',
      link: '/ru/',
      label: 'Русский',
      themeConfig: {
        siteTitle: 'Документация',
        langMenuLabel: 'Изменить язык',
        outlineTitle: 'На этой странице',
        nav: [{ text: 'HELPDESK', link: '/ru/' }],
        sidebar: [
          {
            text: 'Helpdesk service',
            items: [
              { text: 'Календарь событий', link: '/ru/calendar-events' },
              { text: 'Сетевая информация', link: '/ru/network-info' },
              { text: 'Журнал техподдержки', link: '/ru/hd-live-log' },
              { text: 'ПК SysInspector', link: '/ru/pc-sys-inspector' }
            ]
          }
        ],
        editLink: {
          pattern: 'https://github.com/baklai/helpdesk-app-v1/edit/main/docs/src/:path',
          text: 'Отредактируйте эту страницу на GitHub'
        },
        lastUpdatedText: 'Последнее обновление',
        lastUpdated: {
          text: 'Последнее обновление',
          formatOptions: { dateStyle: 'short' }
        },
        docFooter: {
          prev: 'Предыдущая страница',
          next: 'Следущая страница'
        },
        footer: {
          message:
            'Лицензия <a href="https://github.com/baklai/helpdesk-app-v1/blob/main/LICENSE">MIT</a>',
          copyright: `Все права защищены © 2022-${new Date().getFullYear()} <a href="https://github.com/baklai">Dmitrii Baklai</a>`
        },
        darkModeSwitchLabel: 'Внешний вид',
        sidebarMenuLabel: 'Меню',
        returnToTopLabel: 'Возврат к началу',
        notFound: {
          title: 'СТРАНИЦА НЕ НАЙДЕНА',
          quote:
            'Если вы не измените направление и продолжите поиски, вы можете оказаться там, куда направляетесь.',
          linkLabel: 'иди домой',
          linkText: 'На главную страницу',
          code: '404'
        }
      }
    }
  },

  themeConfig: {
    logo: { src: '/img/logo.svg', alt: 'HD' },
    outline: [2, 3],
    aside: true,
    search: {
      provider: 'local',
      options: {
        disableDetailedView: false,
        disableQueryPersistence: false,
        locales: {
          root: {
            translations: {
              button: {
                buttonText: 'Search',
                buttonAriaLabel: 'Show detailed list'
              },
              modal: {
                displayDetails: 'Show detailed list',
                resetButtonTitle: 'Reset search',
                backButtonTitle: 'Close search',
                noResultsText: 'No results for',

                footer: {
                  selectText: 'to choose',
                  navigateText: 'for navigation',
                  closeText: 'to close'
                }
              }
            }
          },
          ua: {
            translations: {
              button: {
                buttonText: 'Пошук',
                buttonAriaLabel: 'Показати детальний список'
              },
              modal: {
                displayDetails: 'Показати детальний список',
                resetButtonTitle: 'Скинути пошук',
                backButtonTitle: 'Закрити пошук',
                noResultsText: 'Немає результатів для',

                footer: {
                  selectText: 'вибрати',
                  navigateText: 'для навігації',
                  closeText: 'закрити'
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
                displayDetails: 'Показать подробный список',
                resetButtonTitle: 'Сбросить поиск',
                backButtonTitle: 'Закрыть поиск',
                noResultsText: 'Нет результатов для',

                footer: {
                  selectText: 'выбрать',
                  navigateText: 'для навигации',
                  closeText: 'закрыть'
                }
              }
            }
          }
        }
      }
    },
    externalLinkIcon: false,
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
  },

  srcExclude: ['**/README.md']
});
