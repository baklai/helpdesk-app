<script setup>
import { inject, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { AutocompleteOffForms } from '@/service/ReadonlyForms';

const SUBMIT_COUNT = 5;

const { t } = useI18n();
const toast = useToast();

const $auth = inject('auth');

const { errors, submitCount, handleSubmit, defineComponentBinds } = useForm({
  validationSchema: yup.object({
    login: yup.string().required(),
    password: yup.string().min(6).required(),
    confirmPass: yup
      .string()
      .min(6)
      .oneOf([yup.ref('password'), null], 'Passwords must match')
      .required(),
    fullname: yup.string().required(),
    email: yup.string().email().required(),
    phone: yup.string().required()
  }),
  initialValues: {}
});

const login = defineComponentBinds('login');
const password = defineComponentBinds('password');
const confirmPass = defineComponentBinds('confirmPass');
const fullname = defineComponentBinds('fullname');
const email = defineComponentBinds('email');
const phone = defineComponentBinds('phone');

const onSignup = handleSubmit(async (values, { resetForm }) => {
  try {
    await $auth.signup(values);
    toast.add({
      severity: 'success',
      summary: t('HD Information'),
      detail: t(
        'Your account is registered. Please contact with administrator for activation of account.'
      ),
      life: 10000
    });
    resetForm();
  } catch (err) {
    toast.add({ severity: 'warn', summary: t('HD Warning'), detail: t(err.message), life: 3000 });
  }
});

onMounted(() => {
  AutocompleteOffForms();
});
</script>

<template>
  <div class="surface-card border-round-lg p-5">
    <div class="flex align-items-center justify-content-center">
      <div class="flex align-items-center justify-content-center" style="width: 500px">
        <form @submit.prevent="onSignup" class="p-fluid w-full" autocomplete="off">
          <div class="flex justify-content-center mb-2">
            <div class="justify-content-start">
              <p class="uppercase font-bold text-7xl m-0 text-color" translate="no" lang="en">
                help
              </p>
            </div>
            <div class="flex align-items-center justify-content-center">
              <img src="/img/logo-app.webp" alt="HD logo" width="56" height="56" class="mx-2" />
            </div>
            <div class="justify-content-start">
              <p class="uppercase font-bold text-7xl m-0 text-color" translate="no" lang="en">
                desk
              </p>
            </div>
          </div>
          <div class="text-center mb-4">
            <p class="text-600 font-medium">{{ $t('Register to the application to continue') }}</p>
          </div>

          <div class="formgrid grid">
            <div class="field col">
              <div class="field">
                <label class="font-bold">{{ $t('User login') }}</label>
                <span class="p-input-icon-left">
                  <i class="pi pi-user" />
                  <InputText
                    v-bind="login"
                    :placeholder="$t('User login')"
                    :class="{ 'p-invalid': !!errors?.login }"
                  />
                </span>
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
                <label class="font-bold">
                  {{ $t('Confirm password') }}
                </label>
                <InputText
                  type="password"
                  v-bind="confirmPass"
                  :placeholder="$t('Confirm password')"
                  :class="{ 'p-invalid': !!errors?.confirmPass }"
                />
                <small class="p-error" v-if="errors?.confirmPass">
                  {{ $t(errors.confirmPass) }}
                </small>
              </div>
            </div>

            <div class="field col">
              <div class="field">
                <label class="font-bold">{{ $t('User name') }}</label>
                <span class="p-input-icon-left">
                  <i class="pi pi-id-card" />
                  <InputText
                    v-bind="fullname"
                    :placeholder="$t('User name')"
                    :class="{ 'p-invalid': !!errors?.fullname }"
                  />
                </span>
                <small class="p-error" v-if="errors?.fullname">
                  {{ $t(errors.fullname) }}
                </small>
              </div>

              <div class="field">
                <label class="font-bold">{{ $t('User email') }}</label>
                <span class="p-input-icon-left">
                  <i class="pi pi-at" />
                  <InputText
                    v-bind="email"
                    :placeholder="$t('User email')"
                    :class="{ 'p-invalid': !!errors?.email }"
                  />
                </span>
                <small class="p-error" v-if="errors?.email">
                  {{ $t(errors.email) }}
                </small>
              </div>

              <div class="field">
                <label class="font-bold">{{ $t('User phone') }}</label>
                <span class="p-input-icon-left">
                  <i class="pi pi-phone" />
                  <InputMask
                    date="phone"
                    mask="+99(999)999-99-99"
                    v-bind="phone"
                    :placeholder="$t('User phone')"
                    :class="{ 'p-invalid': !!errors?.phone }"
                  />
                </span>
                <small class="p-error" v-if="errors?.phone">
                  {{ $t(errors.phone) }}
                </small>
              </div>
            </div>
          </div>
          <Button
            text
            plain
            outlined
            type="submit"
            icon="pi pi-verified"
            class="block w-full p-3 text-xl text-center hover:text-color"
            :disabled="submitCount > SUBMIT_COUNT"
            :label="$t('Register in the application')"
          />
          <small class="p-error block w-full text-center mt-2" v-if="submitCount > SUBMIT_COUNT">
            {{ $t('You submitted too many times') }}
          </small>
        </form>
      </div>
    </div>
  </div>

  <p class="text-center text-500 my-2">
    {{ $helpdesk?.copyright }}
  </p>
  <p class="text-center text-500 my-2">
    <RouterLink :to="{ name: 'home' }" class="text-blue-500">
      {{ $t('Helpdesk home page') }}
    </RouterLink>
  </p>
</template>

<style scoped>
::v-deep(.p-input-icon-right > svg) {
  right: 0.8rem;
  cursor: pointer;
}
</style>
