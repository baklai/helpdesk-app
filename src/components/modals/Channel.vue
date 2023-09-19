<script setup>
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { useChannel } from '@/stores/api/channels';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();
const { $init, findOne, createOne, updateOne, removeOne } = useChannel();

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        record.value = $init(await findOne({ id }));
      } else {
        record.value = $init({});
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

const record = ref({});

const $validate = useVuelidate(
  {
    locationFrom: { required },
    unitFrom: { required },
    locationTo: { required },
    unitTo: { required },
    level: { required },
    type: { required },
    speed: { required },
    status: { required },
    operator: { required },
    composition: { required }
  },
  record
);

const onCloseModal = () => {
  record.value = $init({});
  $validate.value.$reset();
  emits('close', {});
};

const onCreateRecord = async () => {
  record.value = $init({});
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
          await removeOne(record.value);
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
        await updateOne(record.value);
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
        await createOne(record.value);
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
              {{ record?.id ? $t('Edit current record') : $t('Create new record') }}
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
              v-model="record.locationFrom"
              :placeholder="$t('Location start')"
              :class="{ 'p-invalid': !!$validate.locationFrom.$errors.length }"
            />
            <small
              class="p-error"
              v-for="error in $validate.locationFrom.$errors"
              :key="error.$uid"
            >
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Unit start') }}</label>
            <InputText
              v-model="record.unitFrom"
              :placeholder="$t('Unit start')"
              :class="{ 'p-invalid': !!$validate.unitFrom.$errors.length }"
            />
            <small class="p-error" v-for="error in $validate.unitFrom.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
            </small>
          </div>
        </div>

        <div class="field col">
          <div class="field">
            <label class="font-bold">{{ $t('Location end') }}</label>
            <InputText
              v-model="record.locationTo"
              :placeholder="$t('Location end')"
              :class="{ 'p-invalid': !!$validate.locationTo.$errors.length }"
            />
            <small class="p-error" v-for="error in $validate.locationTo.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Unit end') }}</label>
            <InputText
              v-model="record.unitTo"
              :placeholder="$t('Unit end')"
              :class="{ 'p-invalid': !!$validate.unitTo.$errors.length }"
            />
            <small class="p-error" v-for="error in $validate.unitTo.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
            </small>
          </div>
        </div>

        <div class="field col-12">
          <div class="field">
            <label class="font-bold">{{ $t('Level') }}</label>
            <InputText
              v-model="record.level"
              :placeholder="$t('Level')"
              :class="{ 'p-invalid': !!$validate.level.$errors.length }"
            />
            <small class="p-error" v-for="error in $validate.level.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Type') }}</label>
            <InputText
              v-model="record.type"
              :placeholder="$t('Type')"
              :class="{ 'p-invalid': !!$validate.type.$errors.length }"
            />
            <small class="p-error" v-for="error in $validate.type.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Speed') }}</label>
            <InputText
              v-model="record.speed"
              :placeholder="$t('Speed')"
              :class="{ 'p-invalid': !!$validate.speed.$errors.length }"
            />
            <small class="p-error" v-for="error in $validate.speed.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Status') }}</label>
            <InputText
              v-model="record.status"
              :placeholder="$t('Status')"
              :class="{ 'p-invalid': !!$validate.status.$errors.length }"
            />
            <small class="p-error" v-for="error in $validate.status.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Operator') }}</label>
            <InputText
              v-model="record.operator"
              :placeholder="$t('Operator')"
              :class="{ 'p-invalid': !!$validate.operator.$errors.length }"
            />
            <small class="p-error" v-for="error in $validate.operator.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('Composition') }}</label>
            <Textarea
              rows="5"
              cols="10"
              v-model="record.composition"
              :placeholder="$t('Composition')"
              :class="{ 'p-invalid': !!$validate.composition.$errors.length }"
            />
            <small class="p-error" v-for="error in $validate.composition.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
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

<style scoped></style>
