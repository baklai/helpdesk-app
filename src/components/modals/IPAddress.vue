<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import BtnDBTable from '@/components/buttons/BtnDBTable.vue';

import { useIPAddress } from '@/stores/api/ipaddresses';
import { useOrganization } from '@/stores/api/organizations';
import { useSubdivision } from '@/stores/api/subdivisions';
import { useDepartment } from '@/stores/api/departments';
import { useLocation } from '@/stores/api/locations';
import { usePosition } from '@/stores/api/positions';
import { useUnit } from '@/stores/api/units';

import { dateToStr } from '@/service/DataFilters';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const { findOne, findOneByIP, createOne, updateOne, removeOne } = useIPAddress();

const Organization = useOrganization();
const Subdivision = useSubdivision();
const Department = useDepartment();
const Position = usePosition();
const Location = useLocation();
const Unit = useUnit();

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      date: yup.string().required(t('Value is required')),
      reqnum: yup.string().required(t('Value is required')),
      ipaddress: yup
        .string()
        .required(t('Value is required'))
        .test('ipaddress', 'Incorrect IP address', value => {
          const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
          const ipv6Pattern = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
          return ipv4Pattern.test(value) || ipv6Pattern.test(value);
        }),
      cidr: yup.object().required(t('Value is required')),
      fullname: yup.string().required(t('Value is required')),
      phone: yup.string().required(t('Value is required'))
    }),
    initialValues: {}
  });

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        const response = await findOne({ id, populate: false });
        setValues(response);
        if (response.organization) {
          subdivisions.value = await Subdivision.findAllByOrganizationId({
            id: response.organization
          });
        }
      } else {
        resetForm({ values: {} }, { force: true });
      }
      const [unit, location, organization, department, position] = await Promise.allSettled([
        Unit.findAll({}),
        Location.findAllGroured({}),
        Organization.findAll({}),
        Department.findAll({}),
        Position.findAll({})
      ]);
      units.value = unit.value;
      locations.value = location.value;
      organizations.value = organization.value;
      departments.value = department.value;
      positions.value = position.value;

      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

const visible = ref(false);

const CIDRS = ref([
  { value: 32, mask: '255.255.255.255' },
  { value: 31, mask: '255.255.255.254' },
  { value: 30, mask: '255.255.255.252' },
  { value: 29, mask: '255.255.255.248' },
  { value: 28, mask: '255.255.255.240' },
  { value: 27, mask: '255.255.255.224' },
  { value: 26, mask: '255.255.255.192' },
  { value: 25, mask: '255.255.255.128' },
  { value: 24, mask: '255.255.255.0' },
  { value: 23, mask: '255.255.254.0' },
  { value: 22, mask: '255.255.252.0' },
  { value: 21, mask: '255.255.248.0' },
  { value: 20, mask: '255.255.240.0' },
  { value: 19, mask: '255.255.224.0' },
  { value: 18, mask: '255.255.192.0' },
  { value: 17, mask: '255.255.128.0' },
  { value: 16, mask: '255.255.0.0' },
  { value: 15, mask: '255.254.0.0' },
  { value: 14, mask: '255.252.0.0' },
  { value: 13, mask: '255.248.0.0' },
  { value: 12, mask: '255.240.0.0' },
  { value: 11, mask: '255.224.0.0' },
  { value: 10, mask: '255.192.0.0' },
  { value: 9, mask: '255.128.0.0' },
  { value: 8, mask: '255.0.0.0' },
  { value: 7, mask: '254.0.0.0' },
  { value: 6, mask: '252.0.0.0' },
  { value: 5, mask: '248.0.0.0' },
  { value: 4, mask: '240.0.0.0' },
  { value: 3, mask: '224.0.0.0' },
  { value: 2, mask: '192.0.0.0' },
  { value: 1, mask: '128.0.0.0' },
  { value: 0, mask: '0.0.0.0' }
]);

const refMenu = ref();
const options = ref([
  {
    label: t('Create record'),
    icon: 'pi pi-plus-circle',
    command: async () => await onCreateRecord()
  },
  {
    label: t('Save record'),
    icon: 'pi pi-save',
    command: async () => await onSaveRecord()
  },
  {
    label: t('Delete record'),
    icon: 'pi pi-trash',
    command: async () => await onRemoveRecord()
  }
]);

const organizations = ref([]);
const subdivisions = ref([]);
const departments = ref([]);
const positions = ref([]);
const locations = ref([]);
const units = ref([]);

