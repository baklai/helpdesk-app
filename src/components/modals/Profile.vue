<script setup>
import { ref, computed, defineAsyncComponent } from 'vue';
import { useForm, useFieldArray } from 'vee-validate';
import * as yup from 'yup';
import { FilterMatchMode } from 'primevue/api';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const DataTable = defineAsyncComponent(() => import('primevue/datatable'));

import { useScope } from '@/stores/scopes';
import { useProfile } from '@/stores/api/profiles';

const toast = useToast();
const confirm = useConfirm();

const { findOne, createOne, updateOne, removeOne } = useProfile();
const { scopeLength, getDefaultScope, getSelectScope } = useScope();

const emits = defineEmits(['close']);

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      fullname: yup.string().required('Потрібно вказати значення'),
      email: yup.string().email().required('Потрібно вказати значення'),
      phone: yup.string().required('Потрібно вказати значення')
    }),
    initialValues: {
      isAdmin: false,
      isActivated: false,
      scope: getDefaultScope()
    }
  });

const { fields } = useFieldArray('scope');

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        const profile = await findOne({ id });
        setValues({ ...profile });
      } else {
        resetForm(
          {
            values: {
              isAdmin: false,
              isActivated: false,
              scope: getDefaultScope()
            }
          },
          { force: true }
        );
      }
      visible.value = true;
    } catch (err) {
      visible.value = false;
    }
  }
});

const visible = ref(false);

const [fullname, fullnameAttrs] = defineField('fullname');
const [email, emailAttrs] = defineField('email');
const [phone, phoneAttrs] = defineField('phone');
const [isAdmin, isAdminAttrs] = defineField('isAdmin');
const [isActivated, isActivatedAttrs] = defineField('isActivated');

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

const refSelectMenu = ref();
const selectOptions = ref([
  {
    label: 'Вибрати все',
    icon: 'pi pi-check-circle',
    command: () => {
      setValues({ scope: getSelectScope(true) });
    }
  },
  {
    label: 'Скасувати вибір усіх',
    icon: 'pi pi-minus-circle',
    command: () => {
      setValues({ scope: getSelectScope(false) });
    }
  },
  { separator: true },
  {
    label: 'Встановити за замовчуванням',
    icon: 'pi pi-verified',
    command: () => {
      setValues({ scope: getDefaultScope() });
    }
  }
]);

const columns = ref([
  { field: 'create', header: 'Create' },
  { field: 'read', header: 'Read' },
  { field: 'update', header: 'Update' },
  { field: 'delete', header: 'Delete' },
  { field: 'notice', header: 'Notice' }
]);

const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const selectScopeLength = computed(() => {
  let count = 0;
  values?.scope?.forEach((item, index, array) => {
    const keys = Object.keys(item);
    for (const key of keys) {
      if (typeof item[key] === 'boolean') {
        if (array[index][key]) {
          count++;
        }
      }
    }
  });
  return count;
});

