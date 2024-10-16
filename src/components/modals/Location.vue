<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { useLocation } from '@/stores/api/locations';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const { findAllGroured, createOne, updateOne, removeOne } = useLocation();

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      name: yup.string().required(t('Value is required'))
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

const records = ref([]);

const [name, nameAttrs] = defineField('name');
const [region, regionAttrs] = defineField('region');

const onShowModal = async () => {
  records.value = await findAllGroured({});
};

const onUpdateRecords = async () => {
  resetForm({ values: {} }, { force: true });
  try {
    records.value = await findAllGroured({});
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
          <i class="pi pi-map-marker mr-4 text-4xl"></i>
          <div>
            <p class="line-height-2 text-lg font-bold">
              {{ $t('Location') }}
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
        showClear
        autofocus
        resetFilterOnHide
        optionLabel="name"
        optionGroupLabel="group"
        optionGroupChildren="records"
        :options="records"
        :filterPlaceholder="$t('Search in list')"
        :placeholder="$t('Search in database')"
        :virtualScrollerOptions="{ itemSize: 32 }"
        :pt="{
          itemgroup: {
            class: [
              'font-bold m-0 py-3 px-5 cursor-auto',
              'text-surface-800 dark:text-white/80',
              'bg-surface-200 dark:bg-surface-900/80'
            ]
          }
        }"
        @change="event => setValues({ ...event.value })"
      >
        <template #optiongroup="{ option }">
          <div class="flex h-full items-center justify-center text-base uppercase">
            {{ option.group }}
          </div>
        </template>
        <template #option="{ option }">
          <div class="flex h-full items-center text-base">
            {{ option.name }}
          </div>
        </template>
      </Dropdown>
    </div>

    <Divider type="solid" class="my-6" />

    <form class="flex flex-col gap-y-4" @submit.prevent="onSaveRecord">
      <div class="flex flex-col gap-2">
        <label for="name" class="font-bold">{{ $t('Location name') }}</label>
        <InputText
          id="name"
          v-model="name"
          v-bind="nameAttrs"
          :placeholder="$t('Location name')"
          :invalid="!!errors?.name"
          aria-describedby="name-help"
        />
        <small id="name-help" class="text-red-500" v-if="errors?.name">
          {{ $t(errors.name) }}
        </small>
      </div>

      <div class="flex flex-col gap-2">
        <label for="region" class="font-bold">{{ $t('Location region') }}</label>
        <InputText
          id="region"
          v-model="region"
          v-bind="regionAttrs"
          :placeholder="$t('Location region')"
        />
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = !visible" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
