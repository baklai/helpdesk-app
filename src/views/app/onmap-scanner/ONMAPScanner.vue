<script setup lang="jsx">
import { ref } from 'vue';
import * as yup from 'yup';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import { useForm } from 'vee-validate';
import { useToast } from 'primevue/usetoast';
import Panel from 'primevue/panel';
import HDDataTable from '@/components/tables/HDDataTable.vue';
import OptionsMenu from '@/components/menus/OptionsMenu.vue';
import ModalRecord from '@/components/modals/ONMAP.vue';
import SidebarRecord from '@/components/sidebars/ONMAP.vue';
import { dateTimeToStr } from '@/service/DataFilters';
import { useOnmap } from '@/stores/api/onmaps';

const toast = useToast();
const Onmap = useOnmap();

const refMenu = ref();
const refModal = ref();
const refSidebar = ref();
const refDataTable = ref();
const subheader = ref(false);

const { values, errors, handleSubmit, setFieldValue, resetForm, defineField } = useForm({
  validationSchema: yup.object({
    title: yup.string().required('Потрібно вказати значення'),
    target: yup
      .string()
      .required('Потрібно вказати значення')
      .test('ipaddress', 'Неправильна IP-адреса', value => {
        const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
        const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
        return ipv4Pattern.test(value) || ipv6Pattern.test(value);
      }),
    command: yup.string().required('Потрібно вказати значення')
  }),
  initialValues: {}
});

const [title, titleAttrs] = defineField('title');
const [target, targetAttrs] = defineField('target');
const [command, commandAttrs] = defineField('command');
const [profile, profileAttrs] = defineField('profile');

const SCAN_PROFILES = ref([
  { id: 'prf_1', name: 'Intense scan', flags: ['-T4', '-A', '-v'] },
  { id: 'prf_2', name: 'Intense scan plus UDP', flags: ['-sS', '-sU', '-T4', '-A', '-v'] },
  { id: 'prf_3', name: 'Intense scan, all TCP ports', flags: ['-p 1-65535', '-T4', '-A', '-v'] },
  { id: 'prf_4', name: 'Intense scan, no ping', flags: ['-T4', '-A', '-v', '-Pn'] },
  { id: 'prf_5', name: 'Ping scan', flags: ['-sn'] },
  { id: 'prf_7', name: 'Quick scan', flags: ['-T4', '-F'] },
  { id: 'prf_8', name: 'Quick scan plus', flags: ['-sV', '-T4', '-O', '-F', '--version-light'] },
  { id: 'prf_9', name: 'Quick traceroute', flags: ['-sn', '--traceroute'] }
]);

const globalFilter = ref({
  field: 'target',
  matchMode: FilterMatchMode.STARTS_WITH,
  placeholder: 'Пошук по цілі'
});

