<script setup lang="jsx">
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { computed, defineAsyncComponent, onMounted, ref } from 'vue';

import AppLoading from '@/components/AppLoading.vue';
const DataTable = defineAsyncComponent(() => import('primevue/datatable'));

import { getObjField } from '@/service/ObjectMethods';

const toast = useToast();
const confirm = useConfirm();

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
const recordsPerPage = ref(20);
const recordsPerPageOptions = ref([5, 10, 15, 20, 25, 50]);

const refMenuActions = ref();

const menuActions = computed(() => [
  {
    label: 'Створити запис',
    icon: 'pi pi-plus-circle',
    command: () => emits('toggleModal', {})
  },
  {
    label: 'Очистити фільтри',
    icon: 'pi pi-filter-slash',
    command: () => clearFilters()
  },
  {
    label: 'Оновити записи',
    icon: 'pi pi-sync',
    command: () => onUpdateRecords()
  },
  {
    label: '-'
  },
  {
    label: 'Скинути таблицю',
    icon: 'pi pi-trash',
    command: () => resetLocalStorage()
  }
]);

const onColumnsMenu = event => {
  refMenuColumns.value.toggle(event);
};

const onRemoveRecord = ({ id }) => {
  confirm.require({
    message: 'Ви бажаєте видалити цей запис?',
    header: 'Підтвердити видалення запису',
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      if (id) {
        await props.onDelete({ id });
        toast.add({
          severity: 'success',
          summary: 'Інформація',
          detail: 'Запис видалено',
          life: 3000
        });
        await onUpdateRecords();
      } else {
        toast.add({
          severity: 'warn',
          summary: 'Попередження',
          detail: 'Запис не вибрано',
          life: 3000
        });
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Інформація',
        detail: 'Видалення запису не підтверджено',
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
      summary: 'Попередження',
      detail: err.message,
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
                  grouped: filter?.options?.grouped ? filter?.options?.grouped : null,
                  records: filter?.options?.records || [],
                  onRecords:
                    typeof filter?.options?.onRecords === 'function'
                      ? filter?.options?.onRecords
                      : () => []
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
            return {
              [prop]: filterMode(item.matchMode, item.value)
            };
          })
      );
    }

    if (object[prop]?.operator === 'or') {
      filterOR.push(
        ...object[prop]?.constraints
          ?.filter(item => item?.value && item?.value !== null)
          ?.map(item => {
            return {
              [prop]: filterMode(item.matchMode, item.value)
            };
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
        summary: 'Інформація',
        detail: 'Таблиця скинута за замовчуванням',
        life: 3000
      });
    } catch (err) {
      toast.add({
        severity: 'warn',
        summary: 'Попередження',
        detail: 'Таблиця не скинута за замовчуванням',
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
      summary: 'Попередження',
      detail: err.message,
      life: 3000
    });
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <Menu popup ref="refMenuColumns" class="w-80 p-2">
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
        filterPlaceholder="Пошук у списку"
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
              {{ option.header.text }}
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
      <div class="flex w-full justify-between gap-3 pt-2">
        <Button
          outlined
          label="Вибрати все"
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
      :stateKey="!storageKey || null"
      stateStorage="local"
      csvSeparator=";"
      sortMode="multiple"
      scrollHeight="flex"
      filterDisplay="menu"
      size="small"
      responsiveLayout="scroll"
      columnResizeMode="expand"
      :value="records"
      :loading="loading"
      v-model:filters="filters"
      :exportFilename="exportFileName"
      :pageLinkSize="1"
      :first="offsetRecords"
      :rows="recordsPerPage"
      :totalRecords="totalRecords"
      :rowsPerPageOptions="recordsPerPageOptions"
      currentPageReportTemplate="Показано з {first} по {last} з {totalRecords} записів"
      style="height: calc(100vh - 5rem)"
      class="min-w-full overflow-x-auto text-base"
      :paginatorTemplate="'CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'"
      @state-restore="onStorage"
      @filter="onFilter"
      @sort="onSort"
      @page="onPage"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-1">
            <slot name="icon" />
            <div class="flex flex-col">
              <h3 class="text-2xl font-normal text-surface-900 dark:text-surface-50">
                <slot name="title" />
              </h3>
              <p class="text-base font-normal text-surface-500">
                <slot name="subtitle" />
              </p>
            </div>
          </div>
          <div class="flex w-full flex-wrap items-center justify-between gap-2 sm:w-max">
            <span v-if="globalFilter && filters['global']" class="relative w-full sm:w-max">
              <i
                class="pi pi-search absolute left-3 top-2/4 -mt-2 text-surface-400 dark:text-surface-600"
              />
              <InputText
                id="name"
                class="w-full !bg-inherit px-10 sm:w-max"
                :placeholder="globalFilter?.placeholder"
                v-model="filters['global'].value"
                @keydown.enter="onFilter({ filters })"
              />
              <i
                class="pi pi-times absolute right-3 top-2/4 -mt-2 cursor-pointer text-surface-400 hover:text-surface-900 dark:text-surface-600 dark:hover:text-surface-300"
                v-tooltip.bottom="'Очистити глобальний фільтр'"
                @click="clearGlobalFilter"
              />
            </span>

            <div class="flex w-full justify-between gap-2 sm:w-max">
              <Button
                text
                plain
                rounded
                icon="pi pi-filter-slash"
                class="h-12 w-12 text-2xl"
                :class="
                  params?.filters && Object.keys(params.filters).length ? '!text-primary-600' : ''
                "
                v-tooltip.bottom="'Очистити фільтри'"
                @click="clearFilters"
              />

              <Button
                text
                plain
                rounded
                icon="pi pi-plus-circle"
                class="h-12 w-12 text-2xl"
                v-tooltip.bottom="'Створити запис'"
                @click="emits('toggleModal', {})"
              />

              <Button
                text
                plain
                rounded
                icon="pi pi-sync"
                class="h-12 w-12 text-2xl"
                v-tooltip.bottom="'Оновити записи'"
                @click="onUpdateRecords"
              />

              <slot name="actions" />

              <Button
                text
                plain
                rounded
                icon="pi pi-cog"
                class="h-12 w-12 text-2xl"
                v-tooltip.bottom="'Опції стовпців'"
                @click="onColumnsMenu"
              />
            </div>
          </div>
        </div>

        <slot name="subheader" />
      </template>

      <template #loading>
        <div class="flex items-center justify-center">
          <AppLoading />
        </div>
      </template>

      <template #empty>
        <div
          v-if="!loading && !records?.length"
          class="absolute left-0 z-20 flex h-full w-full items-stretch justify-center bg-none text-center"
          style="height: calc(100vh - 24rem)"
        >
          <div class="m-auto flex flex-col gap-2">
            <i class="pi pi-filter-slash text-7xl text-surface-500"></i>
            <h5 class="text-2xl font-semibold">Записів не знайдено</h5>
            <p class="text-base text-surface-500">Спробуйте змінити пошукові запити у фільтрі</p>
            <Button
              icon="pi pi-filter-slash text-sm"
              class="m-auto my-4 w-max"
              label="Очистити фільтри"
              @click="clearFilters"
            />
          </div>
        </div>
      </template>

      <template #paginatorstart>
        <div class="flex flex-wrap items-center justify-evenly gap-4 p-2 xl:justify-between">
          <div class="flex flex-wrap items-center justify-evenly gap-2">
            <Menu ref="refMenuActions" :model="menuActions" popup>
              <template #item="{ label, item, props, separator }">
                <hr v-if="item.label === '-'" />
                <a :href="item.url" v-bind="props.action" v-else>
                  <span v-bind="props.icon" />
                  <span v-bind="props.label">{{ label }}</span>
                </a>
              </template>
            </Menu>

            <Button
              text
              plain
              outlined
              label="Дії"
              class="h-10 w-full sm:w-max"
              @click="event => refMenuActions.toggle(event)"
            >
              <template #default>
                <i class="pi pi-sliders-h" />
                <span class="mx-2"> Опційні дії </span>
                <i class="pi pi-chevron-down" />
              </template>
            </Button>
          </div>
        </div>
      </template>

      <Column field="options" frozen :exportable="false" :reorderableColumn="false" class="w-6">
        <template #header>
          <Button
            text
            plain
            rounded
            icon="pi pi-cog"
            class="m-2 h-8 w-8 font-bold"
            v-tooltip.bottom="'Опції стовпців'"
            @click="onColumnsMenu"
          />
        </template>
        <template #body="{ data }">
          <Button
            text
            plain
            rounded
            icon="pi pi-ellipsis-v"
            class="m-2 h-8 w-8 font-bold"
            v-tooltip.bottom="'Додаткове меню'"
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
        :maxConstraints="3"
        :showFilterMenu="filtrable"
        :filterField="filter.field"
        :showFilterMatchModes="filter.showFilterMatchModes"
        :style="{ minWidth: header.width }"
        headerClass="font-bold text-center uppercase"
        class="max-w-80"
      >
        <template #header>
          <span class="mx-2">
            <i v-if="header?.icon" :class="header.icon" class="mr-2" />
            {{ header?.text }}
          </span>
        </template>

        <template #body="{ data, field }">
          <div class="overflow-hidden text-ellipsis whitespace-nowrap px-2">
            <component
              v-if="column?.render"
              :is="column?.render(getObjField(data, field))"
              @click="column?.action ? column?.action(data) : false"
            />
            <span v-else>{{ getObjField(data, field) }}</span>
          </div>
        </template>

        <template #filter="{ filterModel, applyFilter, filterCallback }">
          <div class="flex flex-col gap-2">
            <div
              class="flex items-center justify-between"
              v-if="
                filter?.matchMode === FilterMatchMode.IN ||
                filter?.matchMode === FilterMatchMode.EQUALS
              "
            >
              <label class="font-bold">
                <span class="uppercase">{{ header?.text }}</span>
              </label>

              <Button
                text
                plain
                rounded
                icon="pi pi-times"
                class="h-8 w-8 font-bold"
                @click="applyFilter"
              />
            </div>

            <MultiSelect
              filter
              display="chip"
              autoFilterFocus
              resetFilterOnHide
              :selectionLimit="10"
              :maxSelectedLabels="3"
              filterMatchMode="contains"
              v-model="filterModel.value"
              :dataKey="filter?.options?.key || 'id'"
              :optionValue="filter?.options?.value || 'id'"
              :optionLabel="filter?.options?.label || 'label'"
              :options="filter?.options?.records || []"
              :optionGroupLabel="filter?.options?.grouped ? 'group' : null"
              :optionGroupChildren="filter?.options?.grouped ? 'records' : null"
              placeholder="Пошук у базі даних"
              filterPlaceholder="Пошук у списку"
              :virtualScrollerOptions="{ itemSize: 32 }"
              class="my-4 w-96"
              :pt="{
                itemgroup: {
                  class: [
                    'font-bold m-0 py-3 px-5 cursor-auto',
                    'text-surface-800 dark:text-white/80',
                    'bg-surface-200 dark:bg-surface-900/80'
                  ]
                }
              }"
              @change="filterCallback"
              @before-show="
                async () => {
                  if (filter?.options?.records?.length) return;
                  const response = await filter.options.onRecords();
                  filter.options.records = [
                    {
                      group: 'Порожні значення',
                      records: [
                        {
                          [filter?.options?.value || 'id']: null,
                          [filter?.options?.label || 'label']: '-'
                        }
                      ]
                    },
                    ...response
                  ];
                }
              "
              v-if="filter?.matchMode === FilterMatchMode.IN"
            >
              <template #optiongroup="{ option }">
                <div class="flex h-full items-center justify-center text-base uppercase">
                  {{ option.group }}
                </div>
              </template>

              <template #option="{ option }">
                <div class="flex h-full items-center text-base">
                  {{ option[filter?.options?.label] }}
                </div>
              </template>
            </MultiSelect>

            <Dropdown
              showClear
              v-model="filterModel.value"
              :optionValue="filter.options.value || 'id'"
              :optionLabel="filter.options.label || 'id'"
              :options="filter?.options?.records || []"
              placeholder="Виберіть один запис"
              style="min-width: 12rem"
              @change="filterCallback"
              @before-show="
                async () => {
                  if (filter?.options?.records?.length) return;
                  filter.options.records = await filter.options.onRecords();
                }
              "
              v-else-if="filter?.matchMode === FilterMatchMode.EQUALS && filter?.options"
            >
              <template #option="slotProps">
                <Chip :label="slotProps.option[filter?.options?.label]" />
              </template>
            </Dropdown>

            <Calendar
              inline
              class="w-full"
              selectionMode="range"
              dateFormat="dd.mm.yy"
              placeholder="Виберіть дату"
              v-model="filterModel.value"
              v-else-if="filter?.matchMode === FilterMatchMode.DATE_IS"
            />

            <InputText
              type="text"
              v-model="filterModel.value"
              placeholder="Пошук за стовпцем"
              @keydown.enter="filterCallback()"
              v-else-if="filter?.matchMode === FilterMatchMode.CONTAINS"
            />

            <div
              class="flex flex-col items-center gap-3"
              v-else-if="filter?.matchMode === FilterMatchMode.EQUALS"
            >
              <TriStateCheckbox
                v-model="filterModel.value"
                inputId="verified-filter"
                @change="filterCallback"
              />
              <label for="verified-filter" class="font-bold">
                {{ header.text }} {{ filterModel.value == null ? '' : filterModel.value }}
              </label>
            </div>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
::v-deep(tr:hover) {
  background-color: var(--table-bg-hover) !important;
}

::v-deep(tr:hover > td) {
  background-color: var(--table-bg-hover) !important;
}

::v-deep(tr[data-pc-section='emptymessage']:hover) {
  background-color: transparent !important;
}

::v-deep(tr[data-pc-section='emptymessage']:hover > td) {
  background-color: transparent !important;
}

::v-deep(tr[data-pc-section='emptymessage'] > td) {
  border: none !important;
}
</style>
