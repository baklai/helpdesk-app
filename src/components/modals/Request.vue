<script setup>
import { ref, computed, inject } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, ipAddress } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
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
      if (id) record.value = await Request.findOne({ id, populate: false });
      else record.value = Request.$reset();

      const [company, branch, department, enterprise, position, location] = await Promise.allSettled([
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
      record.value = Request.$reset();
      $validate.value.$reset();
      toast.add({ severity: 'warn', summary: t('HD Warning'), detail: t(err.message), life: 3000 });
    }
  }
});

const visible = ref(false);

const record = ref({});

const isClosed = computed(() => {
  return record.value.closed ? true : false;
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

const onClose = () => {
  visible.value = false;
  $validate.value.$reset();
  record.value = Request.$reset();
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
  record.value = Request.$reset();
  $validate.value.$reset();
  toast.add({
    severity: 'success',
    summary: t('HD Information'),
    detail: t('Input new record'),
    life: 3000
  });
};

const onRemoveRecord = async () => {
  if (record.value?.id) {
    await Request.removeOne(record.value);
    toast.add({
      severity: 'success',
      summary: t('HD Information'),
      detail: t('Record is removed'),
      life: 3000
    });
    onClose();
  } else {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t('Record not selected'),
      life: 3000
    });
  }
};

const onSaveRecord = async () => {
  const valid = await $validate.value.$validate();
  if (valid) {
    if (record.value?.id) {
      await Request.updateOne(record.value);
      toast.add({
        severity: 'success',
        summary: t('HD Information'),
        detail: t('Record is updated'),
        life: 3000
      });
    } else {
      await Request.createOne({ ...record.value, workerOpen: $helpdesk?.user?.id || null });
      toast.add({
        severity: 'success',
        summary: t('HD Information'),
        detail: t('Record is created'),
        life: 3000
      });
    }
    onClose();
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
    record.value.closed = new Date();
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
    @hide="onClose"
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
            @click="(event) => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <form @submit.prevent="onSaveRecord">
      <div class="formgrid grid">
        <div class="field col">
          <div class="field">
            <label for="request" class="font-bold">{{ $t('Client request') }}</label>
            <Textarea
              rows="8"
              cols="10"
              id="request"
              aria-describedby="request-help"
              v-model="record.request"
              :placeholder="$t('Client request')"
            />
            <small id="request-help" class="p-error" v-for="error in $validate.request.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label for="mail" class="font-bold">{{ $t('Mail number') }}</label>
            <InputText id="mail" aria-describedby="mail-help" v-model="record.mail" :placeholder="$t('Mail number')" />
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
            <small id="location-help" class="p-error" v-for="error in $validate.location.$errors" :key="error.$uid">
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
                    v-tooltip.bottom="$t('Find IP Address')"
                    @click.prevent="findOneIPAddress"
                  />
                  <InputText
                    id="ipaddress"
                    aria-describedby="ipaddress-help"
                    v-model="record.ipaddress"
                    :placeholder="$t('Client IP Address')"
                    :class="{ 'p-invalid': !!$validate.ipaddress.$errors.length }"
                    @keypress.enter="findOneIPAddress"
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
            </div>
          </div>

          <div class="field">
            <label for="conclusion" class="font-bold">{{ $t('Conclusion for request') }}</label>
            <Textarea
              rows="7"
              cols="10"
              id="conclusion"
              aria-describedby="conclusion-help"
              v-model="record.conclusion"
              :placeholder="$t('Conclusion')"
            />
          </div>
        </div>

        <div class="field col">
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
                <small id="fullname-help" class="p-error" v-for="error in $validate.fullname.$errors" :key="error.$uid">
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
                <small id="phone-help" class="p-error" v-for="error in $validate.phone.$errors" :key="error.$uid">
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
                <small id="position-help" class="p-error" v-for="error in $validate.position.$errors" :key="error.$uid">
                  {{ $t(error.$message) }}
                </small>
              </div>
            </div>
          </div>

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
                <small id="company-help" class="p-error" v-for="error in $validate.company.$errors" :key="error.$uid">
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
                <small id="branch-help" class="p-error" v-for="error in $validate.branch.$errors" :key="error.$uid">
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
            <label for="comment" class="font-bold">{{ $t('Comment') }}</label>
            <Textarea rows="3" cols="10" id="comment" v-model="record.comment" :placeholder="$t('Comment')" />
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="onClose" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" :disabled="isClosed" @click="onSaveRecord" />
      <Button
        text
        plain
        icon="pi pi-check-circle"
        :label="$t('Save and closed')"
        :disabled="isClosed"
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
