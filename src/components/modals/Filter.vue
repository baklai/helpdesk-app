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
    regex: yup.string().required(t('Value is required')),
    type: yup.string().required(t('Value is required')),
    status: yup.string().required(t('Value is required'))
  }),
  initialValues: {}
});

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

const records = ref([]);

const regex = defineComponentBinds('regex');
const type = defineComponentBinds('type');
const status = defineComponentBinds('status');
const description = defineComponentBinds('description');

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

const onShowModal = async () => {
  records.value = await findAll({});
  records.value = groupBy(records.value, 'type');
};

const onCloseModal = () => {
  resetForm({ values: {} }, { force: true });
};

const onRecords = async () => {
  try {
    records.value = await findAll({});
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
    header: t('HD Confirm delete record'),
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
          <i class="pi pi-filter-fill text-4xl mr-4"></i>
          <div>
            <p class="text-lg font-bold line-height-2">
              {{ $t('System filters') }}
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
                class="font-bold text-xs"
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

    <form
      @submit.prevent="onSaveRecord"
      class="flex flex-col justify-center gap-3 text-surface-800 dark:text-surface-100"
    >
      <div class="flex flex-col gap-2">
        <label for="regex">{{ $t('Filter regex') }}</label>
        <InputText
          id="regex"
          v-bind="regex"
          :placeholder="$t('Filter regex')"
          :invalid="!!errors?.regex"
          aria-describedby="regex-help"
        />
        <small id="regex-help" class="text-red-500" v-if="errors?.regex">
          {{ $t(errors.regex) }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="type">{{ $t('Filter type') }}</label>
        <Dropdown
          filter
          autofocus
          showClear
          resetFilterOnHide
          inputId="type"
          v-bind="type"
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
        <label for="status">{{ $t('Filter status') }}</label>
        <Dropdown
          filter
          autofocus
          showClear
          resetFilterOnHide
          inputId="status"
          v-bind="status"
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
        <label for="description">{{ $t('Filter description') }}</label>
        <Textarea
          rows="5"
          id="description"
          v-bind="description"
          :placeholder="$t('Filter description')"
        />
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = false" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
