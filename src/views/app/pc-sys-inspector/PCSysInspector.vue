<script setup lang="jsx">
import { ref } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useToast } from 'primevue/usetoast';

import HDDataTable from '@/components/tables/HDDataTable.vue';
import BtnDBTables from '@/components/buttons/BtnDBTables.vue';
import OptionsMenu from '@/components/menus/OptionsMenu.vue';
import ModalRecord from '@/components/modals/SysInspector.vue';
import SidebarRecord from '@/components/sidebars/SysInspector.vue';

import { dateTimeToStr, byteToStr } from '@/service/DataFilters';
import { useInspector } from '@/stores/api/inspectors';
import { useTool } from '@/stores/api/systools';

const toast = useToast();

const Inspector = useInspector();
const Tool = useTool();

const refMenu = ref();
const refModal = ref();
const refSidebar = ref();
const refDataTable = ref();

const refWarningMenu = ref();
const warningOptions = ref([
  {
    label: 'Показати відсутні IP-адреси',
    icon: 'pi pi-desktop',
    command: async () =>
      await refDataTable.value.update({
        filters: {
          warning: 'ipaddress'
        }
      })
  },
  {
    label: 'Показати попередження про обліковий запис користувача',
    icon: 'pi pi-users',
    command: async () =>
      await refDataTable.value.update({
        filters: {
          warning: 'useraccount'
        }
      })
  },
  {
    label: 'Показати попередження про програмне забезпечення',
    icon: 'pi pi-microsoft',
    command: async () =>
      await refDataTable.value.update({
        filters: {
          warning: 'product'
        }
      })
  },
  {
    label: 'Показати попередження про спільні ресурси',
    icon: 'pi pi-folder',
    command: async () =>
      await refDataTable.value.update({
        filters: {
          warning: 'share'
        }
      })
  },
  { separator: true },
  {
    label: 'Показати всі попередження',
    icon: 'pi pi-bookmark-fill',
    command: async () =>
      await refDataTable.value.update({
        filters: {
          warning: 'all'
        }
      })
  }
]);

const globalFilter = ref({
  field: 'host',
  matchMode: FilterMatchMode.STARTS_WITH,
  placeholder: 'Пошук IP-адреси'
});

