<script setup lang="jsx">
import { ref, watch, defineAsyncComponent } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

const DataTable = defineAsyncComponent(() => import('primevue/datatable'));

import { getObjField } from '@/service/ObjectMethods';

const { t } = useI18n();
const toast = useToast();

const props = defineProps({
  columns: {
    type: Array,
    default: []
  },
  fields: {
    type: Object,
    default: null
  },
  filters: {
    type: Object,
    default: null
  },
  sorts: {
    type: Object,
    default: null
  },
  onUpdate: {
    type: Function,
    required: true
  }
});

const emits = defineEmits(['updateFields', 'updateSorts', 'updateFilters']);

const refDataTable = ref();
const keyDataTable = ref(0);
const refMenuColumns = ref();

const columns = ref([]);
const params = ref({});
const fields = ref([]);
const filters = ref({});
const records = ref([]);
const loading = ref(false);
const totalRecords = ref();
const offsetRecords = ref(0);
const recordsPerPage = ref(5);

const onColumnsMenu = event => {
  refMenuColumns.value.toggle(event);
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
      summary: t('Warning'),
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
  columns.value = await Promise.all(
    props.columns
      .filter(({ column }) => column?.field)
      .map(async ({ header, column, sorter, filter }) => {
        return {
          header: {
            text: header?.text || column.field,
            width: header?.width || '15rem'
          },
          column: {
            field: column.field,
            render(value) {
              return typeof column?.render === 'function' ? (
                column?.render(value)
              ) : (
                <span>{value || '-'}</span>
              );
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
          selectable: true,
          filtrable: filter ? true : false,
          sortable: sorter ? true : false
        };
      })
  );
};

const initFields = () => {
  fields.value = columns.value
    .filter(item => item.selectable)
    .reduce((acc, item) => {
      acc[item.column.field] = t(item.header.text);
      return acc;
    }, {});
  emits('updateFields', fields.value);
};

const initFilters = async () => {
  filters.value = {
    ...props.columns
      .filter(column => column?.filter)
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

const onSort = async event => {
  params.value.sort = sortConverter(event.multiSortMeta);
  emits('updateSorts', params.value.sort);
  await onUpdateRecords();
};

const onFilter = async event => {
  params.value.offset = 0;
  params.value.filters = filterConverter(event.filters);
  emits('updateFilters', params.value.filters);
  await onUpdateRecords();
};

const onReorder = event => {
  const { dragIndex, dropIndex } = event;
  if (dropIndex < 0 || dropIndex >= columns.value.length) return;
  const item = columns.value.splice(dragIndex, 1)[0];
  columns.value.splice(dropIndex, 0, item);
  initFields();
};

const onField = async () => {
  initFields();
};

const selectAllColumns = () => {
  columns.value
    .filter(col => !col.selectable)
    .forEach(col => {
      col.selectable = true;
    });
  initFields();
};

watch(
  () => props.columns,
  async (newValue, oldValue) => {
    loading.value = true;
    try {
      await initColumns();
      await initFilters();
      initParams();
      initFields();
      await onUpdateRecords();
    } catch (err) {
      records.value = [];
      toast.add({
        severity: 'warn',
        summary: t('Warning'),
        detail: t(err.message),
        life: 3000
      });
    } finally {
      loading.value = false;
    }
  },
  { immediate: true }
);
</script>

<template>
  <Menu popup ref="refMenuColumns" class="w-80 p-2">
    <template #start>
      <Listbox
        filter
        multiple
        class="w-full"
        :options="columns"
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
              @change="onField"
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
      <div class="flex w-full justify-between gap-3 pt-2">
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
      scrollable
      removableSort
      resizableColumns
      reorderableColumns
      ref="refDataTable"
      :key="keyDataTable"
      dataKey="id"
      sortMode="multiple"
      scrollHeight="flex"
      filterDisplay="menu"
      responsiveLayout="scroll"
      columnResizeMode="expand"
      :value="records"
      :loading="loading"
      v-model:filters="filters"
      style="min-height: 350px"
      class="min-w-full overflow-x-auto px-4 py-2 text-base"
      @column-reorder="onReorder"
      @filter="onFilter"
      @sort="onSort"
    >
      <template #header>
        <div class="flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-1">
            <slot name="icon" />
            <div class="flex flex-col">
              <h3 class="text-xl font-bold text-surface-900 dark:text-surface-50">
                <slot name="title" />
              </h3>
              <p class="text-base font-normal text-surface-500">
                <slot name="subtitle" />
              </p>
            </div>
          </div>
          <div class="flex w-full flex-wrap items-center justify-between gap-2 sm:w-max">
            <div class="flex w-full justify-between gap-2 sm:w-max">
              <Button
                text
                plain
                rounded
                icon="pi pi-filter-slash"
                class="h-12 w-12 text-2xl"
                :class="
                  params?.filters && Object.keys(params.filters)?.length ? '!text-primary-600' : ''
                "
                v-tooltip.bottom="$t('Clear filters')"
                @click="clearFilters"
              />

              <Button
                text
                plain
                rounded
                icon="pi pi-sync"
                class="h-12 w-12 text-2xl"
                v-tooltip.bottom="$t('Update records')"
                @click="onUpdateRecords"
              />

              <Button
                text
                plain
                rounded
                icon="pi pi-cog"
                class="h-12 w-12 text-2xl"
                v-tooltip.bottom="$t('Columns option')"
                @click="onColumnsMenu"
              />
            </div>
          </div>
        </div>
      </template>

      <template #empty>
        <div
          v-if="!loading && !records?.length"
          class="absolute left-0 z-20 flex h-full w-full items-stretch justify-center bg-none text-center"
          style="height: calc(100vh - 65rem)"
        >
          <div class="m-auto flex flex-col gap-2">
            <i class="pi pi-filter-slash text-4xl text-surface-500"></i>
            <h5 class="text-xl font-semibold">{{ $t('No records found') }}</h5>
            <p class="text-base text-surface-500">
              {{ $t('Try changing the search terms in the filter') }}
            </p>
            <Button
              size="small"
              icon="pi pi-filter-slash text-sm"
              class="m-auto my-4 w-max"
              :label="$t('Clear filters')"
              @click="clearFilters"
            />
          </div>
        </div>
      </template>

      <Column
        v-for="({ header, column, filter, sortable, filtrable, selectable }, index) of columns"
        reorderableColumn
        :hidden="!selectable"
        :key="`${column.field}-${index}`"
        :field="column.field"
        :sortable="sortable"
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
            {{ $t(header?.text) }}
          </span>
        </template>

        <template #body="{ data, field }">
          <div class="overflow-hidden text-ellipsis whitespace-nowrap px-2">
            <component v-if="column?.render" :is="column?.render(getObjField(data, field))" />
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
                <span class="uppercase">{{ $t(header?.text) }}</span>
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
              :placeholder="$t('Search in database')"
              :filterPlaceholder="$t('Search in list')"
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
                      group: $t('Empty values'),
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
              :placeholder="$t('Select one record')"
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
              :placeholder="$t('Select date')"
              v-model="filterModel.value"
              v-else-if="filter?.matchMode === FilterMatchMode.DATE_IS"
            />

            <InputText
              type="text"
              v-model="filterModel.value"
              :placeholder="$t('Search by column')"
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
                {{ $t(header.text) }} {{ filterModel.value == null ? '' : filterModel.value }}
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
