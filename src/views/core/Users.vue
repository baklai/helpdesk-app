<script setup lang="jsx">
import { ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useScope } from '@/stores/scope';
import { useUser } from '@/stores/api/users';
import SSDataTable from '@/components/tables/SSDataTable.vue';
import OptionsMenu from '@/components/menus/OptionsMenu.vue';
import ModalRecord from '@/components/modals/User.vue';

const User = useUser();
const Scope = useScope();

const refMenu = ref();
const refModal = ref();
const refSidebar = ref();
const refDataTable = ref();

const globalFilter = ref({
  field: 'fullname',
  matchMode: FilterMatchMode.CONTAINS,
  placeholder: 'Search fullname'
});

const columns = ref([
  {
    header: { text: 'Fullname', icon: 'pi pi-id-card', width: '15rem' },
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
    header: { text: 'Login', icon: 'pi pi-user', width: '12rem' },
    column: {
      field: 'login',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'login' },
    filter: {
      field: 'login',
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
    header: { text: 'E-mail', icon: 'pi pi-envelope', width: '16rem' },
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
    header: { text: 'Phone', icon: 'pi pi-phone', width: '16rem' },
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
    header: { text: 'Timeout', icon: 'pi pi-stopwatch', width: '12rem' },
    column: {
      field: 'timeout',
      render(value) {
        return <span>{value}m.</span>;
      }
    },
    sorter: { field: 'timeout' },
    filter: {
      field: 'timeout',
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
    header: { text: 'Active', icon: 'pi pi-check', width: '12rem' },
    column: {
      field: 'isActive',
      render(value) {
        return value ? <i class={'pi pi-check font-bold text-green-500'}></i> : <span>-</span>;
      }
    },
    sorter: { field: 'isActive' },
    filter: {
      field: 'isActive',
      value: null,
      matchMode: FilterMatchMode.EQUALS,
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
    header: { text: 'Admin', icon: 'pi pi-check-circle', width: '12rem' },
    column: {
      field: 'isAdmin',
      render(value) {
        return value ? <i class={'pi pi-check-circle font-bold text-green-500'}></i> : <span>-</span>;
      }
    },
    sorter: { field: 'isAdmin' },
    filter: {
      field: 'isAdmin',
      value: null,
      matchMode: FilterMatchMode.EQUALS,
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
    header: { text: 'Scope', icon: 'pi pi-exclamation-triangle', width: '12rem' },
    column: {
      field: 'scope',
      render(value) {
        return (
          <Tag
            class="text-base font-normal text-color surface-hover w-7rem px-2"
            value={value ? `${value} / ${Scope.scopeLength()}` : '-'}
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
  <div class="col-12">
    <div class="flex h-full">
      <OptionsMenu
        ref="refMenu"
        @view="(data) => refModal.toggle(data)"
        @create="(data) => refModal.toggle(data)"
        @update="(data) => refModal.toggle(data)"
        @delete="(data) => refDataTable.delete(data)"
      />

      <ModalRecord ref="refModal" @close="() => refDataTable.update({})" />

      <SSDataTable
        ref="refDataTable"
        :columns="columns"
        :globalFilter="globalFilter"
        :storageKey="`app-${$route.name}-datatable`"
        :exportFileName="$route.name"
        :onUpdate="User.findAll"
        :onDelete="User.removeOne"
        @toggle-menu="(event, data) => refMenu.toggle(event, data)"
        @toggle-modal="(data) => refModal.toggle(data)"
        @toggle-sidebar="(data) => refSidebar.toggle(data)"
      >
        <template #icon>
          <i class="mr-2 hidden sm:block">
            <AppIcons :name="$route?.name" :size="42" />
          </i>
        </template>

        <template #title>
          {{ $t($route?.meta?.title) }}
        </template>

        <template #subtitle>
          {{ $t($route?.meta?.description) }}
        </template>
      </SSDataTable>
    </div>
  </div>
</template>
