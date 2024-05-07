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

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
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

const [locationFrom, locationFromAttrs] = defineField('locationFrom');
const [unitFrom, unitFromAttrs] = defineField('unitFrom');
const [locationTo, locationToAttrs] = defineField('locationTo');
const [unitTo, unitToAttrs] = defineField('unitTo');
const [level, levelAttrs] = defineField('level');
const [type, typeAttrs] = defineField('type');
const [speed, speedAttrs] = defineField('speed');
const [status, statusAttrs] = defineField('status');
const [operator, operatorAttrs] = defineField('operator');
const [composition, compositionAttrs] = defineField('composition');

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
    modal
    closable
    :draggable="false"
    v-model:visible="visible"
    class="mx-auto w-[90vw] md:w-[80vw] lg:w-[60vw] xl:w-[50vw] 2xl:w-[40vw]"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-between w-full">
        <div class="flex items-center justify-center">
          <AppIcons name="network-channels" :size="40" class="mr-4" />
          <div>
            <p class="text-lg font-bold line-height-2">
              {{ $t('Network channel') }}
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
            class="h-12 w-12"
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="$t('Options menu')"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <form class="flex flex-col gap-y-4 md:flex-row md:flex-wrap" @submit.prevent="onSaveRecord">
      <div class="flex flex-col space-y-4 md:w-1/2 md:pr-2">
        <div class="flex flex-col gap-2">
          <label for="locationFrom" class="font-bold">{{ $t('Location start') }}</label>
          <InputText
            id="locationFrom"
            v-model="locationFrom"
            v-bind="locationFromAttrs"
            :placeholder="$t('Location start')"
            :invalid="!!errors?.locationFrom"
            aria-describedby="locationFrom-help"
          />
          <small id="locationFrom-help" class="text-red-500" v-if="errors?.locationFrom">
            {{ $t(errors.locationFrom) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="unitFrom" class="font-bold">{{ $t('Unit start') }}</label>
          <InputText
            id="unitFrom"
            v-model="unitFrom"
            v-bind="unitFromAttrs"
            :placeholder="$t('Unit start')"
            :invalid="!!errors?.unitFrom"
            aria-describedby="unitFrom-help"
          />
          <small id="unitFrom-help" class="text-red-500" v-if="errors?.unitFrom">
            {{ $t(errors.unitFrom) }}
          </small>
        </div>
      </div>

      <div class="flex flex-col space-y-4 md:w-1/2 md:pl-2">
        <div class="flex flex-col gap-2">
          <label for="locationTo" class="font-bold">{{ $t('Location end') }}</label>
          <InputText
            id="locationTo"
            v-model="locationTo"
            v-bind="locationToAttrs"
            :placeholder="$t('Location end')"
            :invalid="!!errors?.locationTo"
            aria-describedby="locationTo-help"
          />
          <small id="locationTo-help" class="text-red-500" v-if="errors?.locationTo">
            {{ $t(errors.locationTo) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="unitTo" class="font-bold">{{ $t('Unit end') }}</label>
          <InputText
            id="unitTo"
            v-model="unitTo"
            v-bind="unitToAttrs"
            :placeholder="$t('Unit end')"
            :invalid="!!errors?.unitTo"
            aria-describedby="unitTo-help"
          />
          <small id="unitTo-help" class="text-red-500" v-if="errors?.unitTo">
            {{ $t(errors.unitTo) }}
          </small>
        </div>
      </div>

      <div class="flex flex-col w-full space-y-4">
        <div class="flex flex-col gap-2">
          <label for="level" class="font-bold">{{ $t('Level') }}</label>
          <InputText
            id="level"
            v-model="level"
            v-bind="levelAttrs"
            :placeholder="$t('Level')"
            :invalid="!!errors?.level"
            aria-describedby="level-help"
          />
          <small id="level-help" class="text-red-500" v-if="errors?.level">
            {{ $t(errors.level) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="type" class="font-bold">{{ $t('Type') }}</label>
          <InputText
            id="type"
            v-model="type"
            v-bind="typeAttrs"
            :placeholder="$t('Type')"
            :invalid="!!errors?.type"
            aria-describedby="type-help"
          />
          <small id="type-help" class="text-red-500" v-if="errors?.type">
            {{ $t(errors.type) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="speed" class="font-bold">{{ $t('Speed') }}</label>
          <InputText
            id="speed"
            v-model="speed"
            v-bind="speedAttrs"
            :placeholder="$t('Speed')"
            :invalid="!!errors?.speed"
            aria-describedby="speed-help"
          />
          <small id="speed-help" class="text-red-500" v-if="errors?.speed">
            {{ $t(errors.speed) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="status" class="font-bold">{{ $t('Status') }}</label>
          <InputText
            id="status"
            v-model="status"
            v-bind="statusAttrs"
            :placeholder="$t('Status')"
            :invalid="!!errors?.status"
            aria-describedby="status-help"
          />
          <small id="status-help" class="text-red-500" v-if="errors?.status">
            {{ $t(errors.status) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="operator" class="font-bold">{{ $t('Operator') }}</label>
          <InputText
            id="operator"
            v-model="operator"
            v-bind="operatorAttrs"
            :placeholder="$t('Operator')"
            :invalid="!!errors?.operator"
            aria-describedby="operator-help"
          />
          <small id="operator-help" class="text-red-500" v-if="errors?.operator">
            {{ $t(errors.operator) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="composition" class="font-bold">{{ $t('Composition') }}</label>
          <Textarea
            rows="5"
            id="composition"
            v-model="composition"
            v-bind="compositionAttrs"
            :placeholder="$t('Composition')"
            :invalid="!!errors?.composition"
            aria-describedby="composition-help"
          />
          <small id="composition-help" class="text-red-500" v-if="errors?.composition">
            {{ $t(errors.composition) }}
          </small>
        </div>
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = false" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
