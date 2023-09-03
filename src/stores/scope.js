import { defineStore } from 'pinia';

export const useScope = defineStore('scope', () => {
  function hasScope() {
    return true;
  }

  function scopeLength() {
    return scopeGroups()
      .map((group) => group.items)
      .flat().length;
  }

  function scopeGroups() {
    return [
      {
        icon: 'pi pi-cog',
        name: 'Web client options',
        items: [
          {
            scope: 'export:records:table',
            comment: 'Export records',
            default: false
          },
          {
            scope: 'export:records:table:all',
            comment: 'Export all records',
            default: false
          },
          {
            scope: 'selected-html',
            comment: 'Enabled selected from HTML',
            default: false
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'Company database table',
        items: [
          {
            scope: 'company:create:one',
            comment: 'Create company in database',
            default: false
          },
          {
            scope: 'company:find:one',
            comment: 'Read one company from database',
            default: true
          },
          {
            scope: 'company:find:all',
            comment: 'Read all companies from database',
            default: true
          },
          {
            scope: 'company:update:one',
            comment: 'Update one company in database',
            default: false
          },
          {
            scope: 'company:remove:one',
            comment: 'Delete one company in database',
            default: false
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'Branch database table',
        items: [
          {
            scope: 'branch:create:one',
            comment: 'Create branch in database',
            default: false
          },
          {
            scope: 'branch:find:one',
            comment: 'Read one branch from database',
            default: true
          },
          {
            scope: 'branch:find:all',
            comment: 'Read all branches from database',
            default: true
          },
          {
            scope: 'branch:update:one',
            comment: 'Update one branch in database',
            default: false
          },
          {
            scope: 'branch:remove:one',
            comment: 'Delete one branch in database',
            default: false
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'Enterprise database table',
        items: [
          {
            scope: 'enterprise:create:one',
            comment: 'Create enterprise in database',
            default: false
          },
          {
            scope: 'enterprise:find:one',
            comment: 'Read one enterprise from database',
            default: true
          },
          {
            scope: 'enterprise:find:all',
            comment: 'Read all enterprises from database',
            default: true
          },
          {
            scope: 'enterprise:update:one',
            comment: 'Update one enterprise in database',
            default: false
          },
          {
            scope: 'enterprise:remove:one',
            comment: 'Delete one enterprise in database',
            default: false
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'Department database table',
        items: [
          {
            scope: 'department:create:one',
            comment: 'Create department in database',
            default: false
          },
          {
            scope: 'department:find:one',
            comment: 'Read one department from database',
            default: true
          },
          {
            scope: 'department:find:all',
            comment: 'Read all departments from database',
            default: true
          },
          {
            scope: 'department:update:one',
            comment: 'Update one department in database',
            default: false
          },
          {
            scope: 'department:remove:one',
            comment: 'Delete one department in database',
            default: false
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'Location database table',
        items: [
          {
            scope: 'location:create:one',
            comment: 'Create location in database',
            default: false
          },
          {
            scope: 'location:find:one',
            comment: 'Read one location from database',
            default: true
          },
          {
            scope: 'location:find:all',
            comment: 'Read all locations from database',
            default: true
          },
          {
            scope: 'location:update:one',
            comment: 'Update one location in database',
            default: false
          },
          {
            scope: 'location:remove:one',
            comment: 'Delete one location in database',
            default: false
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'Position database table',
        items: [
          {
            scope: 'position:create:one',
            comment: 'Create position in database',
            default: false
          },
          {
            scope: 'position:find:one',
            comment: 'Read one position from database',
            default: true
          },
          {
            scope: 'position:find:all',
            comment: 'Read all positions from database',
            default: true
          },
          {
            scope: 'position:update:one',
            comment: 'Update one position in database',
            default: false
          },
          {
            scope: 'position:remove:one',
            comment: 'Delete one position in database',
            default: false
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'Unit database table',
        items: [
          {
            scope: 'unit:create:one',
            comment: 'Create unit in database',
            default: false
          },
          {
            scope: 'unit:find:one',
            comment: 'Read one unit from database',
            default: true
          },
          {
            scope: 'unit:find:all',
            comment: 'Read all units from database',
            default: true
          },
          {
            scope: 'unit:update:one',
            comment: 'Update one unit in database',
            default: false
          },
          {
            scope: 'unit:remove:one',
            comment: 'Delete one unit in database',
            default: false
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'Calendar of events',
        items: [
          {
            scope: 'event:create:one',
            comment: 'Create event in database',
            default: false
          },
          {
            scope: 'event:find:one',
            comment: 'Read one event from database',
            default: true
          },
          {
            scope: 'event:find:all',
            comment: 'Read all events from database',
            default: true
          },
          {
            scope: 'event:update:one',
            comment: 'Update one event in database',
            default: false
          },
          {
            scope: 'event:remove:one',
            comment: 'Delete one event in database',
            default: false
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'Network information',
        items: [
          {
            scope: 'channel:create:one',
            comment: 'Create channel in database',
            default: false
          },
          {
            scope: 'channel:find:one',
            comment: 'Read one channel from database',
            default: true
          },
          {
            scope: 'channel:find:all',
            comment: 'Read all channels from database',
            default: true
          },
          {
            scope: 'channel:update:one',
            comment: 'Update one channel in database',
            default: false
          },
          {
            scope: 'channel:remove:one',
            comment: 'Delete one channel in database',
            default: false
          },
          { separator: true },
          {
            scope: 'ipaddress:create:one',
            comment: 'Create ipaddress in database',
            default: false
          },
          {
            scope: 'ipaddress:find:one',
            comment: 'Read one ipaddress from database',
            default: true
          },
          {
            scope: 'ipaddress:find:all',
            comment: 'Read all ipaddresses from database',
            default: true
          },
          {
            scope: 'ipaddress:update:one',
            comment: 'Update one ipaddress in database',
            default: false
          },
          {
            scope: 'ipaddress:remove:one',
            comment: 'Delete one ipaddress in database',
            default: false
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'Help Desk Live Log',
        items: [
          {
            scope: 'request:create:one',
            comment: 'Create request in database',
            default: false
          },
          {
            scope: 'request:find:one',
            comment: 'Read one request from database',
            default: true
          },
          {
            scope: 'request:find:all',
            comment: 'Read all requests from database',
            default: true
          },
          {
            scope: 'request:update:one',
            comment: 'Update one request in database',
            default: false
          },
          {
            scope: 'request:remove:one',
            comment: 'Delete one request in database',
            default: false
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'PC SysInspector',
        items: [
          {
            scope: 'inspector:create:one',
            comment: 'Create SysInspector in database',
            default: false
          },
          {
            scope: 'inspector:find:one',
            comment: 'Read one SysInspector from database',
            default: true
          },
          {
            scope: 'inspector:find:all',
            comment: 'Read all SysInspectors from database',
            default: true
          },
          {
            scope: 'inspector:remove:one',
            comment: 'Delete one inspector in database',
            default: false
          },
          { separator: true },
          {
            scope: 'sysfilter:create:one',
            comment: 'Create filter in database',
            default: false
          },
          {
            scope: 'sysfilter:find:one',
            comment: 'Read one filter from database',
            default: true
          },
          {
            scope: 'sysfilter:find:all',
            comment: 'Read all filters from database',
            default: true
          },
          {
            scope: 'sysfilter:update:one',
            comment: 'Update one filter in database',
            default: false
          },
          {
            scope: 'sysfilter:remove:one',
            comment: 'Delete one filter in database',
            default: false
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'Statistic',
        items: [
          {
            scope: 'statistic:network',
            comment: 'Read statistic of network',
            default: true
          },
          {
            scope: 'statistic:request',
            comment: 'Read statistic of requests',
            default: true
          },
          {
            scope: 'statistic:inspector',
            comment: 'Read statistic of SysInspector',
            default: true
          },
          {
            scope: 'statistic:dashboard',
            comment: 'Read statistic for dashboard',
            default: true
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'User accounts',
        items: [
          {
            scope: 'user:create:one',
            comment: 'Create user in database',
            default: false
          },
          { scope: 'user:find', comment: 'Read all user to list', default: true },
          {
            scope: 'user:find:one',
            comment: 'Read one user from database',
            default: true
          },
          {
            scope: 'user:find:all',
            comment: 'Read all users from database',
            default: true
          },
          {
            scope: 'user:update:one',
            comment: 'Update one user in database',
            default: false
          },
          {
            scope: 'user:remove:one',
            comment: 'Delete one user in database',
            default: false
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'HD Logger system',
        items: [
          {
            scope: 'logger:find:all',
            comment: 'Read all logs from database',
            default: false
          },
          {
            scope: 'logger:remove:all',
            comment: 'Delete all logs in database',
            default: false
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'HD Notification system',
        items: [
          {
            scope: 'notification:find:all',
            comment: 'Read all notifications from database',
            default: true
          },
          {
            scope: 'notification:create:one',
            comment: 'Create one notification in database',
            default: false
          },
          {
            scope: 'notification:remove:one',
            comment: 'Delete one notification in database',
            default: true
          }
        ]
      },
      {
        icon: 'pi pi-cog',
        name: 'HD System tools',
        items: [
          {
            scope: 'filehosting:find:all',
            comment: 'File hosting of the technical support',
            default: true
          },
          { separator: true },
          { scope: 'tool:command:oping', comment: 'Ping command', default: true },
          { separator: true },
          { scope: 'tool:link:ping', comment: 'Create Ping Link', default: true },
          { scope: 'tool:link:rdp', comment: 'Create RDP link', default: true },
          { scope: 'tool:link:vnc', comment: 'Create VNC link', default: true },
          { separator: true },
          {
            scope: 'tool:script:inspector',
            comment: 'Create SysInspector script',
            default: true
          }
        ]
      }
    ];
  }

  return { scopeLength, scopeGroups, hasScope };
});
