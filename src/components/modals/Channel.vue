<script setup>
import { ref } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

import { useChannel } from '@/stores/api/channels';

const toast = useToast();
const confirm = useConfirm();

const { findOne, createOne, updateOne, removeOne } = useChannel();

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      locationFrom: yup.string().required('Потрібно вказати значення'),
      unitFrom: yup.string().required('Потрібно вказати значення'),
      locationTo: yup.string().required('Потрібно вказати значення'),
      unitTo: yup.string().required('Потрібно вказати значення'),
      level: yup.string().required('Потрібно вказати значення'),
      type: yup.string().required('Потрібно вказати значення'),
      speed: yup.string().required('Потрібно вказати значення'),
      status: yup.string().required('Потрібно вказати значення'),
      operator: yup.string().required('Потрібно вказати значення'),
      composition: yup.string().required('Потрібно вказати значення')
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
    label: 'Створити запис',
    icon: 'pi pi-plus-circle',
    command: async () => await onCreateRecord()
  },
  {
    label: 'Зберегти запис',
    icon: 'pi pi-save',
    command: async () => await onSaveRecord()
  },
  {
    label: 'Видалити запис',
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
    summary: 'Інформація',
    detail: 'Введіть новий запис',
    life: 5000
  });
};

const onRemoveRecord = async () => {
  if (!values?.id) {
    return toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Запис не вибрано',
      life: 5000
    });
  }
  confirm.require({
    message: 'Ви бажаєте видалити цей запис?',
    header: 'Підтвердити видалення запису',
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      try {
        await removeOne(values);
        toast.add({
          severity: 'success',
          summary: 'Інформація',
          detail: 'Запис видалено',
          life: 5000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: 'Попередження',
          detail: 'Запис не видалено',
          life: 5000
        });
      } finally {
        visible.value = false;
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Інформація',
        detail: 'Видалення запису не підтверджено',
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
      summary: 'Інформація',
      detail: values?.id ? 'Запис оновлено' : 'Запис створено',
      life: 5000
    });
    visible.value = false;
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: values?.id ? 'Запис не оновлено' : 'Запис не створено',
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
      <div class="flex w-full justify-between">
        <div class="flex items-center justify-center">
          <AppIcons name="network-channels" :size="40" class="mr-4" />
          <div>
            <p class="line-height-2 text-lg font-bold">Мережевий канал</p>
            <p class="line-height-2 text-base font-normal text-surface-500">
              {{ values?.id ? 'Редагувати обраний запис' : 'Створити новий запис' }}
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
            v-tooltip.bottom="'Меню опцій'"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <form class="flex flex-col gap-y-4 md:flex-row md:flex-wrap" @submit.prevent="onSaveRecord">
      <div class="flex flex-col space-y-4 md:w-1/2 md:pr-2">
        <div class="flex flex-col gap-2">
          <label for="locationFrom" class="font-bold">Початкове розташування</label>
          <InputText
            id="locationFrom"
            v-model="locationFrom"
            v-bind="locationFromAttrs"
            placeholder="Початкове розташування"
            :invalid="!!errors?.locationFrom"
            aria-describedby="locationFrom-help"
          />
          <small id="locationFrom-help" class="text-red-500" v-if="errors?.locationFrom">
            {{ errors.locationFrom }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="unitFrom" class="font-bold">Початковий пристрій</label>
          <InputText
            id="unitFrom"
            v-model="unitFrom"
            v-bind="unitFromAttrs"
            placeholder="Початковий пристрій"
            :invalid="!!errors?.unitFrom"
            aria-describedby="unitFrom-help"
          />
          <small id="unitFrom-help" class="text-red-500" v-if="errors?.unitFrom">
            {{ errors.unitFrom }}
          </small>
        </div>
      </div>

      <div class="flex flex-col space-y-4 md:w-1/2 md:pl-2">
        <div class="flex flex-col gap-2">
          <label for="locationTo" class="font-bold">Кінцеве розташування</label>
          <InputText
            id="locationTo"
            v-model="locationTo"
            v-bind="locationToAttrs"
            placeholder="Кінцеве розташування"
            :invalid="!!errors?.locationTo"
            aria-describedby="locationTo-help"
          />
          <small id="locationTo-help" class="text-red-500" v-if="errors?.locationTo">
            {{ errors.locationTo }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="unitTo" class="font-bold">Кінцевий пристрій</label>
          <InputText
            id="unitTo"
            v-model="unitTo"
            v-bind="unitToAttrs"
            placeholder="Кінцевий пристрій"
            :invalid="!!errors?.unitTo"
            aria-describedby="unitTo-help"
          />
          <small id="unitTo-help" class="text-red-500" v-if="errors?.unitTo">
            {{ errors.unitTo }}
          </small>
        </div>
      </div>

      <div class="flex w-full flex-col space-y-4">
        <div class="flex flex-col gap-2">
          <label for="level" class="font-bold">Рівень</label>
          <InputText
            id="level"
            v-model="level"
            v-bind="levelAttrs"
            placeholder="Рівень"
            :invalid="!!errors?.level"
            aria-describedby="level-help"
          />
          <small id="level-help" class="text-red-500" v-if="errors?.level">
            {{ errors.level }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="type" class="font-bold">Тип</label>
          <InputText
            id="type"
            v-model="type"
            v-bind="typeAttrs"
            placeholder="Тип"
            :invalid="!!errors?.type"
            aria-describedby="type-help"
          />
          <small id="type-help" class="text-red-500" v-if="errors?.type">
            {{ errors.type }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="speed" class="font-bold">Швидкість</label>
          <InputText
            id="speed"
            v-model="speed"
            v-bind="speedAttrs"
            placeholder="Швидкість"
            :invalid="!!errors?.speed"
            aria-describedby="speed-help"
          />
          <small id="speed-help" class="text-red-500" v-if="errors?.speed">
            {{ errors.speed }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="status" class="font-bold">Статус</label>
          <InputText
            id="status"
            v-model="status"
            v-bind="statusAttrs"
            placeholder="Статус"
            :invalid="!!errors?.status"
            aria-describedby="status-help"
          />
          <small id="status-help" class="text-red-500" v-if="errors?.status">
            {{ errors.status }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="operator" class="font-bold">Оператор</label>
          <InputText
            id="operator"
            v-model="operator"
            v-bind="operatorAttrs"
            placeholder="Оператор"
            :invalid="!!errors?.operator"
            aria-describedby="operator-help"
          />
          <small id="operator-help" class="text-red-500" v-if="errors?.operator">
            {{ errors.operator }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="composition" class="font-bold">Склад</label>
          <Textarea
            rows="5"
            id="composition"
            v-model="composition"
            v-bind="compositionAttrs"
            placeholder="Склад"
            :invalid="!!errors?.composition"
            aria-describedby="composition-help"
          />
          <small id="composition-help" class="text-red-500" v-if="errors?.composition">
            {{ errors.composition }}
          </small>
        </div>
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" label="Скасувати" @click="visible = false" />
      <Button text plain icon="pi pi-check" label="Зберегти" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
