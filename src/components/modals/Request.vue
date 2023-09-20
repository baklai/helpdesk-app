<script setup>
import { ref, computed, inject } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, ipAddress } from '@vuelidate/validators';
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

const Request = useRequest();
const IPAddress = useIPAddress();
const Company = useСompany();
const Branch = useBranch();
const Department = useDepartment();
const Enterprise = useEnterprise();
const Position = usePosition();
const Location = useLocation();

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        record.value = Request.$init(await Request.findOne({ id, populate: false }));
      } else {
        record.value = Request.$init({});
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

const record = ref({});

const isClosed = computed(() => {
  return !record?.value?.closed ? false : true;
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

const companies = ref([]);
const branches = ref([]);
const departments = ref([]);
const enterprises = ref([]);
const positions = ref([]);
const locations = ref([]);

const $validate = useVuelidate(
  {
    ipaddress: { ipAddress },
    fullname: { required },
    phone: { required },
    position: { required },
    location: { required },
    company: { required },
    branch: { required },
    enterprise: { required },
    department: { required },
    request: { required }
  },
  record
);

const onCloseModal = () => {
  $validate.value.$reset();
  record.value = Request.$init({});
  emits('close', {});
};

const findOneIPAddress = async () => {
  const validIPAddress = await $validate.value.ipaddress.$validate();
  try {
    if (record.value?.ipaddress && validIPAddress) {
      const currentIP = await IPAddress.findOne({
        ipaddress: record.value.ipaddress,
        populate: false
      });
      if (currentIP?.ipaddress) {
        record.value.ipaddress = currentIP?.ipaddress || null;
        record.value.location = currentIP?.location || null;
        record.value.fullname = currentIP?.fullname || null;
        record.value.phone = currentIP?.phone || null;
        record.value.position = currentIP?.position || null;
        record.value.company = currentIP?.company || null;
        record.value.branch = currentIP?.branch || null;
        record.value.enterprise = currentIP?.enterprise || null;
        record.value.department = currentIP?.department || null;
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
    toast.add({ severity: 'warn', summary: t('HD Warning'), detail: t(err.message), life: 3000 });
  }
};

const onCreateRecord = async () => {
  record.value = Request.$init({});
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
          await Request.removeOne(record.value);
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
        await Request.updateOne(record.value);
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
        await Request.createOne({ ...record.value, workerOpen: $helpdesk?.user?.id || null });
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

const onSaveClosedRecord = async () => {
  const valid = await $validate.value.$validate();
  if (valid) {
    record.value.closed = true;
    record.value.workerClose = $helpdesk?.user?.id || null;
    await onSaveRecord();
  }
};
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
              {{ record?.id ? $t('Edit current record') : $t('Create new record') }}
            </p>
            <p class="text-base font-normal line-height-2 text-color-secondary mb-0">
              {{ $t('Status') }} :
              {{ record?.closed ? $t('Request closed') : $t('Request opened') }}
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
              v-model="record.request"
              :disabled="isClosed"
              :placeholder="$t('Client request')"
              :class="{ 'p-invalid': !!$validate.request.$errors.length }"
            />
            <small class="p-error" v-for="error in $validate.request.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Letter number') }}</label>
            <InputText
              aria-describedby="reqnum-help"
              v-model="record.reqnum"
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
                v-model="record.ipaddress"
                :disabled="isClosed"
                :placeholder="$t('Client IP Address')"
                :class="{ 'p-invalid': !!$validate.ipaddress.$errors.length }"
                @keypress.enter="findOneIPAddress"
              />
            </span>
            <small class="p-error" v-for="error in $validate.ipaddress.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Conclusion for request') }}</label>
            <Textarea
              rows="5"
              cols="10"
              aria-describedby="conclusion-help"
              v-model="record.conclusion"
              :disabled="isClosed"
              :placeholder="$t('Conclusion')"
            />
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Comment') }}</label>
            <Textarea
              rows="3"
              cols="10"
              v-model="record.comment"
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
                  v-model="record.fullname"
                  :disabled="isClosed"
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
                  :disabled="isClosed"
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
                  :disabled="isClosed"
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
              :disabled="isClosed"
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
                  :disabled="isClosed"
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
                  :disabled="isClosed"
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
                  :disabled="isClosed"
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
                  :disabled="isClosed"
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
