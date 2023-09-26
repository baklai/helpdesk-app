<script setup>
import { ref, shallowRef, defineAsyncComponent } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const refMenu = ref();
const refModal = shallowRef(null);

const items = ref([
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
  }
]);
</script>

<template>
  <Menu ref="refMenu" :model="items" :popup="true" class="w-14rem p-2" />

  <Button
    text
    plain
    rounded
    aria-haspopup="true"
    icon="pi pi-database"
    iconClass="text-2xl"
    class="p-button-lg hover:text-color h-3rem w-3rem"
    v-tooltip.bottom="$t('DB Tables')"
    @click="event => refMenu.toggle(event)"
  />

  <component :is="refModal" />
</template>
