import { defineStore } from 'pinia';

export const useScope = defineStore('scope', () => {
  function scope() {
    return [
      {
        scope: 'event',
        comment: 'Календар подій',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'netmap',
        comment: 'Мережеві мапи',
        read: true
      },

      {
        scope: 'channel',
        comment: 'Мережеві канали',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'ipaddress',
        comment: 'IP-адреси мережі',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'mailbox',
        comment: 'Поштові скриньки',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'request',
        comment: 'Технічна підтримка',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'inspector',
        comment: 'ПК SysInspector',
        read: true
      },

      {
        scope: 'onmap',
        comment: 'ONMAP Сканер',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'report',
        comment: 'Звіти техпідтримки',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'ping',
        comment: 'ICMP Пінг-сервіс',
        create: true,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'organization',
        comment: 'Організації',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'subdivision',
        comment: 'Підрозділи',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'department',
        comment: 'Відділи',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'location',
        comment: 'Розташування',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'position',
        comment: 'Посади',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'unit',
        comment: 'Пристрої',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'filter',
        comment: 'Фільтри',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'statistic:network',
        comment: 'Статистика мережі',
        read: true
      },

      {
        scope: 'statistic:request',
        comment: 'Статистика запитів',
        read: true
      },

      {
        scope: 'statistic:inspector',
        comment: 'Статистика ПК SysInspector',
        read: true
      }
    ];
  }

  function scopeLength() {
    let count = 0;
    scope().forEach(item => {
      const keys = Object.keys(item);
      for (const key of keys) {
        if (typeof item[key] === 'boolean') {
          count++;
        }
      }
    });
    return count;
  }

  function getDefaultScope() {
    return scope();
  }

  function getSelectScope(select = false) {
    const scopes = scope();
    scopes.forEach((item, index, array) => {
      const keys = Object.keys(item);
      for (const key of keys) {
        if (typeof item[key] === 'boolean') {
          array[index][key] = select;
        }
      }
    });
    return scopes;
  }

  function getCustomScope(scopeKeyList = []) {
    const scopes = scope();
    scopes.forEach((item, index, array) => {
      const keys = Object.keys(item);
      for (const key of keys) {
        if (typeof item[key] === 'boolean') {
          if (scopeKeyList.includes(`${item.scope}:${key}`)) {
            array[index][key] = true;
          } else {
            array[index][key] = false;
          }
        }
      }
    });
    return scopes;
  }

  function getScopeKeyList(scopes = []) {
    const result = [];
    scopes.forEach((item, index, array) => {
      const keys = Object.keys(item);
      for (const key of keys) {
        if (typeof item[key] === 'boolean') {
          if (array[index][key] === true) {
            result.push(`${item.scope}:${key}`);
          }
        }
      }
    });
    return result;
  }

  return {
    scopeLength,
    getDefaultScope,
    getSelectScope,
    getCustomScope,
    getScopeKeyList
  };
});
