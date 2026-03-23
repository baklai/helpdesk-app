<script setup>
import { mdiPlusCircleOutline } from '@mdi/js';
import { computed, defineAsyncComponent, inject, shallowRef } from 'vue';

const props = defineProps({
  table: {
    type: [String, Boolean],
    default: false
  }
});

const $helpdesk = inject('helpdesk');

const refModal = shallowRef(null);

const datatables = {
  device: {
    label: 'Пристрій',
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/DeviceModal.vue'));
    }
  },
  location: {
    label: 'Розташування',
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/LocationModal.vue'));
    }
  },
  organization: {
    label: 'Організація',
    command: () => {
      refModal.value = defineAsyncComponent(
        () => import('@/components/modals/OrganizationModal.vue')
      );
    }
  },
  subdivision: {
    label: 'Підрозділ',
    command: () => {
      refModal.value = defineAsyncComponent(
        () => import('@/components/modals/SubdivisionModal.vue')
      );
    }
  },
  department: {
    label: 'Відділ',
    command: () => {
      refModal.value = defineAsyncComponent(
        () => import('@/components/modals/DepartmentModal.vue')
      );
    }
  },
  position: {
    label: 'Посада',
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/PositionModal.vue'));
    }
  }
};

const hasTableScope = computed(() =>
  props.table &&
  datatables[props.table] &&
  ['create', 'update', 'delete'].some(a => $helpdesk?.scope(`${props.table}:${a}`))
);
</script>

<template>
  <Button
    v-if="hasTableScope"
    v-tooltip.bottom="datatables[table].label"
    severity="secondary"
    @click="datatables[table].command"
  >
    <template #icon>
      <AppIcon :path="mdiPlusCircleOutline" :size="14" />
    </template>
  </Button>

  <component :is="refModal" />
</template>
