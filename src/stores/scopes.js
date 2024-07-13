import { defineStore } from 'pinia';

export const useScope = defineStore('scope', () => {
  function scope() {
    return [
      {
        scope: 'event',
        comment: 'Calendar of events',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
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
        delete: false,
        notice: false
      },

      {
        scope: 'ipaddress',
        comment: 'Network IP Addresses',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'mailbox',
        comment: 'Mailbox addresses',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'request',
        comment: 'Technical support',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'inspector',
        comment: 'PC SysInspector',
        read: true
      },

      {
        scope: 'report',
        comment: 'HD Reports of Service',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'ping',
        comment: 'ICMP Ping Service',
        create: true,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'organization',
        comment: 'Organizations',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'subdivision',
        comment: 'Subdivisions',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'department',
        comment: 'Departments',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'location',
        comment: 'Locations',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'position',
        comment: 'Positions',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'unit',
        comment: 'Units',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'filter',
        comment: 'Filters',
        create: false,
        read: true,
        update: false,
        delete: false,
        notice: false
      },

      {
        scope: 'statistic:network',
        comment: 'Statistic of Network',
        read: true
      },

      {
        scope: 'statistic:request',
        comment: 'Statistic of Requests',
        read: true
      },

      {
        scope: 'statistic:inspector',
        comment: 'Statistic of PC SysInspector',
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
