<script setup lang="jsx">
import { ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

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
  placeholder: 'Пошук IP-адреси'
});

const columns = ref([
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
    header: { text: 'Пристрій', width: '12rem' },
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
    header: { text: 'IP-адреса', width: '15rem' },
    column: {
      field: 'ipaddress',
      render(value) {
        return <span class="cursor-pointer font-bold text-primary-500">{value}</span>;
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
    header: { text: 'Номер листа', width: '16rem' },
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
    header: { text: 'Дата відкриття', width: '16rem' },
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
    header: { text: 'Інтернет', width: '12rem' },
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
            { key: 'opened', name: 'Інтернет відкрито' },
            { key: 'closed', name: 'Інтернет закрито' },
            { key: 'missing', name: 'Відсутній Інтернет' }
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
    header: { text: 'Маска', width: '12rem' },
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
    header: { text: 'Шлюз', width: '12rem' },
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
    header: { text: 'Оновлено', width: '15rem' },
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
    header: { text: "Повне ім'я", width: '16rem' },
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
    header: { text: 'Посада', width: '16rem' },
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
    header: { text: 'Номер телефону', width: '16rem' },
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
    header: { text: 'Автовідповідь', width: '14rem' },
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
