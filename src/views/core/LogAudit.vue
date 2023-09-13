<script setup lang="jsx">
import { ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import SSDataTable from '@/components/tables/SSDataTable.vue';
import OptionsMenu from '@/components/menus/OptionsMenu.vue';

import { dateTimeToStr, eventToStr, eventToColor } from '@/service/DataFilters';
import { useScope } from '@/stores/scope';
import { useSyslog } from '@/stores/api/syslogs';
import { useUser } from '@/stores/api/users';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const SysLog = useSyslog();
const Scope = useScope();
const User = useUser();

const refMenu = ref();
const refDataTable = ref();

const globalFilter = ref({
  field: 'address',
  matchMode: FilterMatchMode.CONTAINS,
  placeholder: 'Search address'
});

const columns = ref([
  {
    header: { text: 'Address', width: '12rem' },
    column: {
      field: 'address',
      render(value) {
        return <Tag class="text-base font-normal text-color surface-hover px-4" value={value} />;
      }
    },
    sorter: { field: 'address' },
    filter: {
      field: 'address',
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
    header: { text: 'User', width: '12rem' },
    column: {
      field: 'user',
      render(value) {
        return <Tag class="text-base font-normal text-color surface-hover px-4" value={value} />;
      }
    },
    sorter: { field: 'user' },
    filter: {
      field: 'user',
      value: null,
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'fullname',
        label: 'fullname',
        onRecords: async () => {
          return await User.find();
        }
      }
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: true,
    frozen: true
  },

  {
    header: { text: 'Event', width: '16rem' },
    column: {
      field: 'event',
      render(value) {
        return (
          <Tag
            class="text-base font-normal text-color border-1 border-solid surface-border border-round-xs px-2"
            style={{ background: eventToColor(value) }}
            value={eventToStr(value)}
          />
        );
      }
    },
    sorter: { field: 'event' },
    filter: {
      field: 'event',
      value: null,
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'scope',
        value: 'scope',
        label: 'comment',
        onRecords: () => {
          return [];
          // return Scope.scopeGroups()
          //   .map(group => group.items)
          //   .flat()
          //   .map(item => {
          //     return { scope: item.scope, comment: item.comment };
          //   });
        }
      }
    },
    selectable: true,
    exportable: true,
    filtrable: true,
    sortable: true,
    frozen: false
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
    header: { text: 'User agent', width: '30rem' },
    column: {
      field: 'agent',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'agent' },
    filter: {
      field: 'agent',
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
    header: t('HD Confirm delete records'),
    icon: 'pi pi-info-circle text-yellow-500',
    acceptIcon: 'pi pi-check',
    acceptClass: 'p-button-danger',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      await SysLog.removeAll({});
      await refDataTable.value.update({});
      toast.add({
        severity: 'success',
        summary: t('HD Information'),
        detail: t('All records deleted'),
        life: 3000
      });
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: t('HD Information'),
        detail: t('Records deletion not confirmed'),
        life: 3000
      });
    }
  });
};
</script>

<template>
  <div class="col-12">
    <div class="flex h-full">
      <OptionsMenu
        ref="refMenu"
        @view="data => false"
        @create="data => false"
        @update="data => false"
        @delete="data => refDataTable.delete(data)"
      />

      <SSDataTable
        ref="refDataTable"
        :columns="columns"
        :globalFilter="globalFilter"
        :storageKey="`app-${$route.name}-datatable`"
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
            class="p-button-lg hover:text-color h-3rem w-3rem"
            v-tooltip.bottom="$t('Delete records')"
            @click="confirmDeleteAll"
          />
        </template>
      </SSDataTable>
    </div>
  </div>
</template>
