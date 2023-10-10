<script setup>
import { inject, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { AutocompleteOffForms } from '@/service/ReadonlyForms';

const SUBMIT_COUNT = 3;

const { t } = useI18n();
const toast = useToast();

const $auth = inject('auth');

const { values, errors, submitCount, handleSubmit, defineComponentBinds } = useForm({
  validationSchema: yup.object({
    login: yup.string().required(),
    password: yup.string().min(6).required()
  }),
  initialValues: {
    remember: JSON.parse(localStorage.getItem('app-auth-remember')) || false
  }
});

const login = defineComponentBinds('login');
const password = defineComponentBinds('password');
const remember = defineComponentBinds('remember');

const onSignin = handleSubmit(async (values, { resetForm }) => {
  try {
    await $auth.signin(values);
    toast.add({
      severity: 'success',
      summary: t('HD Information'),
      detail: t('Authorization passed'),
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t(err.message),
      life: 3000
    });
  }
});

const onChangeRemember = () => {
  localStorage.setItem('app-auth-remember', values.remember);
};

onMounted(() => {
  resetForm();
  AutocompleteOffForms();
});
</script>

<template>
  <div class="flex flex-column surface-card border-round-lg p-5">
    <div class="flex justify-content-center mb-2">
      <div class="justify-content-start">
        <p class="uppercase font-bold text-7xl m-0 text-color" translate="no" lang="en">help</p>
      </div>
      <div class="flex align-items-center justify-content-center">
        <img src="/img/logo-app.webp" alt="HD logo" width="56" height="56" class="mx-2" />
      </div>
      <div class="justify-content-start">
        <p class="uppercase font-bold text-7xl m-0 text-color" translate="no" lang="en">desk</p>
      </div>
    </div>
    <div class="text-center mb-4">
      <p class="text-600 font-medium">
        {{ $t('Sign In to the application to continue') }}
      </p>
    </div>
    <form @submit.prevent="onSignin" class="p-fluid w-full">
      <div class="field mb-4">
        <label for="login" class="text-900 text-xl font-medium">
          {{ $t('Login') }}
        </label>
        <span class="p-input-icon-left">
          <i class="pi pi-user" />
          <InputText
            id="login"
            v-bind="login"
            :placeholder="$t('Login')"
            :class="{ 'p-invalid': !!errors?.login }"
            aria-describedby="login-help"
          />
        </span>
        <small id="login-help" class="p-error" v-if="errors?.login">
          {{ $t(errors.login) }}
        </small>
      </div>

      <div class="field mb-2">
        <label for="password" class="text-900 text-xl font-medium">
          {{ $t('Password') }}
        </label>
        <Password
          toggleMask
          inputId="password"
          v-bind="password"
          :placeholder="$t('Password')"
          :promptLabel="$t('Choose a password')"
          :weakLabel="$t('Too simple')"
          :mediumLabel="$t('Average complexity')"
          :strongLabel="$t('Complex password')"
          :class="{ 'p-invalid': !!errors?.password }"
          aria-describedby="password-help"
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
        <small id="password-help" class="p-error" v-if="errors?.password">
          {{ $t(errors.password) }}
        </small>
      </div>

      <div class="field mb-5">
        <div class="flex align-items-center justify-content-between">
          <div class="flex align-items-center">
            <Checkbox
              binary
              inputId="remember"
              v-bind="remember"
              class="mr-2"
              @change="onChangeRemember"
            />
            <label for="remember">{{ $t('Remember me') }}</label>
          </div>

          <RouterLink :to="{ name: 'signup' }" class="text-blue-500">
            {{ $t('Register in the app') }}
          </RouterLink>
        </div>
      </div>

      <div class="field">
        <Button
          text
          plain
          outlined
          type="submit"
          icon="pi pi-sign-in"
          class="block w-full p-3 text-xl text-center hover:text-color"
          :disabled="submitCount > SUBMIT_COUNT"
          :label="$t('Sign In')"
          aria-describedby="submit-help"
        />
        <small
          id="submit-help"
          class="p-error block w-full text-center mt-2"
          v-if="submitCount > SUBMIT_COUNT"
        >
          {{ $t('You submitted too many times') }}
        </small>
      </div>
    </form>
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
