<script setup>
import { ref, shallowRef, computed, defineAsyncComponent } from 'vue';

const refMenu = ref();
const refModal = shallowRef(null);

const items = computed(() => [
  {
    label: 'Записи про пристрої',
    items: [
      {
        label: 'Пристрій',
        icon: 'pi pi-desktop',
        command: () => {
          refModal.value = defineAsyncComponent(() => import('@/components/modals/Unit.vue'));
        }
      }
    ]
  },
  {
    label: 'Записи розташувань',
    items: [
      {
        label: 'Розташування',
        icon: 'pi pi-map-marker',
        command: () => {
          refModal.value = defineAsyncComponent(() => import('@/components/modals/Location.vue'));
        }
      }
    ]
  },
  {
    label: 'Записи організацій',
    items: [
      {
        label: 'Організація',
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/Organization.vue')
          );
        }
      },
      {
        label: 'Підрозділ',
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(
            () => import('@/components/modals/Subdivision.vue')
          );
        }
      },
      {
        label: 'Відділ',
        icon: 'pi pi-building',
        command: () => {
          refModal.value = defineAsyncComponent(() => import('@/components/modals/Department.vue'));
        }
      }
    ]
  },
  {
    label: 'Записи посад',
    items: [
      {
        label: 'Посада',
        icon: 'pi pi-briefcase',
        command: () => {
          refModal.value = defineAsyncComponent(() => import('@/components/modals/Position.vue'));
        }
      }
    ]
  },
  {
    label: 'Усі системні фільтри',
    items: [
      {
        label: 'ПК SysInspector',
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
    v-tooltip.bottom="'DB Таблиці'"
    @click="event => refMenu.toggle(event)"
  />

  <component :is="refModal" />
</template>
