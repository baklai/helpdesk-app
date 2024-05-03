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

const IPAddress = useIPAddress();
const Organization = useOrganization();
const Subdivision = useSubdivision();
const Department = useDepartment();
const Position = usePosition();
const Location = useLocation();
const Unit = useUnit();

const emits = defineEmits(['close']);

const {
  values,
  errors,
  handleSubmit,
  controlledValues,
  setValues,
  resetForm,
  defineComponentBinds
} = useForm({
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

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        setValues(await IPAddress.findOne({ id }));
      } else {
        resetForm({ values: {} }, { force: true });
      }
      const [unit, location, organization, department, position] = await Promise.allSettled([
        Unit.findAll({}),
        Location.findAll({}),
        Organization.findAll({}),
        Department.findAll({}),
        Position.findAll({})
      ]);
      units.value = unit.value;

      locations.value = location.value.reduce((acc, current) => {
        const regionIndex = acc.findIndex(item => item.region === current.region);
        if (regionIndex !== -1) {
          acc[regionIndex].items.push({
            id: current.id,
            name: current.name,
            region: current.region
          });
        } else {
          acc.push({
            region: current.region,
            items: [{ id: current.id, name: current.name, region: current.region }]
          });
        }
        return acc;
      }, []);

      organizations.value = organization.value;
      departments.value = department.value;
      positions.value = position.value;

      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

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

const visible = ref(false);

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

const date = defineComponentBinds('date');
const reqnum = defineComponentBinds('reqnum');
const ipaddress = defineComponentBinds('ipaddress');
const cidr = defineComponentBinds('cidr');
const unit = defineComponentBinds('unit');
const location = defineComponentBinds('location');
const fullname = defineComponentBinds('fullname');
const phone = defineComponentBinds('phone');
const position = defineComponentBinds('position');
const organization = defineComponentBinds('organization');
const subdivision = defineComponentBinds('subdivision');
const department = defineComponentBinds('department');
const autoanswer = defineComponentBinds('autoanswer');
const internetReqnum = defineComponentBinds('internet.reqnum');
const internetDateOpen = defineComponentBinds('internet.dateOpen');
const internetDateClose = defineComponentBinds('internet.dateClose');
const internetComment = defineComponentBinds('internet.comment');
const comment = defineComponentBinds('comment');

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
  try {
    if (values?.ipaddress) {
      const currentIP = await IPAddress.findOneByIP({ ipaddress: values.ipaddress });
      if (currentIP?.ipaddress) {
        toast.add({
          severity: 'warn',
          summary: t('HD Warning'),
          detail: t('IP address is busy'),
          life: 5000
        });
      } else {
        toast.add({
          severity: 'info',
          summary: t('HD Warning'),
          detail: t('IP Address is free'),
          life: 5000
        });
      }
    } else {
      toast.add({
        severity: 'warn',
        summary: t('HD Warning'),
        detail: t('IP Address not entered'),
        life: 3000
      });
    }
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t(err.message),
      life: 3000
    });
  }
};

const onCreateRecord = async () => {
  toast.add({
    severity: 'success',
    summary: t('HD Information'),
    detail: t('Input new record'),
    life: 3000
  });
};

