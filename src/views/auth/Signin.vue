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

const { values, errors, submitCount, handleSubmit, resetForm, defineComponentBinds } = useForm({
  validationSchema: yup.object({
    login: yup.string().required(t('Value is required')),
    password: yup.string().min(6).required(t('Value is required'))
  }),
  initialValues: {
    remember: JSON.parse(localStorage.getItem('app-auth-remember')) || false
  }
});

const login = defineComponentBinds('login');
const password = defineComponentBinds('password');
const remember = defineComponentBinds('remember');

const onSignin = handleSubmit(async values => {
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
  <form
    @submit.prevent="onSignin"
    class="flex flex-col justify-center gap-6 w-[25rem]"
    autocomplete="off"
  >
    <div class="flex flex-col gap-2">
      <label for="login" class="text-xl font-semibold text-surface-950 dark:text-surface-50">
        {{ $t('Login') }}
      </label>
      <span class="relative">
        <i
          class="pi pi-user absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
        />
        <InputText
          id="login"
          size="large"
          class="w-full pl-10 text-xl"
          v-bind="login"
          :placeholder="$t('Login')"
          :invalid="!!errors?.login"
          aria-describedby="login-help"
        />
      </span>
      <small id="login-help" class="text-red-500" v-if="errors?.login">
        {{ $t(errors.login) }}
      </small>
    </div>

    <div class="flex flex-col gap-2">
      <label for="password" class="text-xl font-semibold text-surface-950 dark:text-surface-50">
        {{ $t('Password') }}
      </label>
      <Password
        toggleMask
        inputId="password"
        v-bind="password"
        :invalid="!!errors?.login"
        :placeholder="$t('Password')"
        :promptLabel="$t('Choose a password')"
        :weakLabel="$t('Too simple')"
        :mediumLabel="$t('Average complexity')"
        :strongLabel="$t('Complex password')"
        inputClass="text-xl"
        :inputStyle="{ padding: '0.9375rem' }"
        aria-describedby="password-help"
      >
        <template #header>
          <h6>{{ $t('Pick a password') }}</h6>
        </template>
        <template #footer>
          <Divider />
          <p class="mt-2">{{ $t('Suggestions') }}:</p>
          <ul class="list-disc pl-2 ml-2 mt-0 leading-normal">
            <li>{{ $t('At least one lowercase') }}</li>
            <li>{{ $t('At least one uppercase') }}</li>
            <li>{{ $t('At least one numeric') }}</li>
            <li>{{ $t('Minimum 6 characters') }}</li>
          </ul>
        </template>
      </Password>
      <small id="password-help" class="text-red-500" v-if="errors?.password">
        {{ $t(errors.password) }}
      </small>
    </div>

    <div class="flex flex-col gap-2 mb-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center">
          <Checkbox
            binary
            inputId="remember"
            v-bind="remember"
            class="mr-2"
            @change="onChangeRemember"
          />
          <label for="remember" class="text-surface-950 dark:text-surface-50">
            {{ $t('Remember me') }}
          </label>
        </div>

        <RouterLink
          :to="{ name: 'signup' }"
          class="font-semibold cursor-pointer text-primary-600 hover:text-primary-500"
        >
          {{ $t('Register in the app') }}
        </RouterLink>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <Button
        type="submit"
        icon="pi pi-sign-in"
        class="block w-full p-3 text-xl text-center"
        :disabled="submitCount > SUBMIT_COUNT"
        :label="$t('Sign In')"
        aria-describedby="submit-help"
      />
      <small
        id="submit-help"
        class="block w-full text-center text-red-500"
        v-if="submitCount > SUBMIT_COUNT"
      >
        {{ $t('You submitted too many times') }}
      </small>
    </div>

    <p class="text-center font-medium text-surface-500">
      {{ $t('Sign In to the application to continue') }}
    </p>
  </form>
</template>
