<script setup lang="jsx">
import { ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import Panel from 'primevue/panel';

import SSDataTable from '@/components/tables/SSDataTable.vue';
import OptionsMenu from '@/components/menus/OptionsMenu.vue';
import ModalRecord from '@/components/modals/ONMAP.vue';
import SidebarRecord from '@/components/sidebar/ONMAP.vue';

import { dateTimeToStr, byteToStr } from '@/service/DataFilters';
import { useOnmap } from '@/stores/api/onmaps';

const { t } = useI18n();
const toast = useToast();

const Onmap = useOnmap();

const refMenu = ref();
const refModal = ref();
const refSidebar = ref();
const refDataTable = ref();

const subheader = ref(false);

const SCAN_PROFILES = ref([
  {
    title: 'Intense scan',
    flags: ['-T4', '-A', '-v']
  },
  {
    title: 'Intense scan plus UDP',
    flags: ['-sS', '-sU', '-T4', '-A', '-v']
  },
  {
    title: 'Intense scan, all TCP ports',
    flags: ['-p 1-65535', '-T4', '-A', '-v']
  },
  {
    title: 'Intense scan, no ping',
    flags: ['-T4', '-A', '-v', '-Pn']
  },
  {
    title: 'Ping scan',
    flags: ['-sn']
  },
  {
    title: 'Quick scan',
    flags: ['-T4', '-F']
  },
  {
    title: 'Quick scan plus',
    flags: ['-sV', '-T4', '-O', '-F', '--version-light']
  },
  {
    title: 'Quick traceroute',
    flags: ['-sn', '--traceroute']
  },
  {
    title: 'Slow comprehensive scan',
    flags: [
      '-sS',
      '-sU',
      '-T4',
      '-A',
      '-v',
      '-PE',
      '-PP',
      '-PS80,443',
      '-PA3389',
      '-PU40125',
      '-PY',
      '-g 53',
      '--script "default or (discovery and safe)"'
    ]
  }
]);

const globalFilter = ref({
  field: 'target',
  matchMode: FilterMatchMode.STARTS_WITH,
  placeholder: 'Search target'
});

const columns = ref([
  {
    header: { text: 'Title', width: '16rem' },
    column: {
      field: 'title',
      render(value) {
        return (
          <div class="font-medium cursor-pointer">
            <span>{value}</span>
          </div>
        );
      },
      action(value) {
        refSidebar.value.toggle(value);
      }
    },
    sorter: { field: 'title' },
    filter: {
      field: 'title',
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
    header: { text: 'Target', width: '15rem' },
    column: {
      field: 'target',
      render(value) {
        return <span class="font-medium text-primary cursor-pointer">{value}</span>;
      },
      action(value) {
        refModal.value.toggle(value);
      }
    },
    sorter: { field: 'target' },
    filter: {
      field: 'target',
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
    header: { text: 'Report date', width: '15rem' },
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
  }
]);
</script>

<template>
  <div class="col-12">
    <div class="flex h-full">
      <OptionsMenu
        ref="refMenu"
        hostkey="host"
        @view="data => refModal.toggle(data)"
        @create="subheader = !subheader"
        @update="data => refModal.toggle(data)"
        @delete="data => refDataTable.delete(data)"
      />

      <ModalRecord ref="refModal" @close="() => refDataTable.update({})" />

      <SSDataTable
        ref="refDataTable"
        :columns="columns"
        :globalFilter="globalFilter"
        :storageKey="`app-${$route.name}-datatable`"
        :exportFileName="$route.name"
        :onUpdate="Onmap.findAll"
        :onDelete="Onmap.removeOne"
        @toggle-menu="(event, data) => refMenu.toggle(event, data)"
        @toggle-modal="subheader = !subheader"
        @toggle-sidebar="data => refSidebar.toggle(data)"
      >
        <template #icon>
          <i class="my-auto mr-2 hidden sm:block">
            <AppIcons :name="$route?.name" :size="42" />
          </i>
        </template>

        <template #title>
          {{ $t($route?.meta?.title) }}
        </template>

        <template #subtitle>
          {{ $t($route?.meta?.description) }}
        </template>

        <template #actions> </template>

        <template #subheader>
          <Panel class="border-1 border-solid surface-border shadow-none" v-show="subheader">
            <template #header>
              <div class="flex align-items-center gap-2">
                <span class="font-bold">{{ $t('Onmap scanner run') }}</span>
              </div>
            </template>
            <template #footer>
              <div class="flex flex-wrap align-items-center justify-content-between gap-3">
                <div class="flex align-items-center gap-2">
                  <Button icon="pi pi-bookmark" rounded text></Button>
                </div>
                <span class="p-text-secondary">Updated 2 hours ago</span>
              </div>
            </template>
            <p class="m-0">ONMAP Scanner form</p>
          </Panel>
        </template>
      </SSDataTable>

      <SidebarRecord ref="refSidebar" @toggle-menu="(event, data) => refMenu.toggle(event, data)" />
    </div>
  </div>
</template>
