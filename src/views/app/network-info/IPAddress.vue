<script setup lang="jsx">
import { ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useI18n } from 'vue-i18n';

import HDDataTable from '@/components/tables/HDDataTable.vue';
import BtnDBTables from '@/components/buttons/BtnDBTables.vue';
import OptionsMenu from '@/components/menus/OptionsMenu.vue';
import ModalRecord from '@/components/modals/IPAddress.vue';
import SidebarRecord from '@/components/sidebars/IPAddress.vue';

import { dateToStr, dateTimeToStr } from '@/service/DataFilters';
import { useIPAddress } from '@/stores/api/ipaddresses';
import { useOrganization } from '@/stores/api/organizations';
import { useSubdivision } from '@/stores/api/subdivisions';
import { useDepartment } from '@/stores/api/departments';
import { useLocation } from '@/stores/api/locations';
import { usePosition } from '@/stores/api/positions';
import { useUnit } from '@/stores/api/units';

const { t } = useI18n();

const IPAddress = useIPAddress();
const Organization = useOrganization();
const Subdivision = useSubdivision();
const Department = useDepartment();
const Position = usePosition();
const Location = useLocation();
const Unit = useUnit();

const refMenu = ref(null);
const refModal = ref(null);
const refSidebar = ref(null);
const refDataTable = ref(null);

const globalFilter = ref({
  field: 'ipaddress',
  matchMode: FilterMatchMode.STARTS_WITH,
  placeholder: 'Search IP Address'
});

const columns = ref([
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
    frozen: true
  },

  {
    header: { text: 'Unit', width: '12rem' },
    column: {
      field: 'unit.name',
      render(value) {
        return <span>{value || '-'}</span>;
      }
    },
    sorter: { field: 'unit.name' },
    filter: {
      field: 'unit',
      value: null,
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'id',
        label: 'name',
        onRecords: async () => {
          return await Unit.findAll({});
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
    header: { text: 'Opened date', width: '16rem' },
    column: {
      field: 'date',
      render(value) {
        return <span>{dateToStr(value) || '-'}</span>;
      }
    },
    sorter: { field: 'date' },
    filter: {
      field: 'date',
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
    header: { text: 'IP Address', width: '15rem' },
    column: {
      field: 'ipaddress',
      render(value) {
        return <span class="font-bold text-primary-500 cursor-pointer">{value}</span>;
      },
      action(data) {
        refSidebar.value.toggle(data);
      }
    },
    sorter: { field: 'indexip' },
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
    frozen: true
  },

  {
    header: { text: 'Internet', width: '12rem' },
    column: {
      field: 'inetStatus',
      dataType: 'boolean',
      render(value) {
        return value ? (
          <i class={'pi pi-check-circle font-bold text-green-500'}></i>
        ) : (
          <span>-</span>
        );
      }
    },
    sorter: { field: 'inetStatus' },
    filter: {
      field: 'internet',
      value: null,
      matchMode: FilterMatchMode.EQUALS,
      options: {
        key: 'key',
        value: 'key',
        label: 'name',
        onRecords: () => {
          return [
            { key: 'opened', name: t('Internet opened') },
            { key: 'closed', name: t('Internet closed') },
            { key: 'missing', name: t('Not Internet') }
          ];
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
    header: { text: 'Mask', width: '12rem' },
    column: {
      field: 'mask',
      render(value) {
        return <span>{value}</span>;
      }
    },
    selectable: false,
    exportable: false,
    filtrable: false,
    sortable: false,
    frozen: false
  },

  {
    header: { text: 'Gateway', width: '12rem' },
    column: {
      field: 'gateway',
      render(value) {
        return <span>{value}</span>;
      }
    },
    selectable: false,
    exportable: false,
    filtrable: false,
    sortable: false,
    frozen: false
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
    filtrable: false,
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
    header: { text: 'Phone', width: '12rem' },
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
    header: { text: 'Autoanswer', width: '14rem' },
    column: {
      field: 'autoanswer',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'autoanswer' },
    filter: {
      field: 'autoanswer',
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
      :onUpdate="IPAddress.findAll"
      :onDelete="IPAddress.removeOne"
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