const [date, dateAttrs] = defineField('date');
const [reqnum, reqnumAttrs] = defineField('reqnum');
const [ipaddress, ipaddressAttrs] = defineField('ipaddress');
const [cidr, cidrAttrs] = defineField('cidr');
const [unit, unitAttrs] = defineField('unit');
const [location, locationAttrs] = defineField('location');
const [fullname, fullnameAttrs] = defineField('fullname');
const [phone, phoneAttrs] = defineField('phone');
const [position, positionAttrs] = defineField('position');
const [organization, organizationAttrs] = defineField('organization');
const [subdivision, subdivisionAttrs] = defineField('subdivision');
const [department, departmentAttrs] = defineField('department');
const [autoanswer, autoanswerAttrs] = defineField('autoanswer');
const [internetReqnum, internetReqnumAttrs] = defineField('internet.reqnum');
const [internetDateOpen, internetDateOpenAttrs] = defineField('internet.dateOpen');
const [internetDateClose, internetDateCloseAttrs] = defineField('internet.dateClose');
const [internetComment, internetCommentAttrs] = defineField('internet.comment');
const [comment, commentAttrs] = defineField('comment');

const onSubdivisionsUpdate = async event => {
  if (event?.value) {
    subdivisions.value = await Subdivision.findAllByOrganizationId({ id: event.value });
  } else {
    setValues({
      organization: null,
      subdivision: null
    });
    subdivisions.value = [];
  }
};

const checkIPAddress = async () => {
  if (!values?.ipaddress?.length) {
    return toast.add({
      severity: 'warn',
      summary: t('Warning'),
      detail: t('IP Address not entered'),
      life: 3000
    });
  }

  try {
    const { ipaddress } = await findOneByIP({ ipaddress: values.ipaddress });

    toast.add({
      severity: ipaddress ? 'warn' : 'info',
      summary: ipaddress ? t('Warning') : t('Information'),
      detail: ipaddress ? t('IP address is busy') : t('IP Address is free'),
      life: 5000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('Warning'),
      detail: t(err.message),
      life: 3000
    });
  }
};

const onCreateRecord = async () => {
  resetForm({ values: {} }, { force: true });
  toast.add({
    severity: 'success',
    summary: t('Information'),
    detail: t('Input new record'),
    life: 5000
  });
};

const onRemoveRecord = async () => {
  if (!values?.id) {
    return toast.add({
      severity: 'warn',
      summary: t('Warning'),
      detail: t('Record not selected'),
      life: 5000
    });
  }
  confirm.require({
    message: t('Do you want to delete this record?'),
    header: t('Confirm delete record'),
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      try {
        await removeOne(values);
        toast.add({
          severity: 'success',
          summary: t('Information'),
          detail: t('Record is removed'),
          life: 5000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: t('Warning'),
          detail: t('Record not removed'),
          life: 5000
        });
      } finally {
        visible.value = false;
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: t('Information'),
        detail: t('Record deletion not confirmed'),
        life: 5000
      });
    }
  });
};

const onSaveRecord = handleSubmit(async values => {
  try {
    if (values?.id) {
      await updateOne(values.id, controlledValues.value);
    } else {
      await createOne(controlledValues.value);
    }
    toast.add({
      severity: 'success',
      summary: t('Information'),
      detail: values?.id ? t('Record is updated') : t('Record is created'),
      life: 5000
    });
    visible.value = false;
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('Warning'),
      detail: values?.id ? t('Record not updated') : t('Record not created'),
      life: 5000
    });
  }
});

const onCloseModal = async () => {
  resetForm({ values: {} }, { force: true });
  emits('close', {});
};
</script>

