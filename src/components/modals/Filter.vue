<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { capitalizeFirstLetter } from '@/service/DataFilters';
import { useFilter } from '@/stores/api/filters';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const { findAll, createOne, updateOne, removeOne } = useFilter();

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      regex: yup.string().required(t('Value is required')),
      type: yup.string().required(t('Value is required')),
      status: yup.string().required(t('Value is required'))
    }),
    initialValues: {}
  });

const emits = defineEmits(['close']);

const groupBy = (array, property) => {
  const result = [];
  const obj = array.reduce(
    (grouped, element) => ({
      ...grouped,
      [element[property]]: [...(grouped[element[property]] || []), element]
    }),
    {}
  );

  Object.entries(obj).forEach(([key, value]) => {
    result.push({
      label: key?.toUpperCase(),
      code: key,
      items: value
    });
  });

  return result;
};

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

const records = ref([]);

const [regex, regexAttrs] = defineField('regex');
const [type, typeAttrs] = defineField('type');
const [status, statusAttrs] = defineField('status');
const [description, descriptionAttrs] = defineField('description');

const onShowModal = async () => {
  records.value = await findAll({});
  records.value = groupBy(records.value, 'type');
};

const onUpdateRecords = async () => {
  resetForm({ values: {} }, { force: true });
  try {
    records.value = await findAll({});
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
          <i class="pi pi-filter mr-4 text-4xl"></i>
          <div>
            <p class="line-height-2 text-lg font-bold">
              {{ $t('System filters') }}
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
      <Dropdown
        filter
        autofocus
        :options="records"
        @change="event => setValues({ ...event.value })"
        optionGroupLabel="label"
        optionGroupChildren="items"
        :optionLabel="({ regex }) => regex"
        :filterPlaceholder="$t('Search in list')"
        :placeholder="$t('Search in database')"
      >
        <template #optiongroup="slotProps">
          <div class="flex items-center">
            <span class="text-lg font-bold text-primary-500">{{ slotProps?.option?.label }}</span>
          </div>
        </template>

        <template #option="slotProps">
          <div class="flex items-center">
            <span class="text-base font-semibold">
              {{ slotProps?.option?.regex }}
              <sup
                class="text-xs font-bold"
                :class="slotProps?.option?.status === 'deny' ? 'text-yellow-500' : 'text-green-600'"
              >
                {{ slotProps?.option?.status?.toUpperCase() }}
              </sup>
            </span>
          </div>
        </template>
      </Dropdown>
    </div>

    <Divider type="solid" class="my-6" />

    <form class="flex flex-col gap-y-4" @submit.prevent="onSaveRecord">
      <div class="flex flex-col gap-2">
        <label for="regex" class="font-bold">{{ $t('Filter regex') }}</label>
        <InputText
          id="regex"
          v-model="regex"
          v-bind="regexAttrs"
          :placeholder="$t('Filter regex')"
          :invalid="!!errors?.regex"
          aria-describedby="regex-help"
        />
        <small id="regex-help" class="text-red-500" v-if="errors?.regex">
          {{ $t(errors.regex) }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="type" class="font-bold">{{ $t('Filter type') }}</label>
        <Dropdown
          filter
          autofocus
          showClear
          resetFilterOnHide
          inputId="type"
          v-model="type"
          v-bind="typeAttrs"
          :options="['account', 'software', 'share']"
          :optionLabel="item => capitalizeFirstLetter($t(item))"
          :filterPlaceholder="$t('Search')"
          :placeholder="$t('Filter type')"
          :invalid="!!errors?.type"
          aria-describedby="type-help"
        />
        <small id="type-help" class="text-red-500" v-if="errors?.type">
          {{ $t(errors.type) }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="status" class="font-bold">{{ $t('Filter status') }}</label>
        <Dropdown
          filter
          autofocus
          showClear
          resetFilterOnHide
          inputId="status"
          v-model="status"
          v-bind="statusAttrs"
          :options="['allow', 'deny']"
          :optionLabel="item => capitalizeFirstLetter($t(item))"
          :filterPlaceholder="$t('Search')"
          :placeholder="$t('Filter status')"
          :invalid="!!errors?.status"
          aria-describedby="status-help"
        />
        <small id="status-help" class="text-red-500" v-if="errors?.status">
          {{ $t(errors.status) }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="description" class="font-bold">{{ $t('Filter description') }}</label>
        <Textarea
          rows="5"
          id="description"
          v-model="description"
          v-bind="descriptionAttrs"
          :placeholder="$t('Filter description')"
        />
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = !visible" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
