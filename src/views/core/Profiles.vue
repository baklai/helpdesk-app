<script setup lang="jsx">
import { ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import HDDataTable from '@/components/tables/HDDataTable.vue';
import OptionsMenu from '@/components/menus/OptionsMenu.vue';
import ModalRecord from '@/components/modals/Profile.vue';

import { useScope } from '@/stores/scopes';
import { useProfile } from '@/stores/api/profiles';

const Profile = useProfile();
const Scope = useScope();

const refMenu = ref();
const refModal = ref();
const refSidebar = ref();
const refDataTable = ref();

const globalFilter = ref({
  field: 'fullname',
  matchMode: FilterMatchMode.CONTAINS,
  placeholder: "Шукати за ім'ям"
});

const columns = ref([
  {
    header: { text: "Повне ім'я", icon: 'pi pi-id-card', width: '14rem' },
    column: {
      field: 'fullname',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'fullname' },
    filter: {
      field: 'fullname',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: true,
    frozen: true
  },

  {
    header: { text: 'Електронна пошта', icon: 'pi pi-envelope', width: '16rem' },
    column: {
      field: 'email',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'email' },
    filter: {
      field: 'email',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: true,
    frozen: false
  },

  {
    header: { text: 'Номер телефону', icon: 'pi pi-phone', width: '16rem' },
    column: {
      field: 'phone',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'phone' },
    filter: {
      field: 'phone',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: true,
    frozen: false
  },

  {
    header: { text: 'Активація', icon: 'pi pi-check', width: '12rem' },
    column: {
      field: 'isActivated',
      render(value) {
        return value ? <i class={'pi pi-check !font-bold text-green-500'}></i> : <span>-</span>;
      }
    },
    sorter: { field: 'isActivated' },
    filter: {
      field: 'isActivated',
      value: null,
      matchMode: FilterMatchMode.EQUALS,
      showFilterMatchModes: false
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: true,
    frozen: false
  },

  {
    header: { text: 'Адміністратор', icon: 'pi pi-check-circle', width: '12rem' },
    column: {
      field: 'isAdmin',
      render(value) {
        return value ? <i class={'pi pi-star-fill font-bold text-green-500'}></i> : <span>-</span>;
      }
    },
    sorter: { field: 'isAdmin' },
    filter: {
      field: 'isAdmin',
      value: null,
      matchMode: FilterMatchMode.EQUALS,
      showFilterMatchModes: false
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: true,
    frozen: false
  },

  {
    header: { text: 'Набори дозволів', icon: 'pi pi-unlock', width: '12rem' },
    column: {
      field: 'scope',
      render(value) {
        return (
          <Tag
            class="!bg-surface-500/20 px-6 !text-base !font-normal !text-black dark:!text-white"
            value={value ? `${value?.length} / ${Scope.scopeLength()}` : '-'}
          />
        );
      }
    },
    sorter: { field: 'scope' },
    filter: {
      field: 'scope',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    exportable: false,
    filtrable: false,
    sortable: false,
    frozen: false
  }
]);
</script>

<template>
  <div class="flex h-full w-full">
    <OptionsMenu
      ref="refMenu"
      @view="data => refModal.toggle(data)"
      @create="data => refModal.toggle(data)"
      @update="data => refModal.toggle(data)"
      @delete="data => refDataTable.delete(data)"
    />

    <ModalRecord ref="refModal" @close="() => refDataTable.update({})" />

    <HDDataTable
      ref="refDataTable"
      :columns="columns"
      :globalFilter="globalFilter"
      :storageKey="`app-datatable-${$route.name}`"
      :exportFileName="$route.name"
      :onUpdate="Profile.findAll"
      :onDelete="Profile.removeOne"
      @toggle-menu="(event, data) => refMenu.toggle(event, data)"
      @toggle-modal="data => refModal.toggle(data)"
      @toggle-sidebar="data => refSidebar.toggle(data)"
    >
      <template #icon>
        <i class="mr-2 hidden sm:block">
          <AppIcons :name="$route?.name" :size="42" />
        </i>
      </template>

      <template #title>
        {{ $route?.meta?.title }}
      </template>

      <template #subtitle>
        {{ $route?.meta?.description }}
      </template>
    </HDDataTable>
  </div>
</template>
