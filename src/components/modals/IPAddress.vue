<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { useIPAddress } from '@/stores/api/ipaddresses';
import { useСompany } from '@/stores/api/companies';
import { useBranch } from '@/stores/api/branches';
import { useLocation } from '@/stores/api/locations';
import { useDepartment } from '@/stores/api/departments';
import { useEnterprise } from '@/stores/api/enterprises';
import { usePosition } from '@/stores/api/positions';
import { useUnit } from '@/stores/api/units';

import { dateToStr } from '@/service/DataFilters';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const IPAddress = useIPAddress();
const Сompany = useСompany();
const Branch = useBranch();
const Department = useDepartment();
const Enterprise = useEnterprise();
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
    unit: yup.string().required(t('Value is required')),
    location: yup.string().required(t('Value is required')),
    fullname: yup.string().required(t('Value is required')),
    phone: yup.string().required(t('Value is required')),
    position: yup.string().required(t('Value is required')),
    company: yup.string().required(t('Value is required')),
    branch: yup.string().required(t('Value is required')),
    enterprise: yup.string().required(t('Value is required')),
    department: yup.string().required(t('Value is required'))
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
      const [unit, location, company, branch, enterprise, department, position] =
        await Promise.allSettled([
          Unit.findAll({}),
          Location.findAll({}),
          Сompany.findAll({}),
          Branch.findAll({}),
          Enterprise.findAll({}),
          Department.findAll({}),
          Position.findAll({})
        ]);
      units.value = unit.value;
      locations.value = location.value;
      companies.value = company.value;
      branches.value = branch.value;
      enterprises.value = enterprise.value;
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

