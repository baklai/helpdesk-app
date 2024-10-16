<script setup lang="jsx">
import { ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import HDDataTable from '@/components/tables/HDDataTable.vue';
import OptionsMenu from '@/components/menus/OptionsMenu.vue';

import { dateTimeToStr } from '@/service/DataFilters';
import { useSyslog } from '@/stores/api/syslogs';
import { useProfile } from '@/stores/api/profiles';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const SysLog = useSyslog();
const Profile = useProfile();

const refMenu = ref();
const refDataTable = ref();

const globalFilter = ref({
  field: 'host',
  matchMode: FilterMatchMode.CONTAINS,
  placeholder: 'Search address'
});

const columns = ref([
  {
    header: { text: 'Address', width: '12rem' },
    column: {
      field: 'host',
      render(value) {
        return (
          <Tag
            class="!bg-surface-500/20 px-6 !text-base !font-normal !text-black dark:!text-white"
            value={value}
          />
        );
      }
    },
    sorter: { field: 'host' },
    filter: {
      field: 'host',
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
    header: { text: 'Date', width: '12rem' },
    column: {
      field: 'createdAt',
      render(value) {
        return <span>{dateTimeToStr(value) || '-'}</span>;
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
    header: { text: 'Profile', width: '12rem' },
    column: {
      field: 'profile',
      render(value) {
        return (
          <Tag
            class="!bg-surface-500/20 px-6 !text-base !font-normal !text-black dark:!text-white"
            value={value}
          />
        );
      }
    },
    sorter: { field: 'profile' },
    filter: {
      field: 'profile',
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
    header: { text: 'Method', width: '10rem' },
    column: {
      field: 'method',
      render(value) {
        return (
          <Tag
            class={[
              { 'bg-gray-500/80': value },
              { '!bg-blue-500/80': value.toUpperCase() === 'GET' },
              { '!bg-green-500/80': value.toUpperCase() === 'POST' },
              {
                '!bg-orange-500/80':
                  value.toUpperCase() === 'PUT' || value.toUpperCase() === 'PUTCH'
              },
              { '!bg-red-500/80': value.toUpperCase() === 'DELETE' },

              '!w-24 !rounded px-2 !text-base !font-semibold !text-white'
            ]}
            value={value}
          />
        );
      }
    },
    sorter: { field: 'method' },
    filter: {
      field: 'method',
      value: null,
      matchMode: FilterMatchMode.CONTAINS
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
        return (
          <Tag
            class={[
              { '!text-blue-500': value < 200 },
              { '!text-green-500': value >= 200 && value < 300 },
              { '!text-gray-500': value >= 300 && value < 400 },
              { '!text-orange-500': value >= 400 && value < 500 },
              { '!text-red-500': value >= 500 },

              '!rounded px-6 !text-base !font-bold',
              '!bg-surface-500/20'
            ]}
            value={value}
          />
        );
      }
    },
    sorter: { field: 'status' },
    selectable: true,
    exportable: true,
    filtrable: false,
    sortable: true,
    frozen: false
  },

  {
    header: { text: 'Base Url', width: '20rem' },
    column: {
      field: 'baseUrl',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'baseUrl' },
    filter: {
      field: 'baseUrl',
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
    header: { text: 'User agent', width: '30rem' },
    column: {
      field: 'userAgent',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'userAgent' },
    filter: {
      field: 'userAgent',
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

const confirmDeleteAll = () => {
  confirm.require({
    message: t('Do you want to delete all records?'),
    header: t('Confirm delete records'),
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      await SysLog.removeAll({});
      await refDataTable.value.update({});
      toast.add({
        severity: 'success',
        summary: t('Information'),
        detail: t('All records deleted'),
        life: 3000
      });
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: t('Information'),
        detail: t('Records deletion not confirmed'),
        life: 3000
      });
    }
  });
};
</script>

<template>
  <div class="flex h-full w-full">
    <OptionsMenu
      ref="refMenu"
      @view="data => false"
      @create="data => false"
      @update="data => false"
      @delete="data => refDataTable.delete(data)"
    />

    <HDDataTable
      ref="refDataTable"
      :columns="columns"
      :globalFilter="globalFilter"
      :storageKey="`app-datatable-${$route.name}`"
      :exportFileName="$route.name"
      :onUpdate="SysLog.findAll"
      :onDelete="SysLog.removeOne"
      @toggle-menu="(event, data) => refMenu.toggle(event, data)"
      @toggle-modal="data => false"
      @toggle-sidebar="data => false"
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
        <Button
          text
          plain
          rounded
          icon="pi pi-trash"
          iconClass="text-2xl"
          class="h-12 w-12"
          v-tooltip.bottom="$t('Delete records')"
          @click="confirmDeleteAll"
        />
      </template>
    </HDDataTable>
  </div>
</template>
