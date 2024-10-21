<script setup lang="jsx">
import { ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import HDDataTable from '@/components/tables/HDDataTable.vue';
import BtnDBTables from '@/components/buttons/BtnDBTables.vue';
import OptionsMenu from '@/components/menus/OptionsMenu.vue';
import ModalRecord from '@/components/modals/Mailbox.vue';
import SidebarRecord from '@/components/sidebars/Mailbox.vue';

import { dateToStr, dateTimeToStr } from '@/service/DataFilters';
import { useMailbox } from '@/stores/api/mailboxes';
import { useOrganization } from '@/stores/api/organizations';
import { useSubdivision } from '@/stores/api/subdivisions';
import { useDepartment } from '@/stores/api/departments';
import { useLocation } from '@/stores/api/locations';
import { usePosition } from '@/stores/api/positions';

const Mailbox = useMailbox();
const Organization = useOrganization();
const Subdivision = useSubdivision();
const Department = useDepartment();
const Position = usePosition();
const Location = useLocation();

const refMenu = ref();
const refModal = ref();
const refSidebar = ref();
const refDataTable = ref();

const globalFilter = ref({
  field: 'login',
  matchMode: FilterMatchMode.STARTS_WITH,
  placeholder: 'Search login'
});

const columns = ref([
  {
    header: { text: 'Login', width: '14rem' },
    column: {
      field: 'login',
      render(value) {
        return (
          <Tag
            class={[
              'cursor-pointer px-4 !text-base font-bold',
              '!bg-surface-500/5',
              '!text-primary-600'
            ]}
            value={value}
          />
        );
      },
      action(data) {
        refSidebar.value.toggle(data);
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
    header: { text: 'Номер листа', width: '20rem' },
    column: {
      field: 'reqnum',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'reqnum' },
    filter: {
      field: 'reqnum',
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
    header: { text: 'Date open', width: '16rem' },
    column: {
      field: 'dateOpen',
      render(value) {
        return <span>{dateToStr(value) || '-'}</span>;
      }
    },
    sorter: { field: 'dateOpen' },
    filter: {
      field: 'dateOpen',
      value: null,
      matchMode: FilterMatchMode.DATE_IS
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: true,
    frozen: true
  },

  {
    header: { text: 'Updated', width: '15rem' },
    column: {
      field: 'updatedAt',
      render(value) {
        return <span class="mr-3">{dateTimeToStr(value)}</span>;
      }
    },
    sorter: { field: 'updatedAt' },
    filter: {
      field: 'updatedAt',
      value: null,
      matchMode: FilterMatchMode.DATE_IS
    },
    selectable: false,
    exportable: false,
    filtrable: true,
    sortable: true,
    frozen: false
  },

  {
    header: { text: 'Status', width: '10rem' },
    column: {
      field: 'status',
      render(value) {
        return value ? (
          <i class={'pi pi-check-circle ml-4 font-bold text-green-500'}></i>
        ) : (
          <i class={'pi pi-lock ml-4 font-bold text-surface-500'}></i>
        );
      }
    },
    sorter: { field: 'status' },
    filter: {
      field: 'status',
      value: null,
      matchMode: FilterMatchMode.EQUALS,
      showFilterMatchModes: false
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: true,
    frozen: true
  },

  {
    header: { text: "Повне ім'я", width: '18rem' },
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
    frozen: false
  },

  {
    header: { text: 'Розташування', width: '15rem' },
    column: {
      field: 'location.name',
      render(value) {
        return <span>{value || '-'}</span>;
      }
    },
    sorter: { field: 'location.name' },
    filter: {
      field: 'location',
      value: null,
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'name',
        grouped: true,
        onRecords: async () => {
          return await Location.findAllGroured({});
        }
      }
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: false,
    frozen: true
  },

  {
    header: { text: 'Організація', width: '16rem' },
    column: {
      field: 'organization.name',
      render(value) {
        return <span>{value || '-'}</span>;
      }
    },
    sorter: { field: 'organization.name' },
    filter: {
      field: 'organization',
      value: null,
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'name',
        onRecords: async () => {
          return await Organization.findAll({});
        }
      }
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: false,
    frozen: false
  },

  {
    header: { text: 'Підрозділ', width: '16rem' },
    column: {
      field: 'subdivision.name',
      render(value) {
        return <span>{value || '-'}</span>;
      }
    },
    sorter: { field: 'subdivision.name' },
    filter: {
      field: 'subdivision',
      value: null,
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'name',
        onRecords: async () => {
          return await Subdivision.findAll({});
        }
      }
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: false,
    frozen: false
  },

  {
    header: { text: 'Відділ', width: '16rem' },
    column: {
      field: 'department.name',
      render(value) {
        return <span>{value || '-'}</span>;
      }
    },
    sorter: { field: 'department.name' },
    filter: {
      field: 'department',
      value: null,
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'name',
        onRecords: async () => {
          return await Department.findAll({});
        }
      }
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: false,
    frozen: false
  },

  {
    header: { text: 'Position', width: '16rem' },
    column: {
      field: 'position.name',
      render(value) {
        return <span>{value || '-'}</span>;
      }
    },
    sorter: { field: 'position.name' },
    filter: {
      field: 'position',
      value: null,
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'name',
        onRecords: async () => {
          return await Position.findAll({});
        }
      }
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: false,
    frozen: false
  },

  {
    header: { text: 'Номер телефону', width: '12rem' },
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
    header: { text: 'Date close', width: '16rem' },
    column: {
      field: 'dateClose',
      render(value) {
        return <span>{dateToStr(value) || '-'}</span>;
      }
    },
    sorter: { field: 'dateClose' },
    filter: {
      field: 'dateClose',
      value: null,
      matchMode: FilterMatchMode.DATE_IS
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: true,
    frozen: false
  },

  {
    header: { text: 'Коментар', width: '25rem' },
    column: {
      field: 'comment',
      render(value) {
        return <span>{value}</span>;
      }
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
      hostkey="ipaddress"
      @view="data => refSidebar.toggle(data)"
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
      :onUpdate="Mailbox.findAll"
      :onDelete="Mailbox.removeOne"
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

      <template #actions>
        <BtnDBTables />
      </template>
    </HDDataTable>

    <SidebarRecord ref="refSidebar" @toggle-menu="(event, data) => refMenu.toggle(event, data)" />
  </div>
</template>