const companies = ref([]);
const branches = ref([]);
const departments = ref([]);
const enterprises = ref([]);
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
const company = defineComponentBinds('company');
const branch = defineComponentBinds('branch');
const enterprise = defineComponentBinds('enterprise');
const department = defineComponentBinds('department');
const autoanswer = defineComponentBinds('autoanswer');
const internetReqnum = defineComponentBinds('internet.reqnum');
const internetDateOpen = defineComponentBinds('internet.dateOpen');
const internetDateClose = defineComponentBinds('internet.dateClose');
const internetComment = defineComponentBinds('internet.comment');
const comment = defineComponentBinds('comment');

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
    header: t('HD Confirm delete record'),
    icon: 'pi pi-info-circle text-yellow-500',
    acceptIcon: 'pi pi-check',
    acceptClass: 'p-button-danger',
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
    :style="{ width: '900px' }"
    class=""
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-between w-full">
        <div class="flex items-center justify-center">
          <AppIcons name="network-ip-address" :size="42" class="mr-2" />
          <div>
            <p class="text-lg font-bold line-height-2 mb-2">
              {{ $t('IP Address') }}
            </p>
            <p class="text-base font-normal line-height-2 text-color-secondary mb-0">
              {{ values?.id ? $t('Edit selected record') : $t('Create new record') }}
            </p>
          </div>
        </div>
        <div class="flex gap-2 items-center">
          <Button
            text
            plain
            rounded
            class="mx-2"
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="$t('Options menu')"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <form @submit.prevent="onSaveRecord">
      <div class="formgrid grid">
        <div class="col">
          <div class="">
            <label for="date" class="font-bold">{{ $t('Date create') }}</label>
            <Calendar
              showIcon
              showButtonBar
              dateFormat="dd.mm.yy"
              inputId="date"
              v-bind="date"
              :modelValue="dateToStr(values.date)"
              :placeholder="$t('Date create')"
              :class="{ 'p-invalid': !!errors?.date }"
              aria-describedby="date-help"
            />
            <small id="date-help" class="text-red-500" v-if="errors?.date">
              {{ $t(errors.date) }}
            </small>
          </div>

          <div class="">
            <label for="reqnum" class="font-bold">{{ $t('Letter number') }}</label>
            <InputText
              id="reqnum"
              v-bind="reqnum"
              :placeholder="$t('Letter number')"
              :class="{ 'p-invalid': !!errors?.reqnum }"
              aria-describedby="reqnum-help"
            />
            <small id="reqnum-help" class="text-red-500" v-if="errors?.reqnum">
              {{ $t(errors.reqnum) }}
            </small>
          </div>

          <div class="">
            <label for="unit" class="font-bold">{{ $t('Unit') }}</label>
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
              :class="{ 'p-invalid': !!errors?.unit }"
              aria-describedby="unit-help"
            />
            <small id="unit-help" class="text-red-500" v-if="errors?.unit">
              {{ $t(errors.unit) }}
            </small>
          </div>

          <div class="">
            <label for="location" class="font-bold">{{ $t('Location') }}</label>
            <Dropdown
              filter
              autofocus
              showClear
              resetFilterOnHide
              dataKey="id"
              optionValue="id"
              optionLabel="name"
              inputId="location"
              v-bind="location"
              :options="locations"
              :filterPlaceholder="$t('Search')"
              :placeholder="$t('Client location')"
              :class="{ 'p-invalid': !!errors?.location }"
              aria-describedby="location-help"
            />
            <small id="location-help" class="text-red-500" v-if="errors?.location">
              {{ $t(errors.location) }}
            </small>
          </div>

          <div class="">
            <label for="ipaddress" class="font-bold">{{ $t('IP Address') }}</label>
            <div class="">
              <span class="p-input-icon-right" aria-describedby="ipaddress-help">
                <i
                  class="pi pi-search cursor-pointer"
                  v-tooltip.bottom="$t('Check IP Address')"
                  @click.prevent="checkIPAddress"
                />
                <InputText
                  id="ipaddress"
                  v-bind="ipaddress"
                  :disabled="!!values.id"
                  :placeholder="$t('Client IP Address')"
                  :class="{ 'p-invalid': !!errors?.ipaddress }"
                  @keypress.prevent.enter="checkIPAddress"
                />
              </span>
              <small id="ipaddress-help" class="text-red-500" v-if="errors?.ipaddress">
                {{ $t(errors.ipaddress) }}
              </small>
            </div>
            <div class="">
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
                :class="{ 'p-invalid': !!errors?.cidr }"
                aria-describedby="cidr-help"
              />
              <small id="cidr-help" class="text-red-500" v-if="errors?.cidr">
                {{ $t(errors.cidr) }}
              </small>
            </div>
          </div>

          <div class="">
            <label for="internet" class="font-bold">{{ $t('Internet') }}</label>
            <div class="" id="internet">
              <div class="">
                <InputText
                  id="internetReqnum"
                  v-bind="internetReqnum"
                  :placeholder="$t('Internet Letter number')"
                />
              </div>

              <div class="">
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

              <div class="">
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

              <div class="">
                <Textarea
                  rows="1"
                  cols="10"
                  id="internetComment"
                  v-bind="internetComment"
                  :placeholder="$t('Comment')"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="col">
          <div class="">
            <label for="companies" class="font-bold">{{ $t('Company') }}</label>
            <div class="" id="companies">
              <div class="">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  inputId="company"
                  v-bind="company"
                  :options="companies"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client company')"
                  :class="{ 'p-invalid': !!errors?.company }"
                  aria-describedby="company-help"
                />
                <small id="company-help" class="text-red-500" v-if="errors?.company">
                  {{ $t(errors.company) }}
                </small>
              </div>

              <div class="">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  inputId="branch"
                  v-bind="branch"
                  :options="branches"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client branch')"
                  :class="{ 'p-invalid': !!errors?.branch }"
                  aria-describedby="branch-help"
                />
                <small id="branch-help" class="text-red-500" v-if="errors?.branch">
                  {{ $t(errors.branch) }}
                </small>
              </div>

              <div class="">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  inputId="enterprise"
                  v-bind="enterprise"
                  :options="enterprises"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client enterprise')"
                  :class="{ 'p-invalid': !!errors?.enterprise }"
                  aria-describedby="enterprise-help"
                />
                <small id="enterprise-help" class="text-red-500" v-if="errors?.enterprise">
                  {{ $t(errors.enterprise) }}
                </small>
              </div>

              <div class="">
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
                  :class="{ 'p-invalid': !!errors?.department }"
                  aria-describedby="department-help"
                />
                <small id="department-help" class="text-red-500" v-if="errors?.department">
                  {{ $t(errors.department) }}
                </small>
              </div>
            </div>
          </div>

          <div class="">
            <label for="client-info" class="font-bold">{{ $t('Client info') }}</label>
            <div class="" id="client-info">
              <div class="">
                <InputText
                  id="fullname"
                  v-bind="fullname"
                  :placeholder="$t('Client fullname')"
                  :class="{ 'p-invalid': !!errors?.fullname }"
                  aria-describedby="fullname-help"
                />
                <small id="fullname-help" class="text-red-500" v-if="errors?.fullname">
                  {{ $t(errors.fullname) }}
                </small>
              </div>

              <div class="">
                <InputText
                  id="phone"
                  v-bind="phone"
                  :placeholder="$t('Client phone')"
                  :class="{ 'p-invalid': !!errors?.phone }"
                  aria-describedby="phone-help"
                />
                <small id="phone-help" class="text-red-500" v-if="errors?.phone">
                  {{ $t(errors.phone) }}
                </small>
              </div>

              <div class="">
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
                  :class="{ 'p-invalid': !!errors?.position }"
                  aria-describedby="position-help"
                />
                <small id="position-help" class="text-red-500" v-if="errors?.position">
                  {{ $t(errors.position) }}
                </small>
              </div>
            </div>
          </div>

          <div class="">
            <label for="autoanswer" class="font-bold">{{ $t('Autoanswer') }}</label>
            <InputText id="autoanswer" v-bind="autoanswer" :placeholder="$t('Client autoanswer')" />
          </div>

          <div class="">
            <label for="comment" class="font-bold">{{ $t('Comment') }}</label>
            <Textarea
              rows="7"
              cols="10"
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

<style scoped>
::v-deep(.p-calendar-w-btn .p-datepicker-trigger.p-button) {
  color: var(--text-color-secondary);
}
::v-deep(.p-dropdown .p-dropdown-label.p-placeholder) {
  color: var(--surface-400);
}
::v-deep(.p-datatable .p-datatable-header) {
  background: transparent;
}

::v-deep(.p-datatable-thead) {
  display: none;
}
</style>
