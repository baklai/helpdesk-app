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

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      code: yup.string().required(t('Value is required')),
      name: yup.string().required(t('Value is required')),
      organization: yup.string().required(t('Value is required'))
    }),
    initialValues: {}
  });

const emits = defineEmits(['close']);

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

const [code, codeAttrs] = defineField('code');
const [name, nameAttrs] = defineField('name');
const [address, addressAttrs] = defineField('address');
const [description, descriptionAttrs] = defineField('description');
const [organization, organizationAttrs] = defineField('organization');

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

const onUpdateRecords = async () => {
  resetForm({ values: {} }, { force: true });
  try {
    organizations.value = await Organization.findAll({});
    toast.add({
      severity: 'success',
      summary: t('Information'),
      detail: t('Records is updated'),
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('Warning'),
      detail: t('Records not updated'),
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
    closable
    draggable
    v-model:visible="visible"
    class="mx-auto w-[90vw] md:w-[60vw] lg:w-[50vw] xl:w-[40vw] 2xl:w-[30vw]"
    @show="onShowModal"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex w-full justify-between">
        <div class="flex items-center justify-center">
          <i class="pi pi-building mr-4 text-4xl"></i>
          <div>
            <p class="line-height-2 text-lg font-bold">
              {{ $t('Subdivision') }}
            </p>
            <p class="line-height-2 text-base font-normal text-surface-500">
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

    <div class="flex flex-col gap-2">
      <div class="flex flex-col gap-2">
        <label for="organization" class="font-bold">{{ $t('Organization') }}</label>
        <div class="flex flex-row gap-2">
          <Dropdown
            filter
            showClear
            autofocus
            resetFilterOnHide
            inputId="organization"
            dataKey="id"
            optionValue="id"
            optionLabel="name"
            v-model="organization"
            v-bind="organizationAttrs"
            :options="organizations"
            :invalid="!!errors?.organization"
            :filterPlaceholder="$t('Search in list')"
            :placeholder="$t('Search in database')"
            :virtualScrollerOptions="{ itemSize: 32 }"
            :ptOptions="{ mergeSections: true, mergeProps: true }"
            :pt="{
              root: { class: ['w-full'] },
              input: { class: ['!whitespace-normal'] }
            }"
            @change="onSubdivisionsUpdate"
          >
            <template #option="{ option }">
              <div class="flex h-full items-center text-base">
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

      <div class="flex flex-col gap-2">
        <label for="subdivisions" class="font-bold">{{ $t('Subdivision') }}</label>
        <Dropdown
          filter
          showClear
          autofocus
          resetFilterOnHide
          inputId="subdivisions"
          optionLabel="name"
          :options="subdivisions"
          :filterPlaceholder="$t('Search in list')"
          :placeholder="$t('Search in database')"
          :virtualScrollerOptions="{ itemSize: 32 }"
          :ptOptions="{ mergeSections: true, mergeProps: true }"
          :pt="{
            root: { class: ['w-full'] },
            input: { class: ['!whitespace-normal'] }
          }"
          @change="event => setValues({ ...event.value })"
        >
          <template #option="{ option }">
            <div class="flex h-full items-center text-base">
              {{ option.name }}
            </div>
          </template>
        </Dropdown>
      </div>
    </div>

    <Divider type="solid" class="my-6" />

    <form class="flex flex-col gap-y-4" @submit.prevent="onSaveRecord">
      <div class="flex flex-col gap-2">
        <label for="code" class="font-bold">{{ $t('Subdivision code') }}</label>
        <InputText
          id="code"
          v-model="code"
          v-bind="codeAttrs"
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
          v-model="name"
          v-bind="nameAttrs"
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
        <InputText
          id="address"
          v-model="address"
          v-bind="addressAttrs"
          :placeholder="$t('Subdivision address')"
        />
      </div>

      <div class="flex flex-col gap-2">
        <label for="description" class="font-bold">{{ $t('Subdivision description') }}</label>
        <Textarea
          id="description"
          rows="5"
          v-model="description"
          v-bind="descriptionAttrs"
          :placeholder="$t('Subdivision description')"
        />
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = !visible" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