const onRemoveRecord = async () => {
  confirm.require({
    message: t('Do you want to delete this record?'),
    header: t('Confirm delete record'),
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      if (values?.id) {
        try {
          await IPAddress.removeOne(values);
          toast.add({
            severity: 'success',
            summary: t('HD Information'),
            detail: t('Record is removed'),
            life: 3000
          });
        } catch (err) {
          toast.add({
            severity: 'warn',
            summary: t('HD Warning'),
            detail: t('Record not removed'),
            life: 3000
          });
        } finally {
          visible.value = false;
        }
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

const onSaveRecord = handleSubmit(async values => {
  if (values?.id) {
    try {
      await IPAddress.updateOne(values.id, controlledValues.value);
      visible.value = false;
      toast.add({
        severity: 'success',
        summary: t('HD Information'),
        detail: t('Record is updated'),
        life: 3000
      });
    } catch (err) {
      toast.add({
        severity: 'warn',
        summary: t('HD Warning'),
        detail: t('Record not updated'),
        life: 3000
      });
    }
  } else {
    try {
      await IPAddress.createOne(controlledValues.value);
      visible.value = false;
      toast.add({
        severity: 'success',
        summary: t('HD Information'),
        detail: t('Record is created'),
        life: 3000
      });
    } catch (err) {
      toast.add({
        severity: 'warn',
        summary: t('HD Warning'),
        detail: t('Record not created'),
        life: 3000
      });
    }
  }
});

const onCloseModal = () => {
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
    class="!w-[60rem]"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-between w-full">
        <div class="flex items-center justify-center">
          <AppIcons name="network-ipaddress" :size="42" class="mr-4" />
          <div>
            <p class="text-lg font-bold line-height-2">
              {{ $t('IP Address') }}
            </p>
            <p class="text-base font-normal line-height-2 text-surface-500">
              {{ values?.id ? $t('Edit selected record') : $t('Create new record') }}
            </p>
          </div>
        </div>

        <div class="flex items-center">
          <Button
            text
            plain
            rounded
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="$t('Options menu')"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <form
      @submit.prevent="onSaveRecord"
      class="flex flex-col justify-center gap-3 text-surface-800 dark:text-surface-100"
    >
      <div class="flex flex-row gap-x-4">
        <div class="flex flex-col w-1/2 gap-y-4">
          <div class="flex flex-col gap-2">
            <label for="date" class="font-bold">{{ $t('Date create') }}</label>
            <Calendar
              showIcon
              showButtonBar
              dateFormat="dd.mm.yy"
              inputId="date"
              v-bind="date"
              :modelValue="dateToStr(values.date)"
              :placeholder="$t('Date create')"
              :invalid="!!errors?.date"
              aria-describedby="date-help"
            />
            <small id="date-help" class="text-red-500" v-if="errors?.date">
              {{ $t(errors.date) }}
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="reqnum" class="font-bold">{{ $t('Letter number') }}</label>
            <InputText
              id="reqnum"
              v-bind="reqnum"
              :placeholder="$t('Letter number')"
              :invalid="!!errors?.reqnum"
              aria-describedby="reqnum-help"
            />
            <small id="reqnum-help" class="text-red-500" v-if="errors?.reqnum">
              {{ $t(errors.reqnum) }}
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="unit" class="font-bold">{{ $t('Unit') }}</label>
            <div class="flex flex-row w-full gap-2">
              <Dropdown
                filter
                autofocus
                showClear
                resetFilterOnHide
                dataKey="id"
                optionValue="id"
                optionLabel="name"
                inputId="unit"
                v-bind="unit"
                :options="units"
                :filterPlaceholder="$t('Search')"
                :placeholder="$t('Client unit')"
                :invalid="!!errors?.unit"
                aria-describedby="unit-help"
                class="w-full"
              />

              <BtnDBTable table="unit" />
            </div>

            <small id="unit-help" class="text-red-500" v-if="errors?.unit">
              {{ $t(errors.unit) }}
            </small>
          </div>

          <div class="flex flex-col gap-2">
            <label for="ipaddress" class="font-bold">{{ $t('IP Address') }}</label>
            <div class="flex flex-col gap-2">
              <span class="relative" aria-describedby="ipaddress-help">
                <InputText
                  id="ipaddress"
                  v-bind="ipaddress"
                  :disabled="!!values.id"
                  :placeholder="$t('Client IP Address')"
                  :invalid="!!errors?.ipaddress"
                  class="w-full pr-10"
                  @keypress.prevent.enter="checkIPAddress"
                />
                <i
                  class="pi pi-search cursor-pointer absolute top-2/4 -mt-2 right-3 text-surface-400 dark:text-surface-600 hover:!text-primary-500"
                  v-tooltip.bottom="$t('Check IP Address')"
                  @click.prevent="checkIPAddress"
                />
              </span>
              <small id="ipaddress-help" class="text-red-500" v-if="errors?.ipaddress">
                {{ $t(errors.ipaddress) }}
              </small>
            </div>
            <div class="flex flex-col gap-2">
              <Dropdown
                filter
                autofocus
                showClear
                resetFilterOnHide
                inputId="cidr"
                v-bind="cidr"
                :options="CIDRS"
                :optionLabel="obj => `${obj.mask}/${obj.value}`"
                :filterPlaceholder="$t('Search')"
                :placeholder="$t('Mask IP Address')"
                :invalid="!!errors?.cidr"
                aria-describedby="cidr-help"
              />
              <small id="cidr-help" class="text-red-500" v-if="errors?.cidr">
                {{ $t(errors.cidr) }}
              </small>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label for="autoanswer" class="font-bold">{{ $t('Autoanswer') }}</label>
            <InputText id="autoanswer" v-bind="autoanswer" :placeholder="$t('Client autoanswer')" />
          </div>

          <div class="flex flex-col gap-2">
            <label for="internet" class="font-bold">{{ $t('Internet') }}</label>
            <div class="flex flex-col gap-2" id="internet">
              <div class="flex flex-col gap-2">
                <InputText
                  id="internetReqnum"
                  v-bind="internetReqnum"
                  :placeholder="$t('Internet Letter number')"
                />
              </div>

              <div class="flex flex-col gap-2">
                <Calendar
                  showIcon
                  showButtonBar
                  dateFormat="dd.mm.yy"
                  inputId="internetDateOpen"
                  v-bind="internetDateOpen"
                  :modelValue="dateToStr(values?.internet?.dateOpen)"
                  :placeholder="$t('Date open internet')"
                />
              </div>

              <div class="flex flex-col gap-2">
                <Calendar
                  showIcon
                  showButtonBar
                  dateFormat="dd.mm.yy"
                  inputId="internetDateClose"
                  v-bind="internetDateClose"
                  :modelValue="dateToStr(values?.internet?.dateClose)"
                  :placeholder="$t('Date close internet')"
                />
              </div>

              <div class="flex flex-col gap-2">
                <Textarea
                  rows="3"
                  id="internetComment"
                  v-bind="internetComment"
                  :placeholder="$t('Comment')"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col w-1/2 gap-y-4">
          <div class="flex flex-col gap-2">
            <label for="location" class="font-bold">{{ $t('Location') }}</label>
            <div class="flex flex-row w-full gap-2">
              <Dropdown
                filter
                autofocus
                showClear
                resetFilterOnHide
                dataKey="id"
                optionValue="id"
                optionLabel="name"
                optionGroupLabel="region"
                optionGroupChildren="items"
                inputId="location"
                v-bind="location"
                :options="locations"
                :filterPlaceholder="$t('Search')"
                :placeholder="$t('Client location')"
                :invalid="!!errors?.location"
                aria-describedby="location-help"
                class="w-[25rem]"
                :virtualScrollerOptions="{ itemSize: 32 }"
                :pt="{
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
                    {{ option.region }}
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
              {{ $t(errors.location) }}
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
                    v-bind="organization"
                    :options="organizations"
                    :filterPlaceholder="$t('Search')"
                    :placeholder="$t('Client organization')"
                    :invalid="!!errors?.organization"
                    aria-describedby="organization-help"
                    class="w-[25rem]"
                    @change="onSubdivisionsUpdate"
                  />
                  <BtnDBTable table="organization" />
                </div>
                <small id="organization-help" class="text-red-500" v-if="errors?.organization">
                  {{ $t(errors.organization) }}
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
                    inputId="subdivision"
                    v-bind="subdivision"
                    :options="subdivisions"
                    :filterPlaceholder="$t('Search')"
                    :placeholder="$t('Client subdivision')"
                    :invalid="!!errors?.subdivision"
                    aria-describedby="subdivision-help"
                    class="w-[25rem]"
                  />
                  <BtnDBTable table="subdivision" />
                </div>
                <small id="subdivision-help" class="text-red-500" v-if="errors?.subdivision">
                  {{ $t(errors.subdivision) }}
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
                    v-bind="department"
                    :options="departments"
                    :filterPlaceholder="$t('Search')"
                    :placeholder="$t('Client department')"
                    :invalid="!!errors?.department"
                    aria-describedby="department-help"
                    class="w-[25rem]"
                  />
                  <BtnDBTable table="department" />
                </div>

                <small id="department-help" class="text-red-500" v-if="errors?.department">
                  {{ $t(errors.department) }}
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
                  v-bind="fullname"
                  :placeholder="$t('Client fullname')"
                  :invalid="!!errors?.fullname"
                  aria-describedby="fullname-help"
                />
                <small id="fullname-help" class="text-red-500" v-if="errors?.fullname">
                  {{ $t(errors.fullname) }}
                </small>
              </div>

              <div class="flex flex-col gap-2">
                <InputText
                  id="phone"
                  v-bind="phone"
                  :placeholder="$t('Client phone')"
                  :invalid="!!errors?.phone"
                  aria-describedby="phone-help"
                />
                <small id="phone-help" class="text-red-500" v-if="errors?.phone">
                  {{ $t(errors.phone) }}
                </small>
              </div>

              <div class="flex flex-col gap-2">
                <div class="flex flex-row w-full gap-2">
                  <Dropdown
                    filter
                    autofocus
                    showClear
                    resetFilterOnHide
                    dataKey="id"
                    optionValue="id"
                    optionLabel="name"
                    inputId="position"
                    v-bind="position"
                    :options="positions"
                    :filterPlaceholder="$t('Search')"
                    :placeholder="$t('Client position')"
                    :invalid="!!errors?.position"
                    aria-describedby="position-help"
                    class="w-[25rem]"
                  />

                  <BtnDBTable table="position" />
                </div>

                <small id="position-help" class="text-red-500" v-if="errors?.position">
                  {{ $t(errors.position) }}
                </small>
              </div>
            </div>
          </div>

          <div class="flex flex-col gap-2">
            <label for="comment" class="font-bold">{{ $t('Comment') }}</label>
            <Textarea
              rows="10"
              class="outline-none"
              id="comment"
              v-bind="comment"
              :placeholder="$t('Comment')"
            />
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = false" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