const onCreateRecord = async () => {
  resetForm({ values: {} }, { force: true });
  toast.add({
    severity: 'success',
    summary: 'Інформація',
    detail: 'Введіть новий запис',
    life: 3000
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

const onSaveRecord = handleSubmit(async () => {
  try {
    if (values?.id) {
      await updateOne(values.id, {
        ...controlledValues.value,
        scope: values.scope
      });
    } else {
      await createOne({ ...controlledValues.value, scope: values.scope });
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

const onCloseModal = () => {
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

  <Menu ref="refSelectMenu" popup :model="selectOptions">
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
    class="mx-auto w-[90vw] md:w-[90vw] lg:w-[70vw] xl:w-[60vw] 2xl:w-[45vw]"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex w-full justify-between">
        <div class="flex items-center justify-center">
          <AppIcons name="core-profiles" :size="40" class="mr-4" />
          <div>
            <p class="line-height-2 text-lg font-bold">Профіль облікового запису</p>
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

    <form
      autocomplete="off"
      class="flex flex-col gap-y-4 md:flex-row md:flex-wrap"
      @submit.prevent="onSaveRecord"
    >
      <div class="flex flex-col space-y-4 md:!w-1/3 md:pr-2">
        <div class="flex flex-col gap-2">
          <label for="fullname" class="font-bold">Ім'я користувача</label>
          <InputText
            id="fullname"
            v-model="fullname"
            v-bind="fullnameAttrs"
            placeholder="Ім'я користувача"
            :invalid="!!errors?.fullname"
            aria-describedby="fullname-help"
          />
          <small id="fullname-help" class="text-red-500" v-if="errors?.fullname">
            {{ errors.fullname }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="email" class="font-bold">Email користувача</label>
          <InputText
            id="email"
            v-model="email"
            v-bind="emailAttrs"
            placeholder="Email користувача"
            :invalid="!!errors?.email"
            aria-describedby="email-help"
          />
          <small id="email-help" class="text-red-500" v-if="errors?.email">
            {{ errors.email }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="phone" class="font-bold">Телефон користувача</label>
          <InputMask
            date="phone"
            mask="+99(999)999-99-99"
            placeholder="+99(999)999-99-99"
            id="phone"
            v-model="phone"
            v-bind="phoneAttrs"
            :invalid="!!errors?.phone"
            aria-describedby="phone-help"
          />
          <small id="phone-help" class="text-red-500" v-if="errors?.phone">
            {{ errors.phone }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center">
            <Checkbox
              inputId="isActivated"
              binary
              v-model="isActivated"
              v-bind="isActivatedAttrs"
            />
            <label for="isActivated" class="ml-2 font-bold"> Активований обліковий запис </label>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center">
            <Checkbox inputId="isAdmin" binary v-model="isAdmin" v-bind="isAdminAttrs" />
            <label for="isAdmin" class="ml-2 font-bold"> Обліковий запис адміністратора </label>
          </div>
        </div>
      </div>

      <div class="flex flex-col space-y-4 md:!w-2/3 md:pl-2">
        <DataTable
          rowHover
          scrollable
          scrollHeight="flex"
          responsiveLayout="scroll"
          :value="fields"
          v-model:filters="filters"
          :globalFilterFields="['scope']"
          class="min-w-full overflow-x-auto"
          style="height: calc(400px)"
        >
          <template #header>
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex flex-wrap items-center gap-2">
                <i class="pi pi-unlock mr-2 text-2xl"></i>
                <div>
                  <p>Список дозволів</p>
                  <small class="text-surface-500">
                    {{ `Вибрано ${selectScopeLength} з ${scopeLength()} дозволів` }}
                  </small>
                </div>
              </div>
              <div class="flex w-full items-center justify-between gap-2 sm:w-max">
                <span class="relative w-full sm:w-max">
                  <i
                    class="pi pi-search absolute left-3 top-2/4 -mt-2 text-surface-400 dark:text-surface-600"
                  />
                  <InputText
                    id="name"
                    class="w-full !bg-inherit px-10 sm:w-max"
                    placeholder="Пошук"
                    v-model="filters['global'].value"
                  />
                  <i
                    v-show="!!filters['global'].value"
                    class="pi pi-times absolute right-3 top-2/4 -mt-2 cursor-pointer text-surface-400 hover:!text-primary-500 dark:text-surface-600"
                    v-tooltip.bottom="'Очистити фільтр'"
                    @click="filters['global'].value = null"
                  />
                </span>

                <div class="flex justify-between gap-2">
                  <Button
                    text
                    plain
                    icon="pi pi-cog"
                    class="h-12 w-12 text-2xl"
                    v-tooltip.bottom="'Опції'"
                    @click="event => refSelectMenu.toggle(event)"
                  />
                </div>
              </div>
            </div>
          </template>

          <template #empty>
            <div class="text-center">
              <h5>Записів не знайдено</h5>
              <p>Спробуйте змінити пошукові терміни у фільтрі</p>
            </div>
          </template>

          <Column frozen field="scope" filterField="scope" header="Дозволи" class="font-bold">
            <template #body="{ data }">
              {{ data.value.comment }}
            </template>
          </Column>

          <Column
            v-for="col of columns"
            :key="col.field"
            :field="col.field"
            :header="col.header"
            headerClass="text-center"
            class="text-center"
          >
            <template #body="{ data, field }">
              <Checkbox
                v-model="data.value[field]"
                :binary="true"
                v-if="data.value[field] !== undefined"
              />
              <span v-else class="text-surface-500">-</span>
            </template>
          </Column>
        </DataTable>
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" label="Скасувати" @click="visible = !visible" />
      <Button text plain icon="pi pi-check" label="Зберегти" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
