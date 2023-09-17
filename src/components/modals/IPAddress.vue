<script setup>
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, ipAddress } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { dateToStr } from '@/service/DataFilters';
import { useIPAddress } from '@/stores/api/ipaddresses';
import { useСompany } from '@/stores/api/companies';
import { useBranch } from '@/stores/api/branches';
import { useLocation } from '@/stores/api/locations';
import { useDepartment } from '@/stores/api/departments';
import { useEnterprise } from '@/stores/api/enterprises';
import { usePosition } from '@/stores/api/positions';
import { useUnit } from '@/stores/api/units';

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

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        record.value = IPAddress.$init(await IPAddress.findOne({ id, populate: false }));
      } else {
        record.value = IPAddress.$init({});
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

const record = ref({});

const companies = ref([]);
const branches = ref([]);
const departments = ref([]);
const enterprises = ref([]);
const positions = ref([]);
const locations = ref([]);
const units = ref([]);

const $validate = useVuelidate(
  {
    date: { required },
    reqnum: { required },
    ipaddress: { required, ipAddress },
    cidr: { required },
    unit: { required },
    location: { required },
    fullname: { required },
    phone: { required },
    position: { required },
    company: { required },
    branch: { required },
    enterprise: { required },
    department: { required }
  },
  record
);

const checkIPAddress = async () => {
  const validIPAddress = await $validate.value.ipaddress.$validate();
  try {
    if (record.value?.ipaddress && validIPAddress) {
      const currentIP = await IPAddress.findOne({
        ipaddress: record.value.ipaddress,
        populate: false
      });
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
    toast.add({ severity: 'warn', summary: t('HD Warning'), detail: t(err.message), life: 3000 });
  }
};

const onCreateRecord = async () => {
  record.value = IPAddress.$init({});
  $validate.value.$reset();
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
      if (record.value?.id) {
        try {
          await IPAddress.removeOne(record.value);
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

const onSaveRecord = async () => {
  const valid = await $validate.value.$validate();
  if (valid) {
    if (record.value?.id) {
      try {
        await IPAddress.updateOne(record.value);
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
        await IPAddress.createOne(record.value);
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
  } else {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t('Fill in all required fields'),
      life: 3000
    });
  }
};

const onCloseModal = () => {
  record.value = IPAddress.$init({});
  $validate.value.$reset();
  emits('close', {});
};
</script>

<template>
  <Menu ref="refMenu" popup :model="options" />

  <Dialog
    modal
    closable
    :draggable="false"
    v-model:visible="visible"
    :style="{ width: '900px' }"
    class="p-fluid"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-content-between w-full">
        <div class="flex align-items-center justify-content-center">
          <AppIcons name="network-ip-address" :size="42" class="mr-2" />
          <div>
            <p class="text-lg font-bold line-height-2 mb-0">{{ $t('IP Address') }}</p>
            <p class="text-base font-normal line-height-2 text-color-secondary mb-0">
              {{ record?.id ? $t('Edit current record') : $t('Create new record') }}
            </p>
          </div>
        </div>
        <div class="flex gap-2 align-items-center">
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
        <div class="field col">
          <div class="field">
            <label for="date" class="font-bold">{{ $t('Date create') }}</label>
            <Calendar
              id="date"
              showIcon
              showButtonBar
              dateFormat="dd.mm.yy"
              aria-describedby="date-help"
              :modelValue="dateToStr(record.date)"
              v-model="record.date"
              :placeholder="$t('Date create')"
              :class="{ 'p-invalid': !!$validate.date.$errors.length }"
            />
            <small
              id="date-help"
              class="p-error"
              v-for="error in $validate.date.$errors"
              :key="error.$uid"
            >
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label for="reqnum" class="font-bold">{{ $t('Letter number') }}</label>
            <InputText
              id="reqnum"
              aria-describedby="reqnum-help"
              v-model="record.reqnum"
              :placeholder="$t('Letter number')"
              :class="{ 'p-invalid': !!$validate.reqnum.$errors.length }"
            />
            <small
              id="reqnum-help"
              class="p-error"
              v-for="error in $validate.reqnum.$errors"
              :key="error.$uid"
            >
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label for="unit" class="font-bold">{{ $t('Unit') }}</label>
            <Dropdown
              filter
              autofocus
              showClear
              resetFilterOnHide
              dataKey="id"
              optionValue="id"
              optionLabel="name"
              id="unit"
              aria-describedby="unit-help"
              v-model="record.unit"
              :options="units"
              :filterPlaceholder="$t('Search')"
              :placeholder="$t('Client unit')"
              :class="{ 'p-invalid': !!$validate.unit.$errors.length }"
            />
            <small
              id="unit-help"
              class="p-error"
              v-for="error in $validate.unit.$errors"
              :key="error.$uid"
            >
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label for="location" class="font-bold">{{ $t('Location') }}</label>
            <Dropdown
              filter
              autofocus
              showClear
              resetFilterOnHide
              id="location"
              aria-describedby="location-help"
              dataKey="id"
              optionValue="id"
              optionLabel="name"
              v-model="record.location"
              :options="locations"
              :filterPlaceholder="$t('Search')"
              :placeholder="$t('Client location')"
              :class="{ 'p-invalid': !!$validate.location.$errors.length }"
            />
            <small
              id="location-help"
              class="p-error"
              v-for="error in $validate.location.$errors"
              :key="error.$uid"
            >
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label for="ipaddress-sidr" class="font-bold">{{ $t('IP Address') }}</label>
            <div id="ipaddress-sidr" class="field">
              <div class="field">
                <span class="p-input-icon-right">
                  <i
                    class="pi pi-search cursor-pointer"
                    v-tooltip.bottom="$t('Check IP Address')"
                    @click.prevent="checkIPAddress"
                  />
                  <InputText
                    id="ipaddress"
                    aria-describedby="ipaddress-help"
                    v-model="record.ipaddress"
                    :placeholder="$t('Client IP Address')"
                    :class="{ 'p-invalid': !!$validate.ipaddress.$errors.length }"
                    @keypress.prevent.enter="checkIPAddress"
                  />
                </span>
                <small
                  id="ipaddress-help"
                  class="p-error"
                  v-for="error in $validate.ipaddress.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
                </small>
              </div>
              <div class="field">
                <Dropdown
                  id="cidr"
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  v-model="record.cidr"
                  :options="CIDRS"
                  :optionLabel="obj => `${obj.mask}/${obj.value}`"
                  aria-describedby="cidr-help"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Mask IP Address')"
                  :class="{ 'p-invalid': !!$validate.unit.$errors.length }"
                />
                <small
                  id="cidr-help"
                  class="p-error"
                  v-for="error in $validate.unit.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
                </small>
              </div>
            </div>
          </div>
          <div class="field">
            <label for="internet" class="font-bold">{{ $t('Internet') }}</label>
            <div id="internet" class="field">
              <div class="field">
                <InputText
                  id="internet-reqnum"
                  v-model="record.internet.reqnum"
                  :placeholder="$t('Internet Letter number')"
                />
              </div>

              <div class="field">
                <Calendar
                  showIcon
                  showButtonBar
                  dateFormat="dd.mm.yy"
                  id="internet-date-open"
                  :modelValue="dateToStr(record.internet.dateOpen)"
                  v-model="record.internet.dateOpen"
                  :placeholder="$t('Date open internet')"
                />
              </div>

              <div class="field">
                <Calendar
                  showIcon
                  showButtonBar
                  dateFormat="dd.mm.yy"
                  id="internet-date-close"
                  :modelValue="dateToStr(record.internet.dateClose)"
                  v-model="record.internet.dateClose"
                  :placeholder="$t('Date close internet')"
                />
              </div>

              <div class="field">
                <Textarea
                  rows="1"
                  cols="10"
                  id="internet-comment"
                  v-model="record.internet.comment"
                  :placeholder="$t('Comment')"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="field col">
          <div class="field">
            <label for="client-company" class="font-bold">{{ $t('Company') }}</label>
            <div id="client-company" class="field">
              <div class="field">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  id="company"
                  aria-describedby="company-help"
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  v-model="record.company"
                  :options="companies"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client company')"
                  :class="{ 'p-invalid': !!$validate.company.$errors.length }"
                />
                <small
                  id="company-help"
                  class="p-error"
                  v-for="error in $validate.company.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
                </small>
              </div>

              <div class="field">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  id="branch"
                  aria-describedby="branch-help"
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  v-model="record.branch"
                  :options="branches"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client branch')"
                  :class="{ 'p-invalid': !!$validate.branch.$errors.length }"
                />
                <small
                  id="branch-help"
                  class="p-error"
                  v-for="error in $validate.branch.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
                </small>
              </div>

              <div class="field">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  id="enterprise"
                  aria-describedby="enterprise-help"
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  v-model="record.enterprise"
                  :options="enterprises"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client enterprise')"
                  :class="{ 'p-invalid': !!$validate.enterprise.$errors.length }"
                />
                <small
                  id="enterprise-help"
                  class="p-error"
                  v-for="error in $validate.enterprise.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
                </small>
              </div>

              <div class="field">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  id="department"
                  aria-describedby="department-help"
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  v-model="record.department"
                  :options="departments"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client department')"
                  :class="{ 'p-invalid': !!$validate.department.$errors.length }"
                />
                <small
                  id="department-help"
                  class="p-error"
                  v-for="error in $validate.department.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
                </small>
              </div>
            </div>
          </div>

          <div class="field">
            <label for="client-info" class="font-bold">{{ $t('Client info') }}</label>
            <div id="client-info" class="field">
              <div class="field">
                <InputText
                  id="fullname"
                  aria-describedby="fullname-help"
                  v-model="record.fullname"
                  :placeholder="$t('Client fullname')"
                  :class="{ 'p-invalid': !!$validate.fullname.$errors.length }"
                />
                <small
                  id="fullname-help"
                  class="p-error"
                  v-for="error in $validate.fullname.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
                </small>
              </div>

              <div class="field">
                <InputText
                  id="phone"
                  v-model="record.phone"
                  aria-describedby="phone-help"
                  :placeholder="$t('Client phone')"
                  :class="{ 'p-invalid': !!$validate.phone.$errors.length }"
                />
                <small
                  id="phone-help"
                  class="p-error"
                  v-for="error in $validate.phone.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
                </small>
              </div>

              <div class="field">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  id="position"
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  aria-describedby="position-help"
                  v-model="record.position"
                  :options="positions"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client position')"
                  :class="{ 'p-invalid': !!$validate.position.$errors.length }"
                />
                <small
                  id="position-help"
                  class="p-error"
                  v-for="error in $validate.position.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
                </small>
              </div>
            </div>
          </div>

          <div class="field">
            <label for="autoanswer" class="font-bold">{{ $t('Autoanswer') }}</label>
            <InputText
              id="autoanswer"
              v-model="record.autoanswer"
              :placeholder="$t('Client autoanswer')"
            />
          </div>

          <div class="field">
            <label for="comment" class="font-bold">{{ $t('Comment') }}</label>
            <Textarea
              rows="7"
              cols="10"
              id="comment"
              class="outline-none"
              v-model="record.comment"
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