const columns = ref([
  {
    header: { text: 'Назва', width: '16rem' },
    column: {
      field: 'title',
      render(value) {
        return (
          <div class="cursor-pointer font-semibold">
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
    frozen: true
  },
  {
    header: { text: 'Статус', width: '10rem' },
    column: {
      field: 'upHost',
      render(value) {
        return (
          <Tag
            class={[
              '!w-1/3 !text-base !font-bold !text-white',
              value > 0 ? '!bg-green-500/80' : '!bg-gray-500/80'
            ]}
            value={value > 0 ? 'UP' : 'DOWN'}
          />
        );
      }
    },
    sorter: { field: 'upHost' },
    selectable: true,
    exportable: true,
    filtrable: false,
    sortable: true,
    frozen: true
  },
  {
    header: { text: 'Ціль', width: '15rem' },
    column: {
      field: 'target',
      render(value) {
        return <span class="cursor-pointer font-bold text-primary-500">{value}</span>;
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
    header: { text: 'Дата звіту', width: '15rem' },
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
    header: { text: 'Профіль', width: '16rem' },
    column: {
      field: 'profile',
      render(value) {
        return <span>{value}</span>;
      }
    },
    sorter: { field: 'profile' },
    filter: {
      field: 'profile',
      value: null,
      matchMode: FilterMatchMode.IN,
      options: {
        key: 'id',
        value: 'name',
        label: 'name',
        onRecords: () => {
          return SCAN_PROFILES.value;
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
    header: { text: 'Прапори', width: '15rem' },
    column: {
      field: 'flags',
      render(value) {
        return <span>{value?.join(' ') || '-'}</span>;
      }
    },
    selectable: true,
    exportable: true,
    filtrable: false,
    sortable: false,
    frozen: false
  }
]);

const runTargetScan = handleSubmit(async () => {
  try {
    await Onmap.createOne({
      title: values.title,
      target: values.target,
      profile: values.profile.name,
      flags: values.profile.flags
    });
    toast.add({
      severity: 'success',
      summary: 'Інформація',
      detail: 'Сканування завершено',
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Сканування перервано',
      life: 3000
    });
  } finally {
    refDataTable.value.update({});
  }
});
</script>

<template>
  <div class="flex h-full w-full">
    <OptionsMenu
      ref="refMenu"
      hostkey="host"
      @view="data => refModal.toggle(data)"
      @create="subheader = !subheader"
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
        {{ $route?.meta?.title }}
      </template>
      <template #subtitle>
        {{ $route?.meta?.description }}
      </template>
      <template #actions> </template>
      <template #subheader>
        <Panel class="my-4" v-show="subheader">
          <template #header>
            <div class="flex items-center">
              <span class="font-bold uppercase">Запуск сканера Onmap</span>
            </div>
          </template>
          <div class="flex flex-col justify-center gap-4">
            <div class="flex flex-row gap-4">
              <div class="flex flex-col gap-2 md:w-2/5">
                <label for="target">Мета сканування</label>
                <InputText
                  id="target"
                  class="w-full"
                  v-model="target"
                  v-bind="targetAttrs"
                  placeholder="Мета сканування"
                  :invalid="!!errors?.target"
                  aria-describedby="target-help"
                />
                <small id="target-help" class="text-red-500" v-if="errors?.target">
                  {{ errors.target }}
                </small>
              </div>

              <div class="flex flex-col gap-2 md:w-3/5">
                <label for="title">Заголовок сканування</label>
                <InputText
                  id="title"
                  class="w-full"
                  v-model="title"
                  v-bind="titleAttrs"
                  placeholder="Заголовок сканування"
                  :invalid="!!errors?.title"
                  aria-describedby="title-help"
                />
                <small id="title-help" class="text-red-500" v-if="errors?.title">
                  {{ errors.title }}
                </small>
              </div>
            </div>

            <div class="flex flex-row gap-4">
              <div class="flex flex-col gap-2 md:w-2/5">
                <label for="profile">Профіль</label>
                <Dropdown
                  filter
                  showClear
                  autofocus
                  optionLabel="name"
                  v-model="profile"
                  v-bind="profileAttrs"
                  :options="SCAN_PROFILES"
                  @change="
                    event => {
                      setFieldValue('command', event.value.flags.join(' '));
                    }
                  "
                  filterPlaceholder="Пошук у списку"
                  placeholder="Виберіть профіль сканування"
                  class="w-full"
                />
              </div>
              <div class="flex flex-col gap-2 md:w-3/5">
                <label for="command">Команда</label>
                <InputText
                  id="command"
                  class="w-full"
                  v-model="command"
                  v-bind="commandAttrs"
                  :readonly="true"
                  placeholder="Команда сканування"
                  :invalid="!!errors?.command"
                  aria-describedby="command-help"
                />
                <small id="command-help" class="text-red-500" v-if="errors?.command">
                  {{ errors.command }}
                </small>
              </div>
            </div>
          </div>
          <template #footer>
            <div class="flex flex-wrap items-center justify-between">
              <div class="flex items-center gap-2">
                <Button label="Сканувати" class="w-60" @click="runTargetScan" />
                <Button
                  outlined
                  class="w-40"
                  severity="secondary"
                  label="Скасувати"
                  @click="resetForm({ values: {} }, { force: true })"
                />
              </div>
            </div>
          </template>
        </Panel>
      </template>
    </HDDataTable>
    <SidebarRecord ref="refSidebar" @toggle-menu="(event, data) => refMenu.toggle(event, data)" />
  </div>
</template>
