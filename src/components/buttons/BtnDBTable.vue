<script setup>
import { ref, shallowRef, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps({
  table: {
    type: [String, Boolean],
    default: false
  }
});

const refModal = shallowRef(null);

const datatables = ref({
  unit: {
    label: t('Unit'),
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Unit.vue'));
    }
  },
  location: {
    label: t('Location'),
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Location.vue'));
    }
  },
  organization: {
    label: t('Organization'),
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Organization.vue'));
    }
  },
  subdivision: {
    label: t('Subdivision'),
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Subdivision.vue'));
    }
  },
  department: {
    label: t('Department'),
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Department.vue'));
    }
  },
  position: {
    label: t('Position'),
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Position.vue'));
    }
  },
  filters: {
    label: t('System filters'),
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
    v-tooltip.bottom="$t(datatables[table].label)"
    @click="datatables[table].command"
    v-if="table && datatables[table]"
  />

  <component :is="refModal" />
</template>
