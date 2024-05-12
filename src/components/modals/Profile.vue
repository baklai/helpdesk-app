<script setup>
import { ref, computed, defineAsyncComponent } from 'vue';
import { useForm, useFieldArray } from 'vee-validate';
import * as yup from 'yup';
import { FilterMatchMode } from 'primevue/api';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';

const DataTable = defineAsyncComponent(() => import('primevue/datatable'));

import { useScope } from '@/stores/scopes';
import { useProfile } from '@/stores/api/profiles';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const { findOne, createOne, updateOne, removeOne } = useProfile();
const { scopeLength, getDefaultScope, getSelectScope } = useScope();

const emits = defineEmits(['close']);

const { values, errors, handleSubmit, controlledValues, setValues, resetForm, defineField } =
  useForm({
    validationSchema: yup.object({
      fullname: yup.string().required(t('Value is required')),
      email: yup.string().email().required(t('Value is required')),
      phone: yup.string().required(t('Value is required'))
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

const refSelectMenu = ref();
const selectOptions = ref([
  {
    label: t('Select all'),
    icon: 'pi pi-check-circle',
    command: () => {
      setValues({ scope: getSelectScope(true) });
    }
  },
  {
    label: t('Unselect all'),
    icon: 'pi pi-minus-circle',
    command: () => {
      setValues({ scope: getSelectScope(false) });
    }
  },
  { separator: true },
  {
    label: t('Set default'),
    icon: 'pi pi-verified',
    command: () => {
      setValues({ scope: getDefaultScope() });
    }
  }
]);

const columns = ref([
  { field: 'create', header: t('Create') },
  { field: 'read', header: t('Read') },
  { field: 'update', header: t('Update') },
  { field: 'delete', header: t('Delete') },
  { field: 'notice', header: t('Notice') }
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
    summary: t('Information'),
    detail: t('Input new record'),
    life: 3000
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
      <div class="flex justify-between w-full">
        <div class="flex items-center justify-center">
          <AppIcons name="core-profiles" :size="40" class="mr-4" />
          <div>
            <p class="text-lg font-bold line-height-2">
              {{ $t('Profile account') }}
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

    <form
      autocomplete="off"
      class="flex flex-col gap-y-4 md:flex-row md:flex-wrap"
      @submit.prevent="onSaveRecord"
    >
      <div class="flex flex-col space-y-4 md:!w-1/3 md:pr-2">
        <div class="flex flex-col gap-2">
          <label for="fullname" class="font-bold">{{ $t('User name') }}</label>
          <InputText
            id="fullname"
            v-model="fullname"
            v-bind="fullnameAttrs"
            :placeholder="$t('User name')"
            :invalid="!!errors?.fullname"
            aria-describedby="fullname-help"
          />
          <small id="fullname-help" class="text-red-500" v-if="errors?.fullname">
            {{ $t(errors.fullname) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="email" class="font-bold">{{ $t('User email') }}</label>
          <InputText
            id="email"
            v-model="email"
            v-bind="emailAttrs"
            :placeholder="$t('User email')"
            :invalid="!!errors?.email"
            aria-describedby="email-help"
          />
          <small id="email-help" class="text-red-500" v-if="errors?.email">
            {{ $t(errors.email) }}
          </small>
        </div>

        <div class="flex flex-col gap-2">
          <label for="phone" class="font-bold">{{ $t('User phone') }}</label>
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
            {{ $t(errors.phone) }}
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
            <label for="isActivated" class="font-bold ml-2">
              {{ $t('Activated account') }}
            </label>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <div class="flex items-center">
            <Checkbox inputId="isAdmin" binary v-model="isAdmin" v-bind="isAdminAttrs" />
            <label for="isAdmin" class="font-bold ml-2"> {{ $t('Admin account') }} </label>
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
            <div class="flex flex-wrap gap-4 items-center justify-between">
              <div class="flex flex-wrap gap-2 items-center">
                <i class="pi pi-unlock text-2xl mr-2"></i>
                <div>
                  <p>
                    {{ $t('Scope list') }}
                  </p>
                  <small class="text-surface-500">
                    {{ $t('Select scopes', [selectScopeLength, scopeLength()]) }}
                  </small>
                </div>
              </div>
              <div class="flex gap-2 items-center justify-between sm:w-max w-full">
                <span class="relative sm:w-max w-full">
                  <i
                    class="pi pi-search absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
                  />
                  <InputText
                    id="name"
                    class="sm:w-max w-full px-10 !bg-inherit"
                    :placeholder="$t('Search')"
                    v-model="filters['global'].value"
                  />
                  <i
                    v-show="!!filters['global'].value"
                    class="pi pi-times cursor-pointer absolute top-2/4 -mt-2 right-3 text-surface-400 dark:text-surface-600 hover:!text-primary-500"
                    v-tooltip.bottom="$t('Clear filter')"
                    @click="filters['global'].value = null"
                  />
                </span>

                <div class="flex gap-2 justify-between">
                  <Button
                    text
                    plain
                    icon="pi pi-cog"
                    class="h-12 w-12 text-2xl"
                    v-tooltip.bottom="$t('Options')"
                    @click="event => refSelectMenu.toggle(event)"
                  />
                </div>
              </div>
            </div>
          </template>

          <template #empty>
            <div class="text-center">
              <h5>{{ $t('No records found') }}</h5>
              <p>{{ $t('Try changing the search terms in the filter') }}</p>
            </div>
          </template>

          <Column frozen field="scope" filterField="scope" :header="$t('Scope')" class="font-bold">
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
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="visible = !visible" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>
