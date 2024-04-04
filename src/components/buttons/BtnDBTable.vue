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
  company: {
    label: t('Company'),
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Сompany.vue'));
    }
  },
  branch: {
    label: t('Branch'),
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Branch.vue'));
    }
  },
  enterprise: {
    label: t('Enterprise'),
    command: () => {
      refModal.value = defineAsyncComponent(() => import('@/components/modals/Enterprise.vue'));
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
    size="small"
    severity="secondary"
    icon="pi pi-plus text-base font-semibold"
    v-tooltip.bottom="$t(datatables[table].label)"
    @click="datatables[table].command"
    v-if="table && datatables[table]"
  />

  <component :is="refModal" />
</template>
