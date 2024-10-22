<script setup>
import { ref, shallowRef, defineAsyncComponent } from 'vue';

const props = defineProps({
  table: {
    type: [String, Boolean],
    default: false
  }
});

const refModal = shallowRef(null);

const datatables = ref({
  unit: {
    label: 'Пристрій',
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Unit.vue'));
    }
  },
  location: {
    label: 'Розташування',
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Location.vue'));
    }
  },
  organization: {
    label: 'Організація',
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Organization.vue'));
    }
  },
  subdivision: {
    label: 'Підрозділ',
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Subdivision.vue'));
    }
  },
  department: {
    label: 'Відділ',
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Department.vue'));
    }
  },
  position: {
    label: 'Посада',
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Position.vue'));
    }
  },
  filters: {
    label: 'Системні фільтри',
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Filter.vue'));
    }
  }
});
</script>

<template>
  <Button
    outlined
    icon="pi pi-plus"
    :class="[
      'h-fill min-h-12 w-12 min-w-12',
      'text-surface-500 dark:text-surface-300',
      'border-surface-300 dark:border-surface-600',
      'hover:bg-surface-300/20 hover:dark:bg-surface-600/20'
    ]"
    v-tooltip.bottom="datatables[table].label"
    @click="datatables[table].command"
    v-if="table && datatables[table]"
  />

  <component :is="refModal" />
</template>
