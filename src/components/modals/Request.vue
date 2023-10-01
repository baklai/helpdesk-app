<script setup>
import { ref, computed, inject } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { useRequest } from '@/stores/api/requests';
import { useIPAddress } from '@/stores/api/ipaddresses';
import { useСompany } from '@/stores/api/companies';
import { useBranch } from '@/stores/api/branches';
import { useLocation } from '@/stores/api/locations';
import { useDepartment } from '@/stores/api/departments';
import { useEnterprise } from '@/stores/api/enterprises';
import { usePosition } from '@/stores/api/positions';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const $helpdesk = inject('helpdesk');

const { findAll, createOne, updateOne, removeOne } = useRequest();

const IPAddress = useIPAddress();
const Company = useСompany();
const Branch = useBranch();
const Department = useDepartment();
const Enterprise = useEnterprise();
const Position = usePosition();
const Location = useLocation();

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
    ipaddress: yup.string().required(),
    fullname: yup.string().required(),
    phone: yup.string().required(),
    position: yup.string().required(),
    location: yup.string().required(),
    company: yup.string().required(),
    branch: yup.string().required(),
    enterprise: yup.string().required(),
    department: yup.string().required(),
    request: yup.string().required()
  }),
  initialValues: {}
});

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        setValues(await findOne({ id, populate: false }));
      }

      const [company, branch, department, enterprise, position, location] =
        await Promise.allSettled([
          Company.findAll({}),
          Branch.findAll({}),
          Department.findAll({}),
          Enterprise.findAll({}),
          Position.findAll({}),
          Location.findAll({})
        ]);
      companies.value = company.value;
      branches.value = branch.value;
      departments.value = department.value;
      enterprises.value = enterprise.value;
      positions.value = position.value;
      locations.value = location.value;

      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

const visible = ref(false);

const companies = ref([]);
const branches = ref([]);
const departments = ref([]);
const enterprises = ref([]);
const positions = ref([]);
const locations = ref([]);

const ipaddress = defineComponentBinds('ipaddress');
const fullname = defineComponentBinds('fullname');
const phone = defineComponentBinds('phone');
const position = defineComponentBinds('position');
const location = defineComponentBinds('location');
const company = defineComponentBinds('company');
const branch = defineComponentBinds('branch');
const enterprise = defineComponentBinds('enterprise');
const department = defineComponentBinds('department');
const request = defineComponentBinds('request');
const reqnum = defineComponentBinds('reqnum');
const conclusion = defineComponentBinds('conclusion');
const comment = defineComponentBinds('comment');

const isClosed = computed(() => {
  return !values?.closed ? false : true;
});

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
    disabled: isClosed,
    command: async () => await onSaveRecord()
  },
  {
    label: t('Delete record'),
    icon: 'pi pi-trash',
    command: async () => await onRemoveRecord()
  }
]);

const onCloseModal = () => {
  resetForm({ values: {} }, { force: true });
  emits('close', {});
};

