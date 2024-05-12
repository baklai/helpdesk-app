<script setup lang="jsx">
import { ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

import HDDataTable from '@/components/tables/HDDataTable.vue';
import BtnDBTables from '@/components/buttons/BtnDBTables.vue';
import OptionsMenu from '@/components/menus/OptionsMenu.vue';
import ModalRecord from '@/components/modals/Request.vue';
import SidebarRecord from '@/components/sidebars/Request.vue';

import { dateTimeToStr } from '@/service/DataFilters';
import { useRequest } from '@/stores/api/requests';
import { useLocation } from '@/stores/api/locations';
import { useOrganization } from '@/stores/api/organizations';
import { useSubdivision } from '@/stores/api/subdivisions';
import { useDepartment } from '@/stores/api/departments';
import { usePosition } from '@/stores/api/positions';
import { useProfile } from '@/stores/api/profiles';

const Request = useRequest();
const Organization = useOrganization();
const Subdivision = useSubdivision();
const Department = useDepartment();
const Position = usePosition();
const Location = useLocation();
const Profile = useProfile();

const refMenu = ref();
const refModal = ref();
const refSidebar = ref();
const refDataTable = ref();

const globalFilter = ref({
  field: 'request',
  matchMode: FilterMatchMode.CONTAINS,
  placeholder: 'Search request'
});

const columns = ref([
  {
    header: { text: 'Opened an request', width: '16rem' },
    column: {
      field: 'workerOpen.fullname',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'workerOpen.fullname' },
    filter: {
      field: 'workerOpen',
      value: null,
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'fullname',
        onRecords: async () => {
          return await Profile.find();
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
    header: { text: 'Date opened', width: '15rem' },
    column: {
      field: 'createdAt',
      render(value) {
        return <span class="font-semibold cursor-pointer">{dateTimeToStr(value) || '-'}</span>;
      },
      action(data) {
        refSidebar.value.toggle(data);
      }
    },
    sorter: { field: 'createdAt' },
    filter: {
      field: 'createdAt',
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
    header: { text: 'Status', width: '12rem' },
    column: {
      field: 'status',
      render(value) {
        return value ? (
          <i class="pi pi-check-circle text-green-500 font-bold cursor-pointer" />
        ) : (
          <i class="pi pi-info-circle text-orange-500 font-bold cursor-pointer" />
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
    exportable: false,
    filtrable: true,
    sortable: true,
    frozen: true
  },

  {
    header: { text: 'Request', width: '25rem' },
    column: {
      field: 'request',
      render(value) {
        return <span class="font-semibold cursor-pointer">{value}</span>;
      },
      action(data) {
        refSidebar.value.toggle(data);
      }
    },
    sorter: { field: 'request' },
    filter: {
      field: 'request',
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
    header: { text: 'Location', width: '15rem' },
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
    frozen: false
  },

  {
    header: { text: 'Fullname', width: '16rem' },
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
    header: { text: 'Phone', width: '15rem' },
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
    header: { text: 'IP Address', width: '16rem' },
    column: {
      field: 'ipaddress',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'ipaddress' },
    filter: {
      field: 'ipaddress',
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
    header: { text: 'Mail', width: '16rem' },
    column: {
      field: 'mail',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'mail' },
    filter: {
      field: 'mail',
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
    header: { text: 'Organization', width: '16rem' },
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
    header: { text: 'Subdivision', width: '16rem' },
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
    header: { text: 'Department', width: '16rem' },
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
    header: { text: 'Date closed', width: '15rem' },
    column: {
      field: 'updatedAt',
      render(value) {
        return <span>{dateTimeToStr(value) || '-'}</span>;
      }
    },
    sorter: { field: 'updatedAt' },
    filter: {
      field: 'updatedAt',
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
    header: { text: 'Closed an request', width: '16rem' },
    column: {
      field: 'workerClose.fullname',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'workerClose.fullname' },
    filter: {
      field: 'workerClose',
      value: null,
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'fullname',
        onRecords: async () => {
          return await User.find();
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
    header: { text: 'Conclusion for request', width: '25rem' },
    column: {
      field: 'conclusion',
      render(value) {
        return <span>{value}</span>;
      }
    },
    selectable: true,
    exportable: true,
    filtrable: false,
    sortable: false,
    frozen: false
  },

  {
    header: { text: 'Comment', width: '25rem' },
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
      :onUpdate="Request.findAll"
      :onDelete="Request.removeOne"
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
        {{ $t($route?.meta?.title) }}
      </template>

      <template #subtitle>
        {{ $t($route?.meta?.description) }}
      </template>

      <template #actions>
        <BtnDBTables />
      </template>
    </HDDataTable>

    <SidebarRecord ref="refSidebar" @toggle-menu="(event, data) => refMenu.toggle(event, data)" />
  </div>
</template>
