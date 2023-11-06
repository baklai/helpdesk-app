import { defineStore } from 'pinia';

export const useScope = defineStore('scope', () => {
  function scope() {
    return [
      {
        scope: 'user',
        comment: 'User accounts',
        create: false,
        read: false,
        update: false,
        delete: false
      },

      {
        scope: 'event',
        comment: 'Support events',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'netmap',
        comment: 'Network maps',
        read: true
      },

      {
        scope: 'channel',
        comment: 'Network channels',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'ipaddress',
        comment: 'Network IP Addresses',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'mailbox',
        comment: 'Network mailboxes',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'request',
        comment: 'Support requests',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'inspector',
        comment: 'PC SysInspector reports',
        read: true,
        delete: false
      },

      {
        scope: 'onmap',
        comment: 'Online nmap scanner',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'report',
        comment: 'Reports of service',
        read: false
      },

      {
        scope: 'company',
        comment: 'Company collections',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'branch',
        comment: 'Branch collections',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'enterprise',
        comment: 'Enterprise collections',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'department',
        comment: 'Department collections',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'location',
        comment: 'Location collections',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'position',
        comment: 'Position collections',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'unit',
        comment: 'Unit collections',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'filter',
        comment: 'Filter collections',
        create: false,
        read: true,
        update: false,
        delete: false
      },

      {
        scope: 'statistic:network',
        comment: 'Statistic of network',
        read: true
      },

      {
        scope: 'statistic:request',
        comment: 'Statistic of requests',
        read: true
      },

      {
        scope: 'statistic:inspector',
        comment: 'Statistic of PC SysInspector',
        read: true
      },

      {
        scope: 'statistic:onmap',
        comment: 'Statistic of ONMAP Scanner',
        read: true
      },

      {
        scope: 'statistic:dashboard',
        comment: 'Statistic for dashboard',
        read: true
      },

      {
        scope: 'notice',
        comment: 'System notices',
        create: false
      },

      {
        scope: 'logger',
        comment: 'System logs',
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

  return {
    scopeLength,
    getDefaultScope,
    getSelectScope,
    getCustomScope,
    getScopeKeyList
  };
});
