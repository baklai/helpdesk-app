<script setup lang="jsx">
import { ref, inject, computed, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { getObjField } from '@/service/ObjectMethods';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const helpdesk = inject('helpdesk');

const props = defineProps({
  columns: {
    type: Array,
    default: []
  },
  globalFilter: {
    type: [Object, Boolean],
    default: false
  },
  storageKey: {
    type: String,
    default: 'datatable-config'
  },
  exportFileName: {
    type: String,
    default: 'datatable-export'
  },
  onUpdate: {
    type: Function,
    required: true
  },
  onDelete: {
    type: Function,
    required: true
  }
});

const emits = defineEmits(['toggleMenu', 'toggleModal', 'toggleSidebar']);

defineExpose({
  update: async ({ filters }) => {
    if (filters) {
      params.value.filters = { ...params.value.filters, ...filters };
    }
    await onUpdateRecords();
  },
  delete: async data => {
    await onRemoveRecord(data);
  }
});

const onOptionsMenu = (event, value) => {
  emits('toggleMenu', event, value);
};

const refDataTable = ref();
const keyDataTable = ref(0);
const refMenuColumns = ref();

const cols = ref([]);
const params = ref({});
const filters = ref({});
const records = ref([]);
const loading = ref(false);
const totalRecords = ref();
const offsetRecords = ref(0);
const recordsPerPage = ref(15);
const recordsPerPageOptions = ref([5, 10, 15, 20, 25, 50]);

const refMenuActions = ref();
const menuActions = computed(() => [
  {
    label: t('Clear filters'),
    icon: 'pi pi-filter-slash',
    command: () => clearFilters()
  },
  {
    label: t('Create record'),
    icon: 'pi pi-plus-circle',
    command: () => emits('toggleModal', {})
  },
  {
    label: t('Update records'),
    icon: 'pi pi-sync',
    command: () => onUpdateRecords()
  }
]);

const refMenuReports = ref();
const menuReports = computed(() => [
  {
    label: t('Export records'),
    icon: 'pi pi-file-export',
    command: () => exportCSV()
  },
  {
    label: t('Export all records'),
    icon: 'pi pi-file-export',
    command: () => helpdesk.notImplemented()
  }
]);

const onColumnsMenu = event => {
  refMenuColumns.value.toggle(event);
};

const onRemoveRecord = ({ id }) => {
  confirm.require({
    message: t('Do you want to delete this record?'),
    header: t('HD Confirm delete record'),
    icon: 'pi pi-info-circle text-yellow-500',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      if (id) {
        await props.onDelete({ id });
        toast.add({
          severity: 'success',
          summary: t('HD Information'),
          detail: t('Record is removed'),
          life: 3000
        });
        await onUpdateRecords();
      } else {
        toast.add({
          severity: 'warn',
          summary: t('HD Warning'),
          detail: t('Record not selected'),
          life: 3000
        });
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: t('HD Information'),
        detail: t('Record deletion not confirmed'),
        life: 3000
      });
    }
  });
};

