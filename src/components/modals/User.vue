<script setup>
import { ref, computed } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, integer, email, between, requiredIf } from '@vuelidate/validators';
import { FilterMatchMode } from 'primevue/api';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { useScope } from '@/stores/scope';
import { useUser } from '@/stores/api/users';

const { t } = useI18n();
const toast = useToast();

const { $init, findOne, createOne, updateOne, removeOne } = useUser();
const { scopeLength, getDefaultScope, getSelectScope } = useScope();

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
      record.value.scope = getSelectScope(true);
    }
  },
  {
    label: t('Unselect all'),
    icon: 'pi pi-minus-circle',
    command: () => {
      record.value.scope = getSelectScope(false);
    }
  },
  { separator: true },
  {
    label: t('Set default'),
    icon: 'pi pi-verified',
    command: () => {
      record.value.scope = getDefaultScope();
    }
  }
]);

const record = ref({});

const columns = ref([
  { field: 'create', header: t('Create') },
  { field: 'read', header: t('Read') },
  { field: 'update', header: t('Update') },
  { field: 'delete', header: t('Delete') }
]);

const filters = ref({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });

const selectScopeLength = computed(() => {
  let count = 0;
  record.value?.scope?.forEach((item, index, array) => {
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

const $validate = useVuelidate(
  {
    login: { required },
    password: {
      requiredIf: requiredIf(function () {
        return record.value?.id === null;
      })
    },
    fullname: { required },
    email: { required, email },
    phone: { required },
    timeout: { required, integer, betweenValue: between(5, 90) }
  },
  record
);

const onCloseModal = () => {
  record.value = $init({});
  $validate.value.$reset();
  readonly.value = true;
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

const onCellEditComplete = event => {
  let { data, newValue, field } = event;
  data[field] = newValue;
};
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
            <p class="text-lg font-bold line-height-2 mb-0">{{ $t('User account') }}</p>
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

    <form @submit.prevent="onSaveRecord" autocomplete="off">
      <div class="formgrid grid">
        <div class="field col-12 xl:col-4">
          <div class="field">
            <label for="login" class="font-bold">{{ $t('User login') }}</label>
            <InputText
              id="login"
              :readonly="readonly"
              aria-describedby="login-help"
              v-model="record.login"
              :placeholder="$t('User login')"
              :class="{ 'p-invalid': !!$validate.login.$errors.length }"
            />
            <small
              id="login-help"
              class="p-error"
              v-for="error in $validate.login.$errors"
              :key="error.$uid"
            >
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label for="password" class="font-bold">
              {{ $t('User password') }}
            </label>
            <Password
              toggleMask
              :readonly="readonly"
              id="password"
              aria-describedby="password-help"
              v-model="record.password"
              :placeholder="$t('User password')"
              :promptLabel="$t('Choose a password')"
              :weakLabel="$t('Too simple')"
              :mediumLabel="$t('Average complexity')"
              :strongLabel="$t('Complex password')"
              :class="{ 'p-invalid': !!$validate.password.$errors.length }"
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
            <small
              id="password-help"
              class="p-error"
              v-for="error in $validate.password.$errors"
              :key="error.$uid"
            >
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label for="fullname" class="font-bold">{{ $t('User name') }}</label>
            <InputText
              id="fullname"
              aria-describedby="fullname-help"
              v-model="record.fullname"
              :placeholder="$t('User name')"
              :class="{ 'p-invalid': !!$validate.fullname.$errors.length }"
            />
            <small
              id="fullname-help"
              class="p-error"
              v-for="error in $validate.fullname.$errors"
              :key="error.$uid"
            >
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label for="email" class="font-bold">{{ $t('User email') }}</label>
            <InputText
              id="email"
              aria-describedby="email-help"
              v-model="record.email"
              :placeholder="$t('User email')"
              :class="{ 'p-invalid': !!$validate.email.$errors.length }"
            />
            <small
              id="email-help"
              class="p-error"
              v-for="error in $validate.email.$errors"
              :key="error.$uid"
            >
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label for="phone" class="font-bold">{{ $t('User phone') }}</label>
            <InputMask
              id="phone"
              date="phone"
              mask="+99(999)999-99-99"
              placeholder="+38(999)999-99-99"
              v-model="record.phone"
              :class="{ 'p-invalid': !!$validate.phone.$errors.length }"
            />
            <small
              id="phone-help"
              class="p-error"
              v-for="error in $validate.phone.$errors"
              :key="error.$uid"
            >
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label for="phone" class="font-bold">{{ $t('Session timeout') }}</label>
            <InputNumber
              :min="5"
              :max="90"
              showButtons
              id="timeout"
              mode="decimal"
              inputId="minmax-buttons"
              v-model="record.timeout"
              :placeholder="$t('Session timeout')"
              :class="{ 'p-invalid': !!$validate.timeout.$errors.length }"
            />
            <small
              id="timeout-help"
              class="p-error"
              v-for="error in $validate.timeout.$errors"
              :key="error.$uid"
            >
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <div class="flex align-items-center">
              <Checkbox binary v-model="record.isActive" inputId="isActive" />
              <label for="isActive" class="font-bold ml-2"> {{ $t('Activated account') }} </label>
            </div>
          </div>

          <div class="field">
            <div class="flex align-items-center">
              <Checkbox binary v-model="record.isAdmin" inputId="isAdmin" />
              <label for="isAdmin" class="font-bold ml-2"> {{ $t('Admin account') }} </label>
            </div>
          </div>
        </div>

        <div class="field col-12 xl:col-8">
          <div class="field">
            <DataTable
              rowHover
              scrollable
              editMode="cell"
              scrollHeight="flex"
              responsiveLayout="scroll"
              v-model:value="record.scope"
              v-model:filters="filters"
              :globalFilterFields="['scope']"
              class="min-w-full overflow-x-auto"
              style="height: calc(400px)"
              @cell-edit-complete="onCellEditComplete"
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

              <Column frozen field="scope" filterField="scope" header="Scope" class="font-bold">
                <template #body="slotProps">
                  {{ slotProps.data.comment }}
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
                  <i
                    v-if="data[field] !== undefined"
                    class="pi"
                    :class="
                      data[field] ? 'pi-check-square text-primary' : 'pi-stop text-color-secondary'
                    "
                  />
                  <span v-else class="text-color-secondary">-</span>
                </template>
                <template #editor="{ data, field }">
                  <Checkbox v-model="data[field]" :binary="true" v-if="data[field] !== undefined" />
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
