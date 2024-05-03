<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import BtnDBTable from '@/components/buttons/BtnDBTable.vue';

import { useSubdivision } from '@/stores/api/subdivisions';
import { useOrganization } from '@/stores/api/organizations';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const { findAllByOrganizationId, createOne, updateOne, removeOne } = useSubdivision();
const Organization = useOrganization();

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
    code: yup.string().required(t('Value is required')),
    name: yup.string().required(t('Value is required')),
    organization: yup.string().required(t('Value is required'))
  }),
  initialValues: {}
});

const visible = ref(true);

const refMenu = ref();
const options = ref([
  {
    label: t('Create record'),
    icon: 'pi pi-plus-circle',
    command: async () => await onCreateRecord()
  },
  {
    label: t('Delete record'),
    icon: 'pi pi-trash',
    command: async () => await onRemoveRecord()
  },
  {
    label: t('Update records'),
    icon: 'pi pi-sync',
    command: async () => await onUpdateRecords()
  }
]);

const organizations = ref([]);
const subdivisions = ref([]);

const code = defineComponentBinds('code');
const name = defineComponentBinds('name');
const address = defineComponentBinds('address');
const description = defineComponentBinds('description');
const organization = defineComponentBinds('organization');

const onShowModal = async () => {
  organizations.value = await Organization.findAll({});
};

const onSubdivisionsUpdate = async event => {
  if (event?.value) {
    subdivisions.value = await findAllByOrganizationId({ id: event.value });
  } else {
    subdivisions.value = [];
    resetForm({ values: {} }, { force: true });
  }
};

const onCloseModal = () => {
  resetForm({ values: {} }, { force: true });
};

const onRecords = async () => {
  try {
    organizations.value = await Organization.findAll({});
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t('Records not updated'),
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
    header: t('Confirm delete record'),
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
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

const onUpdateRecords = async () => {
  resetForm({ values: {} }, { force: true });
  await onRecords();
  toast.add({
    severity: 'success',
    summary: t('HD Information'),
    detail: t('Records is updated'),
    life: 3000
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
    closable
    draggable
    v-model:visible="visible"
    class="!w-[40rem]"
    @show="onShowModal"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-between w-full">
        <div class="flex items-center justify-center">
          <i class="pi pi-building text-4xl mr-4"></i>
          <div>
            <p class="text-lg font-bold line-height-2">
              {{ $t('Subdivision') }}
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

    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-1">
        <label for="organization" class="font-bold">{{ $t('Organization') }}</label>
        <div class="flex flex-row w-full gap-2">
          <Dropdown
            filter
            showClear
            autofocus
            resetFilterOnHide
            class="w-full"
            inputId="organization"
            dataKey="id"
            optionValue="id"
            optionLabel="name"
            v-bind="organization"
            :options="organizations"
            :invalid="!!errors?.organization"
            :filterPlaceholder="$t('Search in list')"
            :placeholder="$t('Search in database')"
            :virtualScrollerOptions="{ itemSize: 32 }"
            @change="onSubdivisionsUpdate"
          >
            <template #option="{ option }">
              <div class="flex items-center h-full text-base">
                {{ option.name }}
              </div>
            </template>
          </Dropdown>

          <BtnDBTable table="organization" />
        </div>
        <small id="organizations-help" class="text-red-500" v-if="errors?.organization">
          {{ $t(errors.organization) }}
        </small>
      </div>

      <div class="flex flex-col gap-1">
        <label for="subdivisions" class="font-bold">{{ $t('Subdivision') }}</label>
        <Dropdown
          filter
          showClear
          autofocus
          resetFilterOnHide
          inputId="subdivisions"
          optionLabel="name"
          panelClass="w-5"
          :options="subdivisions"
          :filterPlaceholder="$t('Search in list')"
          :placeholder="$t('Search in database')"
          :virtualScrollerOptions="{ itemSize: 32 }"
          @change="event => setValues({ ...event.value })"
        >
          <template #option="{ option }">
            <div class="flex items-center h-full text-base">
              {{ option.name }}
            </div>
          </template>
        </Dropdown>
      </div>
    </div>

    <Divider type="solid" class="my-6" />

    <form
      @submit.prevent="onSaveRecord"
      class="flex flex-col justify-center gap-3 text-surface-800 dark:text-surface-100"
    >
      <div class="flex flex-col gap-2">
        <label for="code" class="font-bold">{{ $t('Subdivision code') }}</label>
        <InputText
          id="code"
          v-bind="code"
          :placeholder="$t('Subdivision code')"
          :invalid="!!errors?.code"
          aria-describedby="code-help"
        />
        <small id="code-help" class="text-red-500" v-if="errors?.code">
          {{ $t(errors.code) }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="name" class="font-bold">{{ $t('Subdivision name') }}</label>
        <InputText
          id="name"
          v-bind="name"
          :placeholder="$t('Subdivision name')"
          :invalid="!!errors?.name"
          aria-describedby="name-help"
        />
        <small id="name-help" class="text-red-500" v-if="errors?.name">
          {{ $t(errors.name) }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="address" class="font-bold">{{ $t('Subdivision address') }}</label>
        <InputText id="address" v-bind="address" :placeholder="$t('Subdivision address')" />
      </div>

      <div class="flex flex-col gap-2">
        <label for="description" class="font-bold">{{ $t('Subdivision description') }}</label>
        <Textarea
          id="description"
          rows="5"
          v-bind="description"
          :placeholder="$t('Subdivision description')"
        />
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = false" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
