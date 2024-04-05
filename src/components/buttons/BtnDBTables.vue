<script setup>
import { ref, shallowRef, computed, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const refMenu = ref();
const refModal = shallowRef(null);

const items = computed(() => [
  {
    label: t('Unit records'),
    items: [
      {
        label: t('Unit'),
        icon: 'pi pi-desktop',
        command: () => {
          refModal.value = defineAsyncComponent(() => import('@/components/modals/Unit.vue'));
        }
      }
    ]
  },
  {
    label: t('Locations records'),
    items: [
      {
        label: t('Location'),
        icon: 'pi pi-map-marker',
        command: () => {
          refModal.value = defineAsyncComponent(() => import('@/components/modals/Location.vue'));
        }
      }
    ]
  },
  {
    label: t('Companies records'),
    items: [
      {
        label: t('Company'),
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(() => import('@/components/modals/Сompany.vue'));
        }
      },
      {
        label: t('Branch'),
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(() => import('@/components/modals/Branch.vue'));
        }
      },
      {
        label: t('Enterprise'),
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(() => import('@/components/modals/Enterprise.vue'));
        }
      },
      {
        label: t('Department'),
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(() => import('@/components/modals/Department.vue'));
        }
      }
    ]
  },
  {
    label: t('Positions records'),
    items: [
      {
        label: t('Position'),
        icon: 'pi pi-briefcase',
        command: () => {
          refModal.value = defineAsyncComponent(() => import('@/components/modals/Position.vue'));
        }
      }
    ]
  },
  {
    label: t('All System filters'),
    items: [
      {
        label: t('PC SysInspector'),
        icon: 'pi pi-filter-fill',
        command: () => {
          refModal.value = defineAsyncComponent(() => import('@/components/modals/Filter.vue'));
        }
      }
    ]
  }
]);
</script>

<template>
  <Menu ref="refMenu" :model="items" popup class="w-64">
    <template #item="{ label, item, props }">
      <a :href="item.url" v-bind="props.action" class="px-6">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>
  </Menu>

  <Button
    text
    plain
    rounded
    icon="pi pi-table"
    class="text-2xl w-12 h-12"
    v-tooltip.bottom="$t('DB Tables')"
    @click="event => refMenu.toggle(event)"
  />

  <component :is="refModal" />
</template>
