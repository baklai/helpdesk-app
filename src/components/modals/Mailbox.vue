<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { dateToStr } from '@/service/DataFilters';
import { useMailbox } from '@/stores/api/mailboxes';
import { useСompany } from '@/stores/api/companies';
import { useBranch } from '@/stores/api/branches';
import { useLocation } from '@/stores/api/locations';
import { useDepartment } from '@/stores/api/departments';
import { useEnterprise } from '@/stores/api/enterprises';
import { usePosition } from '@/stores/api/positions';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const { findOne, createOne, updateOne, removeOne } = useMailbox();

const Location = useLocation();
const Сompany = useСompany();
const Branch = useBranch();
const Enterprise = useEnterprise();
const Department = useDepartment();
const Position = usePosition();

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
    reqnum: yup.string().required(),
    login: yup.string().required(),
    fullname: yup.string().required(),
    phone: yup.string().required(),
    dateOpen: yup.string().required(),
    location: yup.string().required(),
    company: yup.string().required(),
    branch: yup.string().required(),
    enterprise: yup.string().required(),
    department: yup.string().required(),
    position: yup.string().required()
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
      const [location, company, branch, enterprise, department, position] =
        await Promise.allSettled([
          Location.findAll({}),
          Сompany.findAll({}),
          Branch.findAll({}),
          Enterprise.findAll({}),
          Department.findAll({}),
          Position.findAll({})
        ]);
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

const locations = ref([]);
const companies = ref([]);
const branches = ref([]);
const enterprises = ref([]);
const departments = ref([]);
const positions = ref([]);

const reqnum = defineComponentBinds('reqnum');
const login = defineComponentBinds('login');
const fullname = defineComponentBinds('fullname');
const phone = defineComponentBinds('phone');
const dateOpen = defineComponentBinds('dateOpen');
const dateClose = defineComponentBinds('dateClose');
const location = defineComponentBinds('location');
const company = defineComponentBinds('company');
const branch = defineComponentBinds('branch');
const enterprise = defineComponentBinds('enterprise');
const department = defineComponentBinds('department');
const position = defineComponentBinds('position');
const comment = defineComponentBinds('comment');

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
      await updateOne(values.id, controlledValues.value);
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
      await createOne(controlledValues.value);
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
    class="p-fluid"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-content-between w-full">
        <div class="flex align-items-center justify-content-center">
          <AppIcons name="network-mailbox" :size="42" class="mr-2" />
          <div>
            <p class="text-lg font-bold line-height-2 mb-2">
              {{ $t('Mailbox') }}
            </p>
            <p class="text-base font-normal line-height-2 text-color-secondary mb-0">
              {{ values?.id ? $t('Edit selected record') : $t('Create new record') }}
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
            <label for="dateOpen" class="font-bold">{{ $t('Date open') }}</label>
            <Calendar
              showIcon
              showButtonBar
              dateFormat="dd.mm.yy"
              :modelValue="dateToStr(dateOpen)"
              id="dateOpen"
              v-bind="dateOpen"
              :placeholder="$t('Date open')"
              :class="{ 'p-invalid': !!errors?.dateOpen }"
              aria-describedby="dateOpen-help"
            />
            <small id="dateOpen-help" class="p-error" v-if="errors?.dateOpen">
              {{ $t(errors.dateOpen) }}
            </small>
          </div>

          <div class="field">
            <label for="reqnum" class="font-bold">{{ $t('Letter number') }}</label>
            <InputText
              id="reqnum"
              v-bind="reqnum"
              :placeholder="$t('Letter number')"
              :class="{ 'p-invalid': !!errors?.reqnum }"
              aria-describedby="reqnum-help"
            />
            <small id="reqnum-help" class="p-error" v-if="errors?.reqnum">
              {{ $t(errors.reqnum) }}
            </small>
          </div>

          <div class="field">
            <label for="login" class="font-bold">{{ $t('Login mailbox') }}</label>
            <InputText
              id="login"
              v-bind="login"
              :placeholder="$t('Login mailbox')"
              :class="{ 'p-invalid': !!errors?.login }"
              aria-describedby="login-help"
            />
            <small id="login-help" class="p-error" v-if="errors?.login">
              {{ $t(errors.login) }}
            </small>
          </div>

          <div class="field">
            <label for="client-info" class="font-bold">{{ $t('Client info') }}</label>
            <div class="field" id="client-info">
              <div class="field">
                <InputText
                  id="fullname"
                  v-bind="fullname"
                  :placeholder="$t('Client fullname')"
                  :class="{ 'p-invalid': !!errors?.fullname }"
                  aria-describedby="fullname-help"
                />
                <small id="fullname-help" class="p-error" v-if="errors?.fullname">
                  {{ $t(errors.fullname) }}
                </small>
              </div>

              <div class="field">
                <InputText
                  id="phone"
                  v-bind="phone"
                  :placeholder="$t('Client phone')"
                  :class="{ 'p-invalid': !!errors?.phone }"
                  aria-describedby="phone-help"
                />
                <small id="phone-help" class="p-error" v-if="errors?.phone">
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
                  inputId="position"
                  v-bind="position"
                  :options="positions"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client position')"
                  :class="{ 'p-invalid': !!errors?.position }"
                  aria-describedby="position-help"
                />
                <small id="position-help" class="p-error" v-if="errors?.position">
                  {{ $t(errors.position) }}
                </small>
              </div>
            </div>
          </div>

          <div class="field">
            <label for="dateClose" class="font-bold">{{ $t('Date close') }}</label>
            <Calendar
              showIcon
              showButtonBar
              dateFormat="dd.mm.yy"
              aria-describedby="dateClose-help"
              :modelValue="dateToStr(dateClose)"
              id="dateClose"
              v-bind="dateClose"
              :placeholder="$t('Date close')"
            />
          </div>
        </div>

        <div class="field col">
          <div class="field">
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
            <small id="location-help" class="p-error" v-if="errors?.location">
              {{ $t(errors.location) }}
            </small>
          </div>

          <div class="field">
            <label for="companies" class="font-bold">{{ $t('Company') }}</label>
            <div class="field" id="companies">
              <div class="field">
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
                <small id="company-help" class="p-error" v-if="errors?.company">
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
                  inputId="branch"
                  v-bind="branch"
                  :options="branches"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client branch')"
                  :class="{ 'p-invalid': !!errors?.branch }"
                  aria-describedby="branch-help"
                />
                <small id="branch-help" class="p-error" v-if="errors?.branch">
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
                  inputId="enterprise"
                  v-bind="enterprise"
                  :options="enterprises"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client enterprise')"
                  :class="{ 'p-invalid': !!errors?.enterprise }"
                  aria-describedby="enterprise-help"
                />
                <small id="enterprise-help" class="p-error" v-if="errors?.enterprise">
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
                  inputId="department"
                  v-bind="department"
                  :options="departments"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client department')"
                  :class="{ 'p-invalid': !!errors?.department }"
                  aria-describedby="department-help"
                />
                <small id="department-help" class="p-error" v-if="errors?.department">
                  {{ $t(errors.department) }}
                </small>
              </div>
            </div>
          </div>

          <div class="field">
            <label for="comment" class="font-bold">{{ $t('Comment') }}</label>
            <Textarea
              rows="8"
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
