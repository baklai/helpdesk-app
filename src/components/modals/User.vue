<script setup>
import { ref, computed } from 'vue';
import { useForm, useFieldArray } from 'vee-validate';
import * as yup from 'yup';
import { FilterMatchMode } from 'primevue/api';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { useScope } from '@/stores/scope';
import { useUser } from '@/stores/api/users';

const { t } = useI18n();
const toast = useToast();

const { findOne, createOne, updateOne, removeOne } = useUser();
const { scopeLength, getDefaultScope, getSelectScope } = useScope();

const emits = defineEmits(['close']);

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
    login: yup.string().required(),
    fullname: yup.string().required(),
    email: yup.string().email().required(),
    phone: yup.string().required()
    // password: yup.string().when('$exist', {
    //   is: exist => exist,
    //   then: yup.string().min(6).required(),
    //   otherwise: yup.string()
    // })
  }),
  initialValues: {
    isActive: false,
    isAdmin: false,
    scope: getDefaultScope()
  }
});

const { fields } = useFieldArray('scope');

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        const user = await findOne({ id });
        setValues({ ...user });
      } else {
        resetForm(
          {
            values: {
              isActive: false,
              isAdmin: false,
              scope: getDefaultScope()
            }
          },
          { force: true }
        );
      }
      visible.value = true;
      setTimeout(() => {
        readonly.value = false;
      }, 500);
    } catch (err) {
      visible.value = false;
    }
  }
});

const readonly = ref(true);
const visible = ref(false);

const login = defineComponentBinds('login');
const password = defineComponentBinds('password');
const fullname = defineComponentBinds('fullname');
const email = defineComponentBinds('email');
const phone = defineComponentBinds('phone');
const isActive = defineComponentBinds('isActive');
const isAdmin = defineComponentBinds('isAdmin');

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
  { field: 'delete', header: t('Delete') }
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