const onUpdateRecords = async () => {
  try {
    loading.value = true;
    const { docs, totalDocs, offset, limit } = await props.onUpdate(params.value);
    records.value = docs;
    totalRecords.value = totalDocs;
    offsetRecords.value = Number(offset);
    recordsPerPage.value = limit;
  } catch (err) {
    records.value = [];
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t(err.message),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const initParams = () => {
  params.value = {
    offset: offsetRecords.value,
    limit: recordsPerPage.value,
    sortField: null,
    sortOrder: null,
    filters: filterConverter(filters.value)
  };
};

const initColumns = async () => {
  const columns = props.columns
    .filter(({ column }) => column?.field)
    .map(
      async ({
        header,
        column,
        sorter,
        filter,
        selectable,
        exportable,
        filtrable,
        sortable,
        frozen
      }) => {
        return {
          header: {
            text: header?.text || column.field,
            icon: header?.icon || null,
            width: header?.width || '15rem'
          },
          column: {
            field: column.field,
            render(value) {
              return typeof column?.render === 'function' ? (
                column?.render(value)
              ) : (
                <span>{value}</span>
              );
            },
            action(value) {
              return typeof column?.action === 'function' ? column?.action(value) : null;
            }
          },
          sorter: { field: sorter?.field || column.field },
          filter: {
            field: filter?.field ? filter?.field : column.field,
            value: null,
            matchMode: filter?.matchMode ? filter?.matchMode : FilterMatchMode.IN,
            showFilterMatchModes:
              filter?.showFilterMatchModes === undefined ? false : filter?.showFilterMatchModes,
            filterOperator:
              filter?.showFilterMatchModes === undefined
                ? FilterOperator.AND
                : filter?.filterOperator,
            options: filter?.options
              ? {
                  key: filter?.options?.key ? filter?.options?.key : 'id',
                  value: filter?.options?.value ? filter?.options?.value : 'id',
                  label: filter?.options?.label ? filter?.options?.label : 'title',
                  records:
                    typeof filter?.options?.onRecords === 'function'
                      ? await filter?.options?.onRecords()
                      : []
                }
              : null
          },
          selectable: selectable === undefined ? true : selectable,
          exportable: exportable === undefined ? false : exportable,
          filtrable: filtrable === undefined ? false : filtrable,
          sortable: sortable === undefined ? false : sortable,
          frozen: frozen === undefined ? false : frozen
        };
      }
    );

  cols.value = await Promise.all(columns);
};

const initFilters = async () => {
  filters.value = {
    global: {
      value: null,
      matchMode: props?.globalFilter?.matchMode
        ? props?.globalFilter?.matchMode
        : FilterMatchMode.CONTAINS
    },
    ...props.columns
      .filter(column => column?.filtrable)
      .reduce((previousObject, currentObject) => {
        return Object.assign(previousObject, {
          [currentObject.filter.field]: currentObject?.filter?.showFilterMatchModes
            ? {
                operator: FilterOperator.AND,
                constraints: [
                  {
                    value: currentObject.filter.value || null,
                    matchMode: currentObject.filter.matchMode || FilterMatchMode.CONTAINS
                  }
                ]
              }
            : {
                value: currentObject.filter.value || null,
                matchMode: currentObject.filter.matchMode || FilterMatchMode.CONTAINS
              }
        });
      }, {})
  };
};

const clearFilters = async () => {
  initFilters();
  params.value.filters = filterConverter(filters.value);
  await onUpdateRecords();
};

const clearGlobalFilter = async () => {
  if (filters.value?.global) {
    filters.value['global'].value = null;
    params.value.filters = filterConverter(filters.value);
    await onUpdateRecords();
  }
};

const filterConverter = object => {
  const filterMode = (mode, value) => {
    switch (mode) {
      case 'startsWith':
        return { $regex: `^${value}`, $options: 'i' };
      case 'contains':
        return { $regex: value, $options: 'i' };
      case 'notContains':
        return { $not: { $regex: value, $options: 'i' } };
      case 'endsWith':
        return { $regex: `${value}$`, $options: 'i' };
      case 'equals':
        if (typeof value === 'boolean') {
          return value;
        }
        return { $regex: `^${value}$`, $options: 'i' };
      case 'notEquals':
        return { $ne: value };
      case 'in':
        return { $in: value };
      case 'lt':
        return { $lt: value };
      case 'lte':
        return { $lte: value };
      case 'gt':
        return { $gt: value };
      case 'gte':
        return { $gte: value };
      case 'between':
        return { $gte: value[0], $lte: value[1] };
      case 'dateIs':
        let [startDate, endDate] = value;
        startDate = new Date(startDate);
        startDate.setHours(0, 0, 0, 0);
        endDate = new Date(endDate);
        endDate.setHours(23, 59, 59, 999);
        return {
          $gte: startDate.toISOString(),
          $lt: endDate.toISOString()
        };
      case 'dateIsNot':
        return { $ne: value };
      case 'dateBefore':
        return { $lt: value };
      case 'dateAfter':
        return { $gt: value };
      default:
        console.error('Sorry, we are out of ' + mode + '.');
        return;
    }
  };

  const filterObject = {};
  const filterAND = [];
  const filterOR = [];

  for (const prop in object) {
    if (prop === 'global') {
      if (object['global']?.value !== null) {
        filterObject[props.globalFilter.field] = filterMode(
          object['global'].matchMode,
          object['global'].value
        );
      }
      continue;
    }

    if (object[prop]?.value !== undefined && object[prop]?.value !== null) {
      filterObject[prop] = filterMode(object[prop].matchMode, object[prop].value);
    }

    if (object[prop]?.operator === 'and') {
      filterAND.push(
        ...object[prop]?.constraints
          ?.filter(item => item?.value && item?.value !== null)
          ?.map(item => {
            return { [prop]: filterMode(item.matchMode, item.value) };
          })
      );
    }

    if (object[prop]?.operator === 'or') {
      filterOR.push(
        ...object[prop]?.constraints
          ?.filter(item => item?.value && item?.value !== null)
          ?.map(item => {
            return { [prop]: filterMode(item.matchMode, item.value) };
          })
      );
    }
  }

  if (filterAND?.length) {
    filterObject['$and'] = filterAND;
  }

  if (filterOR?.length) {
    filterObject['$or'] = filterOR;
  }

  return filterObject;
};

const sortConverter = value => {
  const sortObject = {};
  if (value.length !== 0) {
    value.forEach(({ field, order }) => {
      sortObject[field] = parseInt(order, 10);
    });
  } else {
    return;
  }
  return sortObject;
};

const exportCSV = () => {
  refDataTable.value.exportCSV();
};

const onPage = async event => {
  const { rows, first } = event;
  params.value.limit = rows;
  params.value.offset = first;
  await onUpdateRecords();
};

const onSort = async event => {
  params.value.sort = sortConverter(event.multiSortMeta);
  await onUpdateRecords();
};

const onFilter = async event => {
  params.value.offset = 0;
  params.value.filters = filterConverter(event.filters);
  await onUpdateRecords();
};

const onStorage = async event => {
  const { rows, first } = event;
  params.value.limit = rows;
  params.value.offset = first;
  // params.value.sort = sortConverter(event.multiSortMeta);
  // params.value.filters = filterConverter(event.filters);
  await onUpdateRecords();
};

const resetLocalStorage = async () => {
  if (props.storageKey) {
    try {
      localStorage.removeItem(props.storageKey);
      refMenuColumns.value.hide();
      keyDataTable.value += 1;
      toast.add({
        severity: 'success',
        summary: t('HD Information'),
        detail: t('Datatable reset to default'),
        life: 3000
      });
    } catch (err) {
      toast.add({
        severity: 'warn',
        summary: t('HD Warning'),
        detail: t('Datatable not reset to default'),
        life: 3000
      });
    }
  }
};

const selectAllColumns = () => {
  cols.value.filter(col => !col.selectable).forEach(col => (col.selectable = true));
  refMenuColumns.value.hide();
};

onMounted(async () => {
  try {
    loading.value = true;
    initColumns();
    initFilters();
    initParams();
    await onUpdateRecords();
  } catch (err) {
    records.value = [];
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t(err.message),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <Menu popup ref="refMenuColumns" class="p-menu-list p-reset w-[20rem] p-2">
    <template #start>
      <Listbox
        filter
        multiple
        class="w-full"
        :options="cols"
        listStyle="height: 21rem"
        dataKey="selectable"
        optionValue="selectable"
        optionLabel="header.text"
        :filterPlaceholder="$t('Search in list')"
      >
        <template #option="{ index, option }">
          <div class="flex items-center">
            <Checkbox
              binary
              :inputId="`${option.column.field}${index}`"
              v-model="option.selectable"
              class="mr-2"
            />
            <label :for="`${option.column.field}${index}`">
              {{ $t(option.header.text) }}
            </label>
          </div>
        </template>
      </Listbox>
    </template>

    <template #item="{ label, item, props }">
      <a :href="item.url" v-bind="props.action">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>

    <template #end>
      <div class="flex justify-between gap-3 w-full pt-2">
        <Button
          outlined
          :label="$t('Select All')"
          icon="pi pi-check-square"
          size="small"
          class="w-full text-surface-500"
          @click="selectAllColumns"
        />
      </div>
    </template>
  </Menu>

  <div class="flex w-full overflow-x-auto">
    <DataTable
      lazy
      rowHover
      paginator
      scrollable
      removableSort
      resizableColumns
      reorderableColumns
      alwaysShowPaginator
      ref="refDataTable"
      :key="keyDataTable"
      dataKey="id"
      :stateKey="storageKey"
      stateStorage="local"
      csvSeparator=";"
      sortMode="multiple"
      scrollHeight="flex"
      filterDisplay="menu"
      responsiveLayout="scroll"
      columnResizeMode="expand"
      style="height: calc(100vh - 6.7rem)"
      :value="records"
      :loading="loading"
      v-model:filters="filters"
      :exportFilename="exportFileName"
      :pageLinkSize="1"
      :first="offsetRecords"
      :rows="recordsPerPage"
      :totalRecords="totalRecords"
      :rowsPerPageOptions="recordsPerPageOptions"
      :currentPageReportTemplate="
        $t('Showing records', { first: '{first}', last: '{last}', totalRecords: '{totalRecords}' })
      "
      :paginatorTemplate="{
        '640px': 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
        '960px': 'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
        '1300px':
          'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink',
        default:
          'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
      }"
      class="min-w-full overflow-x-auto"
      :pt="{
        header: 'bg-surface-0 dark:bg-surface-900'
      }"
      @state-restore="onStorage"
      @filter="onFilter"
      @sort="onSort"
      @page="onPage"
    >
      <template #header>
        <div class="flex flex-wrap gap-4 mb-2 items-center justify-between">
          <div class="flex flex-wrap gap-2 items-center">
            <slot name="icon" />
            <div>
              <h3 class="m-0">
                <slot name="title" />
              </h3>
              <p class="text-surface-500">
                <slot name="subtitle" />
              </p>
            </div>
          </div>
          <div class="flex flex-wrap gap-2 items-center justify-between sm:w-max w-full">
            <span v-if="globalFilter && filters['global']" class="relative sm:w-max w-full">
              <i
                class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
              />
              <InputText
                id="name"
                class="sm:w-max w-full px-10"
                :placeholder="$t(globalFilter?.placeholder)"
                v-model="filters['global'].value"
                @keydown.enter="onFilter({ filters })"
              />
              <i
                class="pi pi-times cursor-pointer absolute top-2/4 -mt-2 right-3 text-surface-400 dark:text-surface-600 hover:text-surface-900 dark:hover:text-surface-300"
                v-tooltip.bottom="$t('Clear global filter')"
                @click="clearGlobalFilter"
              />
            </span>

            <div class="flex gap-2 sm:w-max w-full justify-between">
              <Button
                text
                plain
                rounded
                icon="pi pi-filter-slash"
                class="text-2xl w-12 h-12 hover:text-surface-600 dark:hover:text-surface-300"
                :class="
                  params?.filters && Object.keys(params.filters).length ? 'text-primary-500' : ''
                "
                v-tooltip.bottom="$t('Clear filters')"
                @click="clearFilters"
              />

              <Button
                text
                plain
                rounded
                icon="pi pi-plus-circle"
                class="text-2xl w-12 h-12 hover:text-surface-600 dark:hover:text-surface-300"
                v-tooltip.bottom="$t('Create record')"
                @click="emits('toggleModal', {})"
              />

              <Button
                text
                plain
                rounded
                icon="pi pi-sync"
                class="text-2xl w-12 h-12 hover:text-surface-600 dark:hover:text-surface-300"
                v-tooltip.bottom="$t('Update records')"
                @click="onUpdateRecords"
              />

              <slot name="actions" />

              <Button
                text
                plain
                rounded
                icon="pi pi-cog"
                class="text-2xl w-12 h-12 hover:text-surface-600 dark:hover:text-surface-300"
                v-tooltip.bottom="$t('Columns option')"
                @click="onColumnsMenu"
              />
            </div>
          </div>
        </div>

        <slot name="subheader" />
      </template>

      <template #loading>
        <i class="pi pi-spin pi-spinner text-4xl mr-4"></i>
        <span> {{ $t('Loading records data. Please wait') }}.</span>
      </template>

      <template #empty>
        <div
          v-if="!loading && records?.length === 0"
          class="flex flex-col justify-center p-datatable-loading-overlay p-component-overlay z-0"
        >
          <i class="pi pi-filter-slash text-surface-500" style="font-size: 4rem"></i>
          <h5>{{ $t('No records found') }}</h5>
          <p>{{ $t('Try changing the search terms in the filter') }}</p>
          <Button
            icon="pi pi-filter-slash"
            iconClass="text-sm"
            class=""
            :label="$t('Clear filters')"
            @click="clearFilters"
          />
        </div>
      </template>

      <template #paginatorstart>
        <div class="flex flex-wrap gap-4 items-center justify-evenly xl:justify-between p-2">
          <div class="flex flex-wrap gap-2 items-center justify-evenly">
            <Button
              plain
              outlined
              icon="pi pi-refresh"
              iconClass="text-xl"
              style="width: 3rem; height: 2.2rem"
              v-tooltip.bottom="$t('Reset to default')"
              @click="resetLocalStorage"
            />

            <Menu ref="refMenuActions" :model="menuActions" popup>
              <template #item="{ label, item, props }">
                <a :href="item.url" v-bind="props.action">
                  <span v-bind="props.icon" />
                  <span v-bind="props.label">{{ label }}</span>
                </a>
              </template>
            </Menu>
            <Button
              text
              plain
              outlined
              :label="$t('Actions')"
              class="sm:w-max w-full"
              @click="event => refMenuActions.toggle(event)"
            >
              <template #default>
                <i class="pi pi-sliders-h" />
                <span class="mx-2">
                  {{ $t('Actions') }}
                </span>
                <i class="pi pi-chevron-down" />
              </template>
            </Button>

            <Menu ref="refMenuReports" :model="menuReports" popup>
              <template #item="{ label, item, props }">
                <a :href="item.url" v-bind="props.action">
                  <span v-bind="props.icon" />
                  <span v-bind="props.label">{{ label }}</span>
                </a>
              </template>
            </Menu>
            <Button
              text
              plain
              outlined
              :label="$t('Reports')"
              class="sm:w-max w-full"
              @click="event => refMenuReports.toggle(event)"
            >
              <template #default>
                <i class="pi pi-save" />
                <span class="mx-2">
                  {{ $t('Reports') }}
                </span>
                <i class="pi pi-chevron-down" />
              </template>
            </Button>
          </div>
        </div>
      </template>

      <Column field="options" frozen :exportable="false" :reorderableColumn="false" class="w-2rem">
        <template #header>
          <Button
            text
            plain
            rounded
            icon="pi pi-cog"
            class="font-bold"
            v-tooltip.bottom="$t('Columns option')"
            @click="onColumnsMenu"
          />
        </template>
        <template #body="{ data }">
          <Button
            text
            plain
            rounded
            icon="pi pi-ellipsis-v"
            class="font-bold"
            v-tooltip.bottom="$t('Optional menu')"
            @click="onOptionsMenu($event, data)"
          />
        </template>
      </Column>

      <Column
        v-for="(
          { header, column, filter, sortable, filtrable, selectable, exportable, frozen }, index
        ) of cols"
        :hidden="!selectable"
        :key="`${column.field}-${index}`"
        :field="column.field"
        :reorderableColumn="!frozen"
        :exportHeader="header.text"
        :sortable="sortable"
        :exportable="exportable"
        :frozen="frozen"
        :filterField="filter.field"
        :showFilterMatchModes="filter.showFilterMatchModes"
        :style="{ minWidth: header.width }"
        headerClass="font-bold text-center uppercase"
        class="max-w-20rem"
      >
        <template #header>
          <span class="mx-2">
            <i v-if="header?.icon" :class="header.icon" class="mr-2" />
            {{ $t(header?.text) }}
          </span>
        </template>

        <template #body="{ data, field }">
          <div class="white-space-nowrap overflow-hidden text-overflow-ellipsis px-2">
            <component
              v-if="column?.render"
              :is="column?.render(getObjField(data, field))"
              @click="column?.action ? column?.action(data) : false"
            />
            <span v-else>{{ getObjField(data, field) }}</span>
          </div>
        </template>

        <template
          #filter="{ filterModel, filterCallback }"
          v-if="filtrable === undefined ? false : filtrable"
        >
          <Listbox
            filter
            multiple
            class="w-[20rem]"
            listStyle="height: 20rem"
            v-model="filterModel.value"
            :dataKey="filter?.options?.key || 'id'"
            :optionValue="filter?.options?.value || 'id'"
            :optionLabel="filter?.options?.label || 'label'"
            :options="filter?.options?.records || []"
            :filterPlaceholder="$t('Search in list')"
            v-if="filter?.matchMode === FilterMatchMode.IN"
          >
            <template #option="{ option }">
              <div class="flex items-center">
                <Checkbox
                  :inputId="option.key"
                  :value="option[filter.options.value]"
                  :modelValue="filterModel.value"
                  class="mr-2"
                />
                <label :for="option.key">
                  {{ option[filter?.options?.label] }}
                </label>
              </div>
            </template>
          </Listbox>

          <Dropdown
            showClear
            v-model="filterModel.value"
            :optionValue="filter.options.value || 'id'"
            :optionLabel="filter.options.label || 'id'"
            :options="filter.options.records || []"
            :placeholder="$t('Select one record')"
            class="p-column-filter"
            style="min-width: 12rem"
            @change="filterCallback()"
            v-else-if="filter?.matchMode === FilterMatchMode.EQUALS && filter?.options"
          >
            <template #option="slotProps">
              <Chip :label="slotProps.option[filter?.options?.label]" />
            </template>
          </Dropdown>

          <Calendar
            inline
            class="w-[25rem]"
            selectionMode="range"
            dateFormat="dd.mm.yy"
            :placeholder="$t('Select date')"
            v-model="filterModel.value"
            v-else-if="filter?.matchMode === FilterMatchMode.DATE_IS"
          />

          <InputText
            type="text"
            class="p-column-filter"
            v-model="filterModel.value"
            :placeholder="$t('Search by column')"
            @keydown.enter="filterCallback()"
            v-else-if="filter?.matchMode === FilterMatchMode.CONTAINS"
          />

          <div
            class="flex flex-col items-center gap-3"
            v-else-if="filter?.matchMode === FilterMatchMode.EQUALS"
          >
            <TriStateCheckbox v-model="filterModel.value" inputId="verified-filter" />
            <label for="verified-filter" class="font-bold">
              {{ $t(header.text) }} {{ filterModel.value == null ? '' : filterModel.value }}
            </label>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>
