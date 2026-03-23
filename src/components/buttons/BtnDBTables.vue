<script setup>
import { mdiTable } from '@mdi/js';
import { computed, defineAsyncComponent, inject, ref, shallowRef } from 'vue';

const $helpdesk = inject('helpdesk');

const refMenu = ref();
const refModal = shallowRef(null);

console.log($helpdesk.scope('device:create'));

const options = computed(() => [
  ['device:create', 'device:update', 'device:delete'].some(p => $helpdesk?.scope(p)) && {
    label: 'Системні пристрої',
    items: [
      {
        label: 'Пристрій',
        icon: 'pi pi-desktop',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/DeviceModal.vue')
          );
        }
      }
    ]
  },

  ['location:create', 'location:update', 'location:delete'].some(p => $helpdesk?.scope(p)) && {
    label: 'Системні локації',
    items: [
      {
        label: 'Розташування',
        icon: 'pi pi-map-marker',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/LocationModal.vue')
          );
        }
      }
    ]
  },

  [
    'organization:create',
    'organization:update',
    'organization:delete',
    'subdivision:create',
    'subdivision:update',
    'subdivision:delete',
    'department:create',
    'department:update',
    'department:delete'
  ].some(p => $helpdesk?.scope(p)) && {
    label: 'Системні організації',
    items: [
      ['organization:create', 'organization:update', 'organization:delete'].some(p =>
        $helpdesk?.scope(p)
      ) && {
        label: 'Організація',
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/OrganizationModal.vue')
          );
        }
      },
      ['subdivision:create', 'subdivision:update', 'subdivision:delete'].some(p =>
        $helpdesk?.scope(p)
      ) && {
        label: 'Підрозділ',
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/SubdivisionModal.vue')
          );
        }
      },
      ['department:create', 'department:update', 'department:delete'].some(p =>
        $helpdesk?.scope(p)
      ) && {
        label: 'Відділ',
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/DepartmentModal.vue')
          );
        }
      }
    ]
  },
  ['position:create', 'position:update', 'position:delete'].some(p => $helpdesk?.scope(p)) && {
    label: 'Системні посади',
    items: [
      {
        label: 'Посада',
        icon: 'pi pi-briefcase',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/PositionModal.vue')
          );
        }
      }
    ]
  }
]);
</script>

<template>
  <Menu ref="refMenu" :model="options" popup>
    <template #submenulabel="{ item }">
      <span class="text-surface-500">{{ item.label }}</span>
    </template>
    <template #item="{ item, props: itemProps }">
      <a class="flex items-center" v-bind="itemProps.action">
        <span :class="item.icon" />
        <span>{{ item.label }}</span>
      </a>
    </template>
  </Menu>

  <Button
    v-tooltip.bottom="'Системні таблиці'"
    rounded
    severity="secondary"
    variant="text"
    @click="event => refMenu.toggle(event)"
  >
    <template #icon>
      <AppIcon :path="mdiTable" :size="24" />
    </template>
  </Button>

  <component :is="refModal" />
</template>
