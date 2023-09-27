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

const Mailbox = useMailbox();
const Location = useLocation();
const Сompany = useСompany();
const Branch = useBranch();
const Enterprise = useEnterprise();
const Department = useDepartment();
const Position = usePosition();

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        record.value = Mailbox.$init(await Mailbox.findOne({ id, populate: false }));
      } else {
        record.value = Mailbox.$init({});
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

const record = ref({});

const locations = ref([]);
const companies = ref([]);
const branches = ref([]);
const enterprises = ref([]);
const departments = ref([]);
const positions = ref([]);

const $validate = useVuelidate(
  {
    reqnum: { required },
    login: { required },
    fullname: { required },
    phone: { required },
    dateOpen: { required },
    location: { required },
    company: { required },
    branch: { required },
    enterprise: { required },
    department: { required },
    position: { required }
  },
  record
);

const onCreateRecord = async () => {
  record.value = Mailbox.$init({});
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
          await Mailbox.removeOne(record.value);
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
        await Mailbox.updateOne(record.value);
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
        await Mailbox.createOne(record.value);
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
  record.value = Mailbox.$init({});
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
          <AppIcons name="network-mailbox" :size="42" class="mr-2" />
          <div>
            <p class="text-lg font-bold line-height-2 mb-2">{{ $t('Mailbox') }}</p>
            <p class="text-base font-normal line-height-2 text-color-secondary mb-0">
              {{ record?.id ? $t('Edit selected record') : $t('Create new record') }}
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
            <label class="font-bold">{{ $t('Date open') }}</label>
            <Calendar
              showIcon
              showButtonBar
              dateFormat="dd.mm.yy"
              :modelValue="dateToStr(record.dateOpen)"
              v-model="record.dateOpen"
              :placeholder="$t('Date open')"
              :class="{ 'p-invalid': !!$validate.dateOpen.$errors.length }"
            />
            <small class="p-error" v-for="error in $validate.dateOpen.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Letter number') }}</label>
            <InputText
              v-model="record.reqnum"
              :placeholder="$t('Letter number')"
              :class="{ 'p-invalid': !!$validate.reqnum.$errors.length }"
            />
            <small class="p-error" v-for="error in $validate.reqnum.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Login mailbox') }}</label>
            <InputText
              v-model="record.login"
              :placeholder="$t('Login mailbox')"
              :class="{ 'p-invalid': !!$validate.login.$errors.length }"
            />
            <small class="p-error" v-for="error in $validate.login.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Client info') }}</label>
            <div class="field">
              <div class="field">
                <InputText
                  v-model="record.fullname"
                  :placeholder="$t('Client fullname')"
                  :class="{ 'p-invalid': !!$validate.fullname.$errors.length }"
                />
                <small
                  class="p-error"
                  v-for="error in $validate.fullname.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
                </small>
              </div>

              <div class="field">
                <InputText
                  v-model="record.phone"
                  :placeholder="$t('Client phone')"
                  :class="{ 'p-invalid': !!$validate.phone.$errors.length }"
                />
                <small class="p-error" v-for="error in $validate.phone.$errors" :key="error.$uid">
                  {{ $t(error.$message) }}
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
                  v-model="record.position"
                  :options="positions"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client position')"
                  :class="{ 'p-invalid': !!$validate.position.$errors.length }"
                />
                <small
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
            <label class="font-bold">{{ $t('Date close') }}</label>
            <Calendar
              showIcon
              showButtonBar
              dateFormat="dd.mm.yy"
              aria-describedby="dateClose-help"
              :modelValue="dateToStr(record.dateClose)"
              v-model="record.dateClose"
              :placeholder="$t('Date close')"
            />
          </div>
        </div>

        <div class="field col">
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
              v-model="record.location"
              :options="locations"
              :filterPlaceholder="$t('Search')"
              :placeholder="$t('Client location')"
              :class="{ 'p-invalid': !!$validate.location.$errors.length }"
            />
            <small class="p-error" v-for="error in $validate.location.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
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
                  v-model="record.company"
                  :options="companies"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client company')"
                  :class="{ 'p-invalid': !!$validate.company.$errors.length }"
                />
                <small class="p-error" v-for="error in $validate.company.$errors" :key="error.$uid">
                  {{ $t(error.$message) }}
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
                  v-model="record.branch"
                  :options="branches"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client branch')"
                  :class="{ 'p-invalid': !!$validate.branch.$errors.length }"
                />
                <small class="p-error" v-for="error in $validate.branch.$errors" :key="error.$uid">
                  {{ $t(error.$message) }}
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
                  v-model="record.enterprise"
                  :options="enterprises"
                  :filterPlaceholder="$t('Search')"
                  :placeholder="$t('Client enterprise')"
                  :class="{ 'p-invalid': !!$validate.enterprise.$errors.length }"
                />
                <small
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
            <label class="font-bold">{{ $t('Comment') }}</label>
            <Textarea
              rows="8"
              cols="10"
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