<template>
  <Menu ref="refMenu" popup :model="options">
    <template #item="{ label, item, props }">
      <a :href="item.url" v-bind="props.action">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>
  </Menu>

  <Dialog
    modal
    closable
    :draggable="false"
    v-model:visible="visible"
    class="mx-auto w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] 2xl:w-[45vw]"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-between w-full">
        <div class="flex items-center justify-center">
          <AppIcons name="network-ipaddress" :size="42" class="mr-4" />
          <div>
            <p class="text-lg font-bold line-height-2">
              {{ $t('Network IP Address') }}
            </p>
            <p class="text-base font-semibold line-height-2 text-surface-500">
              {{ values?.id ? $t('Edit selected record') : $t('Create new record') }}
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <Button
            text
            plain
            rounded
            class="h-12 w-12"
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="$t('Options menu')"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <form class="flex flex-col gap-y-4 md:flex-row md:flex-wrap" @submit.prevent="onSaveRecord">
      <div class="flex flex-col space-y-4 md:w-1/2 md:pr-2">
        <div class="flex flex-col gap-2">
          <label for="date" class="font-bold">{{ $t('Date create') }}</label>
          <Calendar
            showIcon
            showButtonBar
            dateFormat="dd.mm.yy"
            inputId="date"
            v-model="date"
            v-bind="dateAttrs"
            :modelValue="dateToStr(values.date)"
            :placeholder="$t('Date create')"
            :invalid="!!errors?.date"
            aria-describedby="date-help"
            :pt="{
              dropdownbutton: {
                root: {
                  class: [
                    'relative',
                    'items-center inline-flex text-center align-bottom',
                    'rounded-r-md',
                    'px-4 py-3 leading-none',
                    'text-surface-500 dark:text-surface-300',
                    'border border-l-0 border-surface-300 dark:border-surface-600',
                    'hover:bg-surface-300/20 hover:dark:bg-surface-600/20'
                  ]
                }
              }
            }"
          />
          <small id="date-help" class="text-red-500" v-if="errors?.date">
            {{ $t(errors?.date) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="unit" class="font-bold">{{ $t('Unit') }}</label>
          <div class="flex flex-row gap-2">
            <Dropdown
              filter
              autofocus
              showClear
              resetFilterOnHide
              dataKey="id"
              optionValue="id"
              optionLabel="name"
              inputId="unit"
              v-model="unit"
              v-bind="unitAttrs"
              :options="units"
              :filterPlaceholder="$t('Search')"
              :placeholder="$t('Client unit')"
              :invalid="!!errors?.unit"
              aria-describedby="unit-help"
              :ptOptions="{ mergeSections: true, mergeProps: true }"
              :pt="{
                root: { class: ['w-full'] },
                input: { class: ['!whitespace-normal'] }
              }"
            />

            <BtnDBTable table="unit" />
          </div>
          <small id="unit-help" class="text-red-500" v-if="errors?.unit">
            {{ $t(errors?.unit) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex flex-col gap-2">
            <label for="ipaddress" class="font-bold">{{ $t('IP Address') }}</label>
            <div class="flex flex-row gap-2">
              <InputText
                id="ipaddress"
                v-model="ipaddress"
                v-bind="ipaddressAttrs"
                :disabled="!!values.id"
                :placeholder="$t('Client IP Address')"
                :invalid="!!errors?.ipaddress"
                class="w-full"
                v-tooltip.bottom="$t('Client IP Address')"
                @keypress.prevent.enter="checkIPAddress"
              />

              <Button
                outlined
                icon="pi pi-search"
                :class="[
                  'w-12 h-12',
                  'text-surface-500 dark:text-surface-300',
                  'border-surface-300 dark:border-surface-600',
                  'hover:bg-surface-300/20 hover:dark:bg-surface-600/20'
                ]"
                v-tooltip.bottom="$t('Check IP Address')"
                @click.prevent="checkIPAddress"
              />
            </div>
            <small id="ipaddress-help" class="text-red-500" v-if="errors?.ipaddress">
              {{ $t(errors?.ipaddress) }}
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <Dropdown
              filter
              autofocus
              showClear
              resetFilterOnHide
              inputId="cidr"
              v-model="cidr"
              v-bind="cidrAttrs"
              :options="CIDRS"
              :optionLabel="obj => `${obj.mask}/${obj.value}`"
              :filterPlaceholder="$t('Search')"
              :placeholder="$t('Mask IP Address')"
              :invalid="!!errors?.cidr"
              aria-describedby="cidr-help"
              v-tooltip.bottom="$t('Mask IP Address')"
              :ptOptions="{ mergeSections: true, mergeProps: true }"
              :pt="{
                root: { class: ['w-full'] },
                input: { class: ['!whitespace-normal'] }
              }"
            />
            <small id="cidr-help" class="text-red-500" v-if="errors?.cidr">
              {{ $t(errors?.cidr) }}
            </small>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label for="internet" class="font-bold">{{ $t('Internet') }}</label>
          <div class="flex flex-col gap-2" id="internet">
            <div class="flex flex-col gap-2">
              <InputText
                id="internetReqnum"
                v-model="internetReqnum"
                v-bind="internetReqnumAttrs"
                :placeholder="$t('Internet Letter number')"
                v-tooltip.bottom="$t('Internet Letter number')"
              />
            </div>

            <div class="flex flex-col gap-2">
              <Calendar
                showIcon
                showButtonBar
                dateFormat="dd.mm.yy"
                inputId="internetDateOpen"
                v-model="internetDateOpen"
                v-bind="internetDateOpenAttrs"
                :modelValue="dateToStr(values?.internet?.dateOpen)"
                :placeholder="$t('Date open internet')"
                v-tooltip.bottom="$t('Date open internet')"
                :pt="{
                  dropdownbutton: {
                    root: {
                      class: [
                        'relative',
                        'items-center inline-flex text-center align-bottom',
                        'rounded-r-md',
                        'px-4 py-3 leading-none',
                        'text-surface-500 dark:text-surface-300',
                        'border border-l-0 border-surface-300 dark:border-surface-600',
                        'hover:bg-surface-300/20 hover:dark:bg-surface-600/20'
                      ]
                    }
                  }
                }"
              />
            </div>

            <div class="flex flex-col gap-2">
              <Calendar
                showIcon
                showButtonBar
                dateFormat="dd.mm.yy"
                inputId="internetDateClose"
                v-model="internetDateClose"
                v-bind="internetDateCloseAttrs"
                :modelValue="dateToStr(values?.internet?.dateClose)"
                :placeholder="$t('Date close internet')"
                v-tooltip.bottom="$t('Date close internet')"
                :pt="{
                  dropdownbutton: {
                    root: {
                      class: [
                        'relative',
                        'items-center inline-flex text-center align-bottom',
                        'rounded-r-md',
                        'px-4 py-3 leading-none',
                        'text-surface-500 dark:text-surface-300',
                        'border border-l-0 border-surface-300 dark:border-surface-600',
                        'hover:bg-surface-300/20 hover:dark:bg-surface-600/20'
                      ]
                    }
                  }
                }"
              />
            </div>

            <div class="flex flex-col gap-2">
              <Textarea
                rows="7"
                id="internetComment"
                v-model="internetComment"
                v-bind="internetCommentAttrs"
                v-tooltip.bottom="$t('Comment')"
                :placeholder="$t('Comment')"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col space-y-4 md:w-1/2 md:pl-2">
        <div class="flex flex-col gap-2">
          <label for="reqnum" class="font-bold">{{ $t('Letter number') }}</label>
          <InputText
            id="reqnum"
            v-model="reqnum"
            v-bind="reqnumAttrs"
            :placeholder="$t('Letter number')"
            :invalid="!!errors?.reqnum"
            aria-describedby="reqnum-help"
          />
          <small id="reqnum-help" class="text-red-500" v-if="errors?.reqnum">
            {{ $t(errors?.reqnum) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="location" class="font-bold">{{ $t('Location') }}</label>
          <div class="flex flex-row gap-2">
            <Dropdown
              filter
              autofocus
              showClear
              resetFilterOnHide
              dataKey="id"
              optionValue="id"
              optionLabel="name"
              optionGroupLabel="group"
              optionGroupChildren="records"
              inputId="location"
              v-model="location"
              v-bind="locationAttrs"
              :options="locations"
              :filterPlaceholder="$t('Search')"
              :placeholder="$t('Client location')"
              :invalid="!!errors?.location"
              aria-describedby="location-help"
              :virtualScrollerOptions="{ itemSize: 32 }"
              :ptOptions="{ mergeSections: true, mergeProps: true }"
              :pt="{
                root: { class: ['w-full'] },
                input: { class: ['!whitespace-normal'] },
                itemgroup: {
                  class: [
                    'font-bold m-0 py-3 px-5 cursor-auto',
                    'text-surface-800 dark:text-white/80',
                    'bg-surface-200 dark:bg-surface-900/80'
                  ]
                }
              }"
            >
              <template #optiongroup="{ option }">
                <div class="flex items-center h-full justify-center text-base uppercase">
                  {{ option.group }}
                </div>
              </template>
              <template #option="{ option }">
                <div class="flex items-center h-full text-base">
                  {{ option.name }}
                </div>
              </template>
            </Dropdown>

            <BtnDBTable table="location" />
          </div>

          <small id="location-help" class="text-red-500" v-if="errors?.location">
            {{ $t(errors?.location) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="organizations" class="font-bold">{{ $t('Organization') }}</label>
          <div class="flex flex-col gap-2" id="organizations">
            <div class="flex flex-col gap-2">
              <div class="flex flex-row gap-2">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  inputId="organization"
                  v-model="organization"
                  v-bind="organizationAttrs"
                  :options="organizations"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client organization')"
                  v-tooltip.bottom="$t('Client organization')"
                  :invalid="!!errors?.organization"
                  aria-describedby="organization-help"
                  :ptOptions="{ mergeSections: true, mergeProps: true }"
                  :pt="{
                    root: { class: ['w-full'] },
                    input: { class: ['!whitespace-normal'] }
                  }"
                  @change="onSubdivisionsUpdate"
                />

                <BtnDBTable table="organization" />
              </div>

              <small id="organization-help" class="text-red-500" v-if="errors?.organization">
                {{ $t(errors?.organization) }}
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex flex-row gap-2">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  dataKey="id"
                  optionValue="id"
                  :optionLabel="
                    option => {
                      return option.code && option.code !== option.name
                        ? `${option.code} - ${option.name}`
                        : option.name;
                    }
                  "
                  inputId="subdivision"
                  v-model="subdivision"
                  v-bind="subdivisionAttrs"
                  :options="subdivisions"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client subdivision')"
                  v-tooltip.bottom="$t('Client subdivision')"
                  :invalid="!!errors?.subdivision"
                  aria-describedby="subdivision-help"
                  :ptOptions="{ mergeSections: true, mergeProps: true }"
                  :pt="{
                    root: { class: ['w-full'] },
                    input: { class: ['!whitespace-normal'] }
                  }"
                />

                <BtnDBTable table="subdivision" />
              </div>

              <small id="subdivision-help" class="text-red-500" v-if="errors?.subdivision">
                {{ $t(errors?.subdivision) }}
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex flex-row gap-2">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  inputId="department"
                  v-model="department"
                  v-bind="departmentAttrs"
                  :options="departments"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client department')"
                  v-tooltip.bottom="$t('Client department')"
                  :invalid="!!errors?.department"
                  aria-describedby="department-help"
                  :ptOptions="{ mergeSections: true, mergeProps: true }"
                  :pt="{
                    root: { class: ['w-full'] },
                    input: { class: ['!whitespace-normal'] }
                  }"
                />
                <BtnDBTable table="department" />
              </div>

              <small id="department-help" class="text-red-500" v-if="errors?.department">
                {{ $t(errors?.department) }}
              </small>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label for="client-info" class="font-bold">{{ $t('Client info') }}</label>
          <div class="flex flex-col gap-2" id="client-info">
            <div class="flex flex-col gap-2">
              <InputText
                id="fullname"
                v-model="fullname"
                v-bind="fullnameAttrs"
                :placeholder="$t('Client fullname')"
                :invalid="!!errors?.fullname"
                aria-describedby="fullname-help"
                v-tooltip.bottom="$t('Client fullname')"
              />
              <small id="fullname-help" class="text-red-500" v-if="errors?.fullname">
                {{ $t(errors?.fullname) }}
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <InputText
                id="phone"
                v-model="phone"
                v-bind="phoneAttrs"
                :placeholder="$t('Client phone')"
                :invalid="!!errors?.phone"
                aria-describedby="phone-help"
                v-tooltip.bottom="$t('Client phone')"
              />
              <small id="phone-help" class="text-red-500" v-if="errors?.phone">
                {{ $t(errors?.phone) }}
              </small>
            </div>

            <div class="flex flex-col gap-2">
              <div class="flex flex-row gap-2">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  inputId="position"
                  v-model="position"
                  v-bind="positionAttrs"
                  :options="positions"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client position')"
                  :invalid="!!errors?.position"
                  aria-describedby="position-help"
                  v-tooltip.bottom="$t('Client position')"
                  :ptOptions="{ mergeSections: true, mergeProps: true }"
                  :pt="{
                    root: { class: ['w-full'] },
                    input: { class: ['!whitespace-normal'] }
                  }"
                />

                <BtnDBTable table="position" />
              </div>

              <small id="position-help" class="text-red-500" v-if="errors?.position">
                {{ $t(errors?.position) }}
              </small>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label for="autoanswer" class="font-bold">{{ $t('Autoanswer') }}</label>
          <InputText
            id="autoanswer"
            v-model="autoanswer"
            v-bind="autoanswerAttrs"
            :placeholder="$t('Client autoanswer')"
          />
        </div>
      </div>

      <div class="w-full">
        <div class="flex flex-col gap-2">
          <label for="comment" class="font-bold">{{ $t('Comment') }}</label>
          <Textarea
            rows="5"
            id="comment"
            v-model="comment"
            v-bind="commentAttrs"
            :placeholder="$t('Comment')"
          />
        </div>
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = !visible" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