const columns = ref([
  {
    header: { text: "Ім'я комп'ютера", width: '16rem' },
    column: {
      field: 'system.csname',
      render(value) {
        return (
          <div class="cursor-pointer font-semibold">
            <i class="pi pi-desktop mr-2"></i>
            <span>{value}</span>
          </div>
        );
      },
      action(value) {
        refSidebar.value.toggle(value);
      }
    },
    sorter: { field: 'system.csname' },
    filter: {
      field: 'os.CSName',
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
    header: { text: 'Baseboard', width: '16rem' },
    column: {
      field: 'baseboard',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'baseboard.SerialNumber' },
    filter: {
      field: 'baseboard.SerialNumber',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: false,
    exportable: true,
    filtrable: true,
    sortable: true,
    frozen: true
  },

  {
    header: { text: 'IP-адреса', width: '15rem' },
    column: {
      field: 'host',
      render(value) {
        return <span class="cursor-pointer font-bold text-primary-500">{value}</span>;
      },
      action(value) {
        refModal.value.toggle(value);
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
    header: { text: 'IP Status', width: '10rem' },
    column: {
      field: 'ipaddress',
      render(value) {
        return (
          <span class="cursor-pointer pl-6 font-bold text-primary-500">
            {value ? (
              <i class="pi pi-verified text-green-500"></i>
            ) : (
              <i class="pi pi-exclamation-triangle text-red-500"></i>
            )}
          </span>
        );
      }
    },
    selectable: true,
    exportable: true,
    filtrable: false,
    sortable: false,
    frozen: false
  },

  {
    header: { text: 'Users', width: '13rem' },
    column: {
      field: 'inspector.useraccount',
      render(value) {
        return (
          <Tag
            class={[
              'h-8 w-12 !text-base !font-semibold !text-black dark:!text-white',
              value.warning ? '!bg-orange-500/90' : '!bg-surface-500/20'
            ]}
            value={value.count || '-'}
          />
        );
      }
    },
    sorter: { field: 'useraccount' },
    filter: {
      field: 'useraccount.Name',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    exportable: false,
    filtrable: true,
    sortable: false,
    frozen: false
  },

  {
    header: { text: 'Products', width: '13rem' },
    column: {
      field: 'inspector.product',
      render(value) {
        return (
          <Tag
            class={[
              'h-8 w-12 !text-base !font-semibold !text-black dark:!text-white',
              value.warning ? '!bg-orange-500/90' : '!bg-surface-500/20'
            ]}
            value={value.count || '-'}
          />
        );
      }
    },
    sorter: { field: 'product' },
    filter: {
      field: 'product.Name',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    exportable: false,
    filtrable: true,
    sortable: false,
    frozen: false
  },

  {
    header: { text: 'SMB Share', width: '13rem' },
    column: {
      field: 'inspector.share',
      render(value) {
        return (
          <Tag
            class={[
              'h-8 w-12 !text-base !font-semibold !text-black dark:!text-white',
              value.warning ? '!bg-orange-500/90' : '!bg-surface-500/20'
            ]}
            value={value.count || '-'}
          />
        );
      }
    },
    sorter: { field: 'share' },
    filter: {
      field: 'share.Name',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    exportable: false,
    filtrable: true,
    sortable: false,
    frozen: false
  },

  {
    header: { text: 'Fix Update', width: '13rem' },
    column: {
      field: 'fixupdate',
      render(value) {
        return <Tag class={'w-3 text-base font-medium'} value={value} />;
      }
    },
    sorter: { field: 'fixupdate' },
    filter: {
      field: 'fixupdate.HotFixID',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: false,
    exportable: false,
    filtrable: true,
    sortable: false,
    frozen: false
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
  },

  {
    header: { text: 'OS Name', width: '20rem' },
    column: {
      field: 'system.osname',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'system.osname' },
    filter: {
      field: 'os.Caption',
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
    header: { text: 'OS Platform', width: '15rem' },
    column: {
      field: 'system.platform',
      render(value) {
        return <span>{value ? value : '32-bit'}</span>;
      }
    },
    sorter: { field: 'system.platform' },
    filter: {
      field: 'os.OSArchitecture',
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
    header: { text: 'OS Version', width: '12rem' },
    column: {
      field: 'system.version',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'system.version' },
    filter: {
      field: 'os.Version',
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
    header: { text: 'CPU', width: '25rem' },
    column: {
      field: 'cpu',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'cpu' },
    filter: {
      field: 'cpu.Name',
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
    header: { text: 'RAM', width: '15rem' },
    column: {
      field: 'ram',
      render(value) {
        return <span>{byteToStr(value)}</span>;
      }
    },
    sorter: { field: 'ram' },
    filter: {
      field: 'ram',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    exportable: true,
    filtrable: false,
    sortable: true,
    frozen: false
  },

  {
    header: { text: 'HDD', width: '12rem' },
    column: {
      field: 'hdd',
      render(value) {
        return <span>{byteToStr(value)}</span>;
      }
    },
    sorter: { field: 'hdd' },
    filter: {
      field: 'hdd',
      value: null,
      matchMode: FilterMatchMode.CONTAINS,
      filterOperator: FilterOperator.AND,
      showFilterMatchModes: true
    },
    selectable: true,
    exportable: true,
    filtrable: false,
    sortable: true,
    frozen: false
  }
]);

const createSysInspectorScript = async () => {
  try {
    const file = await Tool.getScriptInspector();
    const url = window.URL.createObjectURL(new Blob([file]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'inspector.vbs');
    toast.add({
      severity: 'info',
      summary: 'Інформація',
      detail: 'Файл скрипта SysInspector створено',
      life: 3000
    });
    link.click();
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Файл скрипта SysInspector не створено'
    });
  }
};
</script>

<template>
  <div class="flex h-full w-full">
    <Menu ref="refWarningMenu" popup :model="warningOptions" class="w-[15rem] p-2">
      <template #item="{ label, item, props }">
        <a :href="item.url" v-bind="props.action">
          <span v-bind="props.icon" />
          <span v-bind="props.label">{{ label }}</span>
        </a>
      </template>
    </Menu>

    <OptionsMenu
      ref="refMenu"
      hostkey="host"
      @view="data => refModal.toggle(data)"
      @create="async () => await createSysInspectorScript()"
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
      :onUpdate="Inspector.findAll"
      :onDelete="Inspector.removeOne"
      @toggle-menu="(event, data) => refMenu.toggle(event, data)"
      @toggle-modal="async () => await createSysInspectorScript()"
      @toggle-sidebar="data => refSidebar.toggle(data)"
    >
      <template #icon>
        <i class="my-auto mr-2 hidden sm:block">
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
        <Button
          text
          plain
          rounded
          icon="pi pi-bookmark-fill"
          iconClass="text-2xl"
          class="h-12 w-12 hover:text-orange-500"
          v-tooltip.bottom="'Показати всі проблеми'"
          @click="event => refWarningMenu.toggle(event)"
        />

        <BtnDBTables />
      </template>
    </HDDataTable>

    <SidebarRecord ref="refSidebar" @toggle-menu="(event, data) => refMenu.toggle(event, data)" />
  </div>
</template>
