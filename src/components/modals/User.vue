<script setup>
import { ref } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, integer, email, between, requiredIf } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useScope } from '@/stores/scope';
import { useUser } from '@/stores/api/users';

const { t } = useI18n();
const toast = useToast();

const User = useUser();
const Scope = useScope();

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    try {
      if (id) {
        record.value = await User.findOne({ id });
        scopeGroups.value = Scope.scopeGroups();
        record.value?.scope?.forEach((scope) => {
          scopeGroups.value.forEach((group) => {
            group.items.forEach((item) => {
              if (item.scope === scope) {
                item.value = true;
              }
            });
          });
        });
      } else {
        record.value = User.$reset();
        scopeGroups.value = Scope.scopeGroups();
      }
      visible.value = true;
      setTimeout(() => {
        readonly.value = false;
      }, 500);
    } catch (err) {
      visible.value = false;
      record.value = User.$reset();
      $validate.value.$reset();
      readonly.value = false;
      toast.add({ severity: 'warn', summary: t('HD Warning'), detail: t(err.message), life: 3000 });
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

const record = ref({});
const scopeGroups = ref([]);

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

const onClose = () => {
  visible.value = false;
  $validate.value.$reset();
  record.value = User.$reset();
  readonly.value = true;
  emits('close', {});
};

const setDefaultScope = () => {
  scopeGroups.value = Scope.scopeGroups();
  scopeGroups.value.forEach((group) => {
    group.items.forEach((item) => {
      item.value = item?.default || false;
    });
  });
};

const selectAllScope = () => {
  scopeGroups.value = Scope.scopeGroups();
  scopeGroups.value.forEach((group) => {
    group.items.forEach((item) => {
      item.value = true;
    });
  });
};

const unselectAllScope = () => {
  scopeGroups.value = Scope.scopeGroups();
  scopeGroups.value.forEach((group) => {
    group.items.forEach((item) => {
      item.value = false;
    });
  });
};

const onCreateRecord = async () => {
  record.value = User.$reset();
  scopeGroups.value = Scope.scopeGroups();
  $validate.value.$reset();
  toast.add({
    severity: 'success',
    summary: t('HD Information'),
    detail: t('Input new record'),
    life: 3000
  });
};

const onRemoveRecord = async () => {
  if (record.value?.id) {
    await User.removeOne(record.value);
    $validate.value.$reset();
    toast.add({
      severity: 'success',
      summary: t('HD Information'),
      detail: t('Record is removed'),
      life: 3000
    });
    onClose();
  } else {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t('Record not selected'),
      life: 3000
    });
  }
};

const onSaveRecord = async () => {
  const valid = await $validate.value.$validate();
  if (valid) {
    record.value.scope = scopeGroups.value
      .map((group) => group.items)
      .flat()
      .filter((item) => item.value)
      .map((item) => item.scope);

    if (record?.value?.id) {
      await User.updateOne(record.value);
      toast.add({
        severity: 'success',
        summary: t('HD Information'),
        detail: t('Record is updated'),
        life: 3000
      });
    } else {
      await User.createOne(record.value);
      toast.add({
        severity: 'success',
        summary: t('HD Information'),
        detail: t('Record is created'),
        life: 3000
      });
    }
    onClose();
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
    :style="{ width: '800px' }"
    class="p-fluid"
    @hide="onClose"
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
            @click="(event) => refMenu.toggle(event)"
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
            <small id="login-help" class="p-error" v-for="error in $validate.login.$errors" :key="error.$uid">
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
            <small id="password-help" class="p-error" v-for="error in $validate.password.$errors" :key="error.$uid">
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
            <small id="fullname-help" class="p-error" v-for="error in $validate.fullname.$errors" :key="error.$uid">
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
            <small id="email-help" class="p-error" v-for="error in $validate.email.$errors" :key="error.$uid">
              {{ $t(error.$message) }}
            </small>
          </div>

          <div class="field">
            <label for="phone" class="font-bold">{{ $t('User phone') }}</label>
            <InputMask
              id="phone"
              date="phone"
              mask="+99(999) 999-99-99"
              placeholder="+38(999) 999-99-99"
              v-model="record.phone"
              :class="{ 'p-invalid': !!$validate.phone.$errors.length }"
            />
            <small id="phone-help" class="p-error" v-for="error in $validate.phone.$errors" :key="error.$uid">
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
            <small id="timeout-help" class="p-error" v-for="error in $validate.timeout.$errors" :key="error.$uid">
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
            <div class="flex flex-wrap gap-4 mb-2 align-items-center justify-content-between">
              <div class="flex flex-wrap gap-2 align-items-center">
                <p class="text-color m-0">
                  <label for="phone" class="font-bold">{{ $t('Scope list') }}</label>
                </p>
              </div>
              <div class="flex gap-2 sm:w-max w-full justify-content-between">
                <Button
                  text
                  plain
                  rounded
                  icon="pi pi-minus-circle"
                  iconClass="text-xl"
                  class="p-button-lg hover:text-color h-3rem w-3rem"
                  v-tooltip.bottom="$t('Unselect all')"
                  @click="unselectAllScope"
                />

                <Button
                  text
                  plain
                  rounded
                  icon="pi pi-check-circle"
                  iconClass="text-xl"
                  class="p-button-lg hover:text-color h-3rem w-3rem"
                  v-tooltip.bottom="$t('Select all')"
                  @click="selectAllScope"
                />

                <Button
                  text
                  plain
                  rounded
                  icon="pi pi-verified"
                  iconClass="text-xl"
                  class="p-button-lg hover:text-color h-3rem w-3rem"
                  v-tooltip.bottom="$t('Set default')"
                  @click="setDefaultScope"
                />
              </div>
            </div>

            <div class="border-1 border-solid border-round surface-border h-30rem overflow-y-auto">
              <Accordion class="accordion-custom m-2">
                <AccordionTab v-for="(group, index) in scopeGroups" :key="`group-tab-${index}`">
                  <template #header>
                    <i :class="group.icon" class="mr-2" />
                    <span>{{ $t(group.name) }}</span>
                  </template>
                  <div v-for="item in group.items" class="flex align-items-center p-2">
                    <Checkbox
                      binary
                      v-model="item.value"
                      :name="item.scope"
                      :inputId="`id:${item.scope}`"
                      v-if="!item?.separator"
                    />
                    <label v-if="!item?.separator" :for="`id:${item.scope}`" class="ml-2">
                      {{ $t(item.comment) }}
                    </label>
                    <Divider v-if="item?.separator" class="my-1" />
                  </div>
                </AccordionTab>
              </Accordion>
            </div>
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Cancel')" @click="onClose" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveRecord" />
    </template>
  </Dialog>
</template>

<style scoped>
::v-deep(.p-input-icon-right > svg) {
  right: 0.5rem !important;
  cursor: pointer;
}

::v-deep(.p-accordion .p-accordion-tab) {
  box-shadow: none;
}

::v-deep(.p-accordion .p-accordion-header .p-accordion-header-link) {
  background: transparent;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
}

::v-deep(.p-accordion-tab-active > .p-accordion-header > a.p-accordion-header-link) {
  background: var(--surface-hover) !important;
  font-weight: 700 !important;
}

::v-deep(.p-accordion-content) {
  background: transparent;
}
</style>