const onCloseModal = () => {
  resetForm({ values: {} }, { force: true });
  readonly.value = true;
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
      await updateOne(values.id, {
        ...controlledValues.value,
        scope: values.scope
      });
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
      await createOne({ ...controlledValues.value, scope: values.scope });
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

  <Menu ref="refSelectMenu" popup :model="selectOptions" />

  <Dialog
    modal
    closable
    :draggable="false"
    v-model:visible="visible"
    style="width: 800px"
    class="p-fluid"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-content-between w-full">
        <div class="flex align-items-center justify-content-center">
          <AppIcons name="core-users" :size="40" class="mr-2" />
          <div>
            <p class="text-lg font-bold line-height-2 mb-2">
              {{ $t('User account') }}
            </p>
            <p class="text-base font-normal line-height-2 text-color-secondary mb-0">
              {{ values?.id ? $t('Edit selected record') : $t('Create new record') }}
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

    <form @submit.prevent="onSaveRecord" autocomplete="off">
      <div class="formgrid grid">
        <div class="field col-12 xl:col-4">
          <div class="field">
            <label class="font-bold">{{ $t('User login') }}</label>
            <InputText
              :readonly="readonly"
              v-bind="login"
              :placeholder="$t('User login')"
              :class="{ 'p-invalid': !!errors?.login }"
            />
            <small class="p-error" v-if="errors?.login">
              {{ $t(errors.login) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">
              {{ $t('User password') }}
            </label>
            <Password
              toggleMask
              :readonly="readonly"
              v-bind="password"
              :placeholder="$t('User password')"
              :promptLabel="$t('Choose a password')"
              :weakLabel="$t('Too simple')"
              :mediumLabel="$t('Average complexity')"
              :strongLabel="$t('Complex password')"
              :class="{ 'p-invalid': !!errors?.password }"
            >
              <template #header>
                <h6>{{ $t('Pick a password') }}</h6>
              </template>
              <template #footer>
                <Divider />
                <p class="mt-2">{{ $t('Suggestions') }}</p>
                <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                  <li>{{ $t('At least one lowercase') }}</li>
                  <li>{{ $t('At least one uppercase') }}</li>
                  <li>{{ $t('At least one numeric') }}</li>
                  <li>{{ $t('Minimum 6 characters') }}</li>
                </ul>
              </template>
            </Password>
            <small class="p-error" v-if="errors?.password">
              {{ $t(errors.password) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('User name') }}</label>
            <InputText
              v-bind="fullname"
              :placeholder="$t('User name')"
              :class="{ 'p-invalid': !!errors?.fullname }"
            />
            <small class="p-error" v-if="errors?.fullname">
              {{ $t(errors.fullname) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('User email') }}</label>
            <InputText
              v-bind="email"
              :placeholder="$t('User email')"
              :class="{ 'p-invalid': !!errors?.email }"
            />
            <small class="p-error" v-if="errors?.email">
              {{ $t(errors.email) }}
            </small>
          </div>

          <div class="field">
            <label class="font-bold">{{ $t('User phone') }}</label>
            <InputMask
              date="phone"
              mask="+99(999)999-99-99"
              placeholder="+99(999)999-99-99"
              v-bind="phone"
              :class="{ 'p-invalid': !!errors?.phone }"
            />
            <small class="p-error" v-if="errors?.phone">
              {{ $t(errors.phone) }}
            </small>
          </div>

          <div class="field">
            <div class="flex align-items-center">
              <Checkbox binary v-bind="isActive" />
              <label class="font-bold ml-2">
                {{ $t('Activated account') }}
              </label>
            </div>
          </div>

          <div class="field">
            <div class="flex align-items-center">
              <Checkbox binary v-bind="isAdmin" />
              <label class="font-bold ml-2"> {{ $t('Admin account') }} </label>
            </div>
          </div>
        </div>

        <div class="field col-12 xl:col-8">
          <div class="field">
            <!-- <div v-for="(field, idx) in fields" :key="field.key">
              <input v-model="field.value.scope" type="url" />
            </div> -->

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
                <div class="flex flex-wrap gap-4 align-items-center justify-content-between">
                  <div class="flex flex-wrap gap-2 align-items-center">
                    <i class="pi pi-unlock text-2xl mr-2"></i>
                    <div>
                      <p class="text-color m-0">
                        {{ $t('Scope list') }}
                      </p>
                      <small class="text-color-secondary">
                        {{ $t(`Select ${selectScopeLength} of ${scopeLength()} scopes`) }}
                      </small>
                    </div>
                  </div>
                  <div
                    class="flex gap-2 align-items-center justify-content-between sm:w-max w-full"
                  >
                    <span class="p-input-icon-left p-input-icon-right sm:w-max w-full">
                      <i class="pi pi-search" />
                      <InputText
                        size="small"
                        class="sm:w-max w-full"
                        :placeholder="$t('Search scope')"
                        v-model="filters['global'].value"
                      />
                      <i
                        class="pi pi-times cursor-pointer hover:text-color"
                        v-tooltip.bottom="$t('Clear filter')"
                        @click="filters['global'].value = null"
                      />
                    </span>

                    <div class="flex gap-2 justify-content-between">
                      <Button
                        text
                        plain
                        rounded
                        icon="pi pi-cog"
                        iconClass="text-2xl"
                        class="p-button-lg hover:text-color h-3rem w-3rem"
                        v-tooltip.bottom="$t('Scope option')"
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

              <Column
                frozen
                field="scope"
                filterField="scope"
                :header="$t('Scope')"
                class="font-bold"
              >
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
                  <span v-else class="text-color-secondary">-</span>
                </template>
              </Column>
            </DataTable>
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

<style scoped>
::v-deep(.p-datatable-header) {
  background: var(--surface-overlay);
}

::v-deep(.p-datatable .p-datatable-thead > tr > th) {
  background: var(--surface-overlay);
}

::v-deep(.p-datatable .p-datatable-tbody > tr) {
  background: var(--surface-overlay);
}

::v-deep(tr.p-datatable-emptymessage > td) {
  border: none;
}

::v-deep(tr.p-datatable-emptymessage:hover) {
  background: none !important;
}

::v-deep(.p-datatable .p-datatable-tbody > tr:not(.p-highlight):hover) {
  background: var(--surface-ground);
}

::v-deep(.p-datatable .p-datatable-tbody > tr:not(.p-highlight):focus) {
  background-color: var(--surface-ground);
}

::v-deep(.p-datatable.p-datatable-sm .p-datatable-tbody > tr > td) {
  padding: 0.3rem 0.3rem;
}

::v-deep(.p-input-icon-right > svg) {
  right: 0.5rem !important;
  cursor: pointer;
}

::v-deep(.p-datatable .p-column-header-content) {
  display: block;
}
</style>
