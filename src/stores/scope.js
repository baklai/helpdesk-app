import { defineStore } from 'pinia';

export const useScope = defineStore('scope', () => {
  function scope() {
    return [
      {
        scope: 'user',
        comment: 'User in database',
        create: false,
        read: false,
        update: false,
        delete: false
      },

      {
        scope: 'event',
        comment: 'Event in database',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'channel',
        comment: 'Channel in database',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'ipaddress',
        comment: 'Ipaddress in database',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'request',
        comment: 'Request in database',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'inspector',
        comment: 'SysInspector in database',
        read: true,
        delete: false
      },

      {
        scope: 'company',
        comment: 'Company in database',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'branch',
        comment: 'Branch in database',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'enterprise',
        comment: 'Enterprise in database',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'department',
        comment: 'Department in database',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'location',
        comment: 'Location in database',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'position',
        comment: 'Position in database',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'unit',
        comment: 'Unit in database',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'notice',
        comment: 'Notice in database',
        create: false
      },

      {
        scope: 'statistic:network',
        comment: 'Read statistic of network',
        read: true
      },
      {
        scope: 'statistic:request',
        comment: 'Read statistic of requests',
        read: true
      },
      {
        scope: 'statistic:inspector',
        comment: 'Read statistic of SysInspector',
        read: true
      },
      {
        scope: 'statistic:dashboard',
        comment: 'Read statistic for dashboard',
        read: true
      },

      {
        scope: 'sysfilter',
        comment: 'Filter in database',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'logger',
        comment: 'Logs from database',
        read: false,
        delete: false
      }
    ];
  }

  function scopeLength() {
    let count = 0;
    scope().forEach((item, index, array) => {
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

  return { scopeLength, getDefaultScope, getSelectScope, getCustomScope, getScopeKeyList };
});