const findOneIPAddress = async () => {
  try {
    if (values?.ipaddress) {
      const record = await IPAddress.findOne({
        ipaddress: values.ipaddress,
        populate: false
      });
      if (record?.ipaddress) {
        setValues({
          ipaddress: record?.ipaddress || null,
          location: record?.location || null,
          fullname: record?.fullname || null,
          phone: record?.phone || null,
          position: record?.position || null,
          company: record?.company || null,
          branch: record?.branch || null,
          enterprise: record?.enterprise || null,
          department: record?.department || null
        });
      } else {
        toast.add({
          severity: 'warn',
          summary: t('HD Warning'),
          detail: t('IP Address not found'),
          life: 3000
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
  resetForm({ values: {} }, { force: true });
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
          await removeOne(values);
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

const onSaveRecord = handleSubmit(async () => {
  if (values?.id) {
    try {
      await updateOne(values.id, { ...controlledValues.value, closed: values.closed });
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
      await createOne({
        ...controlledValues.value,
        workerOpen: $helpdesk?.user?.id || null
      });
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

const onSaveClosedRecord = handleSubmit(async () => {
  setValues({
    closed: true,
    workerClose: $helpdesk?.user?.id || null
  });

  await onSaveRecord();
});
</script>

<template>
  <Menu ref="refMenu" popup :model="options" />

  <Dialog
    modal
    closable
    :draggable="false"
    v-model:visible="visible"
    :style="{ width: '800px' }"
    class="p-fluid"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-content-between w-full">
        <div class="flex align-items-center justify-content-center">
          <AppIcons name="helpdesk-live-log" :size="40" class="mr-2" />
          <div>
            <p class="text-lg font-bold line-height-2 mb-0">
              {{ $t('Help Desk Live Log') }}
            </p>
            <p class="text-base font-normal line-height-2 text-color-secondary mb-0">
              {{ values?.id ? $t('Edit selected record') : $t('Create new record') }}
            </p>
            <p class="text-base font-normal line-height-2 text-color-secondary mb-0">
              {{ $t('Status') }} :
              {{ values?.closed ? $t('Request closed') : $t('Request opened') }}
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
            <label class="font-bold">{{ $t('Client request') }}</label>
            <Textarea
              rows="8"
              cols="10"
              v-bind="request"
              :disabled="isClosed"
              :placeholder="$t('Client request')"
              :class="{ 'p-invalid': !!errors?.request }"
            />
            <small class="p-error" v-if="errors?.request">
              {{ $t(errors.request) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Letter number') }}</label>
            <InputText
              aria-describedby="reqnum-help"
              v-bind="reqnum"
              :disabled="isClosed"
              :placeholder="$t('Letter number')"
            />
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('IP Address') }}</label>
            <span class="p-input-icon-right">
              <i
                class="pi pi-search cursor-pointer"
                v-tooltip.bottom="$t('Find IP Address')"
                @click.prevent="findOneIPAddress"
              />
              <InputText
                v-bind="ipaddress"
                :disabled="isClosed"
                :placeholder="$t('Client IP Address')"
                :class="{ 'p-invalid': !!errors?.ipaddress }"
                @keypress.enter="findOneIPAddress"
              />
            </span>
            <small class="p-error" v-if="errors?.ipaddress">
              {{ $t(errors.ipaddress) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Conclusion for request') }}</label>
            <Textarea
              rows="5"
              cols="10"
              aria-describedby="conclusion-help"
              v-bind="conclusion"
              :disabled="isClosed"
              :placeholder="$t('Conclusion')"
            />
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Comment') }}</label>
            <Textarea
              rows="3"
              cols="10"
              v-bind="comment"
              :disabled="isClosed"
              :placeholder="$t('Comment')"
            />
          </div>
        </div>

        <div class="field col">
          <div class="field">
            <label class="font-bold">{{ $t('Client info') }}</label>
            <div class="field">
              <div class="field">
                <InputText
                  v-bind="fullname"
                  :disabled="isClosed"
                  :placeholder="$t('Client fullname')"
                  :class="{ 'p-invalid': !!errors?.fullname }"
                />
                <small class="p-error" v-if="errors?.fullname">
                  {{ $t(errors.fullname) }}
                </small>
              </div>

              <div class="field">
                <InputText
                  v-bind="phone"
                  :disabled="isClosed"
                  :placeholder="$t('Client phone')"
                  :class="{ 'p-invalid': !!errors?.phone }"
                />
                <small class="p-error" v-if="errors?.phone">
                  {{ $t(errors.phone) }}
                </small>
              </div>

              <div class="field">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  v-bind="position"
                  :disabled="isClosed"
                  :options="positions"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client position')"
                  :class="{ 'p-invalid': !!errors?.position }"
                />
                <small class="p-error" v-if="errors?.position">
                  {{ $t(errors.position) }}
                </small>
              </div>
            </div>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Location') }}</label>
            <Dropdown
              filter
              autofocus
              showClear
              resetFilterOnHide
              dataKey="id"
              optionValue="id"
              optionLabel="name"
              v-bind="location"
              :disabled="isClosed"
              :options="locations"
              :filterPlaceholder="$t('Search')"
              :placeholder="$t('Client location')"
              :class="{ 'p-invalid': !!errors?.location }"
            />
            <small class="p-error" v-if="errors?.location">
              {{ $t(errors.location) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Company') }}</label>
            <div class="field">
              <div class="field">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  v-bind="company"
                  :disabled="isClosed"
                  :options="companies"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client company')"
                  :class="{ 'p-invalid': !!errors?.company }"
                />
                <small class="p-error" v-if="errors?.company">
                  {{ $t(errors.company) }}
                </small>
              </div>

              <div class="field">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  v-bind="branch"
                  :disabled="isClosed"
                  :options="branches"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client branch')"
                  :class="{ 'p-invalid': !!errors?.branch }"
                />
                <small class="p-error" v-if="errors?.branch">
                  {{ $t(errors.branch) }}
                </small>
              </div>

              <div class="field">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  v-bind="enterprise"
                  :disabled="isClosed"
                  :options="enterprises"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client enterprise')"
                  :class="{ 'p-invalid': !!errors?.enterprise }"
                />
                <small class="p-error" v-if="errors?.enterprise">
                  {{ $t(errors.enterprise) }}
                </small>
              </div>

              <div class="field">
                <Dropdown
                  filter
                  autofocus
                  showClear
                  resetFilterOnHide
                  dataKey="id"
                  optionValue="id"
                  optionLabel="name"
                  v-bind="department"
                  :disabled="isClosed"
                  :options="departments"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client department')"
                  :class="{ 'p-invalid': !!errors?.department }"
                />
                <small class="p-error" v-if="errors?.department">
                  {{ $t(errors.department) }}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = false" />
      <Button
        text
        plain
        icon="pi pi-check"
        :label="$t('Save')"
        :disabled="isClosed"
        v-show="!isClosed"
        @click="onSaveRecord"
      />
      <Button
        text
        plain
        icon="pi pi-check-circle"
        :label="$t('Save and closed')"
        :disabled="isClosed"
        v-show="!isClosed"
        @click="onSaveClosedRecord"
      />
    </template>
  </Dialog>
</template>

<style scoped>
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
