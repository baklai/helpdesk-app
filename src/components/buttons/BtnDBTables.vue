<script setup>
import { mdiTable } from '@mdi/js';
import { computed, defineAsyncComponent, inject, ref, shallowRef } from 'vue';

const $helpdesk = inject('helpdesk');

const refMenu = ref();
const refModal = shallowRef(null);

const PERMS = {
  device: ['device:create', 'device:update', 'device:delete'],
  location: ['location:create', 'location:update', 'location:delete'],
  organization: ['organization:create', 'organization:update', 'organization:delete'],
  subdivision: ['subdivision:create', 'subdivision:update', 'subdivision:delete'],
  department: ['department:create', 'department:update', 'department:delete'],
  position: ['position:create', 'position:update', 'position:delete']
};

const hasScope = perms => perms.some(p => $helpdesk?.scope(p));

const allPerms = Object.values(PERMS).flat();
const isDisabled = computed(() => !hasScope(allPerms));

const options = computed(() => [
  hasScope(PERMS.device) && {
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

  hasScope(PERMS.location) && {
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

  [...PERMS.organization, ...PERMS.subdivision, ...PERMS.department].some(p =>
    $helpdesk?.scope(p)
  ) && {
    label: 'Системні організації',
    items: [
      hasScope(PERMS.organization) && {
        label: 'Організація',
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/OrganizationModal.vue')
          );
        }
      },
      hasScope(PERMS.subdivision) && {
        label: 'Підрозділ',
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/SubdivisionModal.vue')
          );
        }
      },
      hasScope(PERMS.department) && {
        label: 'Відділ',
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/DepartmentModal.vue')
          );
        }
      }
    ].filter(Boolean)
  },

  hasScope(PERMS.position) && {
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
  <Menu ref="refMenu" :model="options" popup v-if="!isDisabled">
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
    v-if="!isDisabled"
    @click="event => refMenu.toggle(event)"
  >
    <template #icon>
      <AppIcon :path="mdiTable" :size="24" />
    </template>
  </Button>

  <component :is="refModal" v-if="!isDisabled" />
</template>
