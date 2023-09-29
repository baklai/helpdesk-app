<script setup lang="jsx">
import { ref, defineAsyncComponent } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';

// import SSDataTable from '@/components/tables/SSDataTable.vue';
// import OptionsMenu from '@/components/menus/OptionsMenu.vue';
// import ModalRecord from '@/components/modals/Channel.vue';
// import SidebarRecord from '@/components/sidebar/Channel.vue';

const SSDataTable = defineAsyncComponent(() => import('@/components/tables/SSDataTable.vue'));
const OptionsMenu = defineAsyncComponent(() => import('@/components/menus/OptionsMenu.vue'));
const ModalRecord = defineAsyncComponent(() => import('@/components/modals/Channel.vue'));
const SidebarRecord = defineAsyncComponent(() => import('@/components/sidebar/Channel.vue'));

import { useChannel } from '@/stores/api/channels';

const Channel = useChannel();

const refMenu = ref();
const refModal = ref();
const refSidebar = ref();
const refDataTable = ref();

const columns = ref([
  {
    header: { text: 'Location from', width: '16rem' },
    column: {
      field: 'locationFrom',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'locationFrom' },
    filter: {
      field: 'locationFrom',
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
    header: { text: 'Unit from', width: '13rem' },
    column: {
      field: 'unitFrom',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'unitFrom' },
    filter: {
      field: 'unitFrom',
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
    header: { text: 'Location to', width: '16rem' },
    column: {
      field: 'locationTo',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'locationTo' },
    filter: {
      field: 'locationTo',
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
    header: { text: 'Unit to', width: '13rem' },
    column: {
      field: 'unitTo',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'unitTo' },
    filter: {
      field: 'unitTo',
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
    header: { text: 'Level', width: '12rem' },
    column: {
      field: 'level',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'level' },
    filter: {
      field: 'level',
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
    header: { text: 'Type', width: '12rem' },
    column: {
      field: 'type',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'type' },
    filter: {
      field: 'type',
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
    header: { text: 'Speed', width: '12rem' },
    column: {
      field: 'speed',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'speed' },
    filter: {
      field: 'speed',
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
    header: { text: 'Status', width: '10rem' },
    column: {
      field: 'status',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'status' },
    filter: {
      field: 'status',
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
    header: { text: 'Operator', width: '12rem' },
    column: {
      field: 'operator',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'operator' },
    filter: {
      field: 'operator',
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
    header: { text: 'Composition', width: '12rem' },
    column: {
      field: 'composition',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'composition' },
    filter: {
      field: 'composition',
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
  }
]);
</script>

<template>
  <div class="col-12">
    <div class="flex h-full">
      <OptionsMenu
        ref="refMenu"
        @view="data => refSidebar.toggle(data)"
        @create="data => refModal.toggle(data)"
        @update="data => refModal.toggle(data)"
        @delete="data => refDataTable.delete(data)"
      />

      <ModalRecord ref="refModal" @close="() => refDataTable.update({})" />

      <SSDataTable
        ref="refDataTable"
        :columns="columns"
        :storageKey="`app-${$route.name}-datatable`"
        :exportFileName="$route.name"
        :onUpdate="Channel.findAll"
        :onDelete="Channel.removeOne"
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
      </SSDataTable>

      <SidebarRecord ref="refSidebar" @toggle-menu="(event, data) => refMenu.toggle(event, data)" />
    </div>
  </div>
</template>
