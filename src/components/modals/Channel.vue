<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { useChannel } from '@/stores/api/channels';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const { findOne, createOne, updateOne, removeOne } = useChannel();

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
    locationFrom: yup.string().required(),
    unitFrom: yup.string().required(),
    locationTo: yup.string().required(),
    unitTo: yup.string().required(),
    level: yup.string().required(),
    type: yup.string().required(),
    speed: yup.string().required(),
    status: yup.string().required(),
    operator: yup.string().required(),
    composition: yup.string().required()
  }),
  initialValues: {}
});

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        setValues(await findOne({ id }));
      }
      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

const visible = ref(false);

const locationFrom = defineComponentBinds('locationFrom');
const unitFrom = defineComponentBinds('unitFrom');
const locationTo = defineComponentBinds('locationTo');
const unitTo = defineComponentBinds('unitTo');
const level = defineComponentBinds('level');
const type = defineComponentBinds('type');
const speed = defineComponentBinds('speed');
const status = defineComponentBinds('status');
const operator = defineComponentBinds('operator');
const composition = defineComponentBinds('composition');

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

const onCloseModal = () => {
  resetForm({ values: {} }, { force: true });
  emits('close', {});
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
  <Menu ref="refMenu" popup :model="options" />

  <Dialog
    modal
    closable
    :draggable="false"
    v-model:visible="visible"
    :style="{ width: '600px' }"
    class="p-fluid"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-content-between w-full">
        <div class="flex align-items-center justify-content-center">
          <AppIcons name="network-channels" :size="40" class="mr-2" />
          <div>
            <p class="text-lg font-bold line-height-2 mb-0">{{ $t('Network channel') }}</p>
            <p class="text-base font-normal line-height-2 text-color-secondary mb-0">
              {{ values?.id ? $t('Edit current record') : $t('Create new record') }}
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
            <label class="font-bold">{{ $t('Location start') }}</label>
            <InputText
              v-bind="locationFrom"
              :placeholder="$t('Location start')"
              :class="{ 'p-invalid': !!errors?.locationFrom }"
            />
            <small class="p-error" v-if="errors?.locationFrom">
              {{ $t(errors.locationFrom) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Unit start') }}</label>
            <InputText
              v-bind="unitFrom"
              :placeholder="$t('Unit start')"
              :class="{ 'p-invalid': !!errors?.unitFrom }"
            />
            <small class="p-error" v-if="errors?.unitFrom">
              {{ $t(errors.unitFrom) }}
            </small>
          </div>
        </div>

        <div class="field col">
          <div class="field">
            <label class="font-bold">{{ $t('Location end') }}</label>
            <InputText
              v-bind="locationTo"
              :placeholder="$t('Location end')"
              :class="{ 'p-invalid': !!errors?.locationTo }"
            />
            <small class="p-error" v-if="errors?.locationTo">
              {{ $t(errors.locationTo) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Unit end') }}</label>
            <InputText
              v-bind="unitTo"
              :placeholder="$t('Unit end')"
              :class="{ 'p-invalid': !!errors?.unitTo }"
            />
            <small class="p-error" v-if="errors?.unitTo">
              {{ $t(errors.unitTo) }}
            </small>
          </div>
        </div>

        <div class="field col-12">
          <div class="field">
            <label class="font-bold">{{ $t('Level') }}</label>
            <InputText
              v-bind="level"
              :placeholder="$t('Level')"
              :class="{ 'p-invalid': !!errors?.level }"
            />
            <small class="p-error" v-if="errors?.level">
              {{ $t(errors.level) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Type') }}</label>
            <InputText
              v-bind="type"
              :placeholder="$t('Type')"
              :class="{ 'p-invalid': !!errors?.type }"
            />
            <small class="p-error" v-if="errors?.type">
              {{ $t(errors.type) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Speed') }}</label>
            <InputText
              v-bind="speed"
              :placeholder="$t('Speed')"
              :class="{ 'p-invalid': !!errors?.speed }"
            />
            <small class="p-error" v-if="errors?.speed">
              {{ $t(errors.speed) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Status') }}</label>
            <InputText
              v-bind="status"
              :placeholder="$t('Status')"
              :class="{ 'p-invalid': !!errors?.status }"
            />
            <small class="p-error" v-if="errors?.status">
              {{ $t(errors.status) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Operator') }}</label>
            <InputText
              v-bind="operator"
              :placeholder="$t('Operator')"
              :class="{ 'p-invalid': !!errors?.operator }"
            />
            <small class="p-error" v-if="errors?.operator">
              {{ $t(errors.operator) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Composition') }}</label>
            <Textarea
              rows="5"
              cols="10"
              v-bind="composition"
              :placeholder="$t('Composition')"
              :class="{ 'p-invalid': !!errors?.composition }"
            />
            <small class="p-error" v-if="errors?.composition">
              {{ $t(errors.composition) }}
            </small>
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
