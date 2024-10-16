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
    label: t('Organizations records'),
    items: [
      {
        label: t('Organization'),
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/Organization.vue')
          );
        }
      },
      {
        label: t('Subdivision'),
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/Subdivision.vue')
          );
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
        icon: 'pi pi-filter',
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
    class="h-12 w-12 text-2xl"
    v-tooltip.bottom="$t('DB Tables')"
    @click="event => refMenu.toggle(event)"
  />

  <component :is="refModal" />
</template>
