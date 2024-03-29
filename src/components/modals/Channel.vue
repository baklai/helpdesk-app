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
    locationFrom: yup.string().required(t('Value is required')),
    unitFrom: yup.string().required(t('Value is required')),
    locationTo: yup.string().required(t('Value is required')),
    unitTo: yup.string().required(t('Value is required')),
    level: yup.string().required(t('Value is required')),
    type: yup.string().required(t('Value is required')),
    speed: yup.string().required(t('Value is required')),
    status: yup.string().required(t('Value is required')),
    operator: yup.string().required(t('Value is required')),
    composition: yup.string().required(t('Value is required'))
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
    modal
    closable
    :draggable="false"
    v-model:visible="visible"
    :style="{ width: '600px' }"
    class=""
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-between w-full">
        <div class="flex items-center justify-center">
          <AppIcons name="network-channels" :size="40" class="mr-4" />
          <div>
            <p class="text-lg font-bold line-height-2 mb-2">
              {{ $t('Network channel') }}
            </p>
            <p class="text-base font-normal line-height-2 text-surface-500 mb-0">
              {{ values?.id ? $t('Edit selected record') : $t('Create new record') }}
            </p>
          </div>
        </div>
        <div class="flex gap-2 items-center">
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
      <div class="formgridflex flex-wrap">
        <div class="col">
          <div class="">
            <label for="locationFrom" class="font-bold">{{ $t('Location start') }}</label>
            <InputText
              id="locationFrom"
              v-bind="locationFrom"
              :placeholder="$t('Location start')"
              :invalid="!!errors?.locationFrom"
              aria-describedby="locationFrom-help"
            />
            <small id="locationFrom-help" class="text-red-500" v-if="errors?.locationFrom">
              {{ $t(errors.locationFrom) }}
            </small>
          </div>

          <div class="">
            <label for="unitFrom" class="font-bold">{{ $t('Unit start') }}</label>
            <InputText
              id="unitFrom"
              v-bind="unitFrom"
              :placeholder="$t('Unit start')"
              :invalid="!!errors?.unitFrom"
              aria-describedby="unitFrom-help"
            />
            <small id="unitFrom-help" class="text-red-500" v-if="errors?.unitFrom">
              {{ $t(errors.unitFrom) }}
            </small>
          </div>
        </div>

        <div class="col">
          <div class="">
            <label for="locationTo" class="font-bold">{{ $t('Location end') }}</label>
            <InputText
              id="locationTo"
              v-bind="locationTo"
              :placeholder="$t('Location end')"
              :invalid="!!errors?.locationTo"
              aria-describedby="locationTo-help"
            />
            <small id="locationTo-help" class="text-red-500" v-if="errors?.locationTo">
              {{ $t(errors.locationTo) }}
            </small>
          </div>

          <div class="">
            <label for="unitTo" class="font-bold">{{ $t('Unit end') }}</label>
            <InputText
              id="unitTo"
              v-bind="unitTo"
              :placeholder="$t('Unit end')"
              :invalid="!!errors?.unitTo"
              aria-describedby="unitTo-help"
            />
            <small id="unitTo-help" class="text-red-500" v-if="errors?.unitTo">
              {{ $t(errors.unitTo) }}
            </small>
          </div>
        </div>

        <div class="flex-shrink-0 p-4 w-full">
          <div class="">
            <label for="level" class="font-bold">{{ $t('Level') }}</label>
            <InputText
              id="level"
              v-bind="level"
              :placeholder="$t('Level')"
              :invalid="!!errors?.level"
              aria-describedby="level-help"
            />
            <small id="level-help" class="text-red-500" v-if="errors?.level">
              {{ $t(errors.level) }}
            </small>
          </div>

          <div class="">
            <label for="type" class="font-bold">{{ $t('Type') }}</label>
            <InputText
              id="type"
              v-bind="type"
              :placeholder="$t('Type')"
              :invalid="!!errors?.type"
              aria-describedby="type-help"
            />
            <small id="type-help" class="text-red-500" v-if="errors?.type">
              {{ $t(errors.type) }}
            </small>
          </div>

          <div class="">
            <label for="speed" class="font-bold">{{ $t('Speed') }}</label>
            <InputText
              id="speed"
              v-bind="speed"
              :placeholder="$t('Speed')"
              :invalid="!!errors?.speed"
              aria-describedby="speed-help"
            />
            <small id="speed-help" class="text-red-500" v-if="errors?.speed">
              {{ $t(errors.speed) }}
            </small>
          </div>

          <div class="">
            <label for="status" class="font-bold">{{ $t('Status') }}</label>
            <InputText
              id="status"
              v-bind="status"
              :placeholder="$t('Status')"
              :invalid="!!errors?.status"
              aria-describedby="status-help"
            />
            <small id="status-help" class="text-red-500" v-if="errors?.status">
              {{ $t(errors.status) }}
            </small>
          </div>

          <div class="">
            <label for="operator" class="font-bold">{{ $t('Operator') }}</label>
            <InputText
              id="operator"
              v-bind="operator"
              :placeholder="$t('Operator')"
              :invalid="!!errors?.operator"
              aria-describedby="operator-help"
            />
            <small id="operator-help" class="text-red-500" v-if="errors?.operator">
              {{ $t(errors.operator) }}
            </small>
          </div>

          <div class="">
            <label for="composition" class="font-bold">{{ $t('Composition') }}</label>
            <Textarea
              rows="5"
              cols="10"
              id="composition"
              v-bind="composition"
              :placeholder="$t('Composition')"
              :invalid="!!errors?.composition"
              aria-describedby="composition-help"
            />
            <small id="composition-help" class="text-red-500" v-if="errors?.composition">
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
