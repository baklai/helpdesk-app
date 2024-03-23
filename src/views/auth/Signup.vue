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

const { errors, submitCount, handleSubmit, resetForm, defineComponentBinds } = useForm({
  validationSchema: yup.object({
    login: yup.string().required(t('Value is required')),
    password: yup.string().min(6).required(t('Value is required')),
    passwordConfirm: yup
      .string()
      .required(t('Value is required'))
      .min(6)
      .oneOf([yup.ref('password')], 'Passwords must match'),
    fullname: yup.string().required(t('Value is required')),
    email: yup.string().email().required(t('Value is required')),
    phone: yup.string().required(t('Value is required'))
  }),
  initialValues: {}
});

const login = defineComponentBinds('login');
const password = defineComponentBinds('password');
const passwordConfirm = defineComponentBinds('passwordConfirm');
const fullname = defineComponentBinds('fullname');
const email = defineComponentBinds('email');
const phone = defineComponentBinds('phone');

const onSignup = handleSubmit(async values => {
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
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t(err.message),
      life: 3000
    });
  }
});

onMounted(() => {
  resetForm();
  AutocompleteOffForms();
});
</script>

<template>
  <form @submit.prevent="onSignup" class="p-fluid w-25rem" autocomplete="off">
    <div class="field">
      <label for="login" class="font-bold">{{ $t('User login') }}</label>
      <span class="p-input-icon-left">
        <i class="pi pi-user" />
        <InputText
          id="login"
          v-bind="login"
          :placeholder="$t('User login')"
          :class="{ 'p-invalid': !!errors?.login }"
          aria-describedby="login-help"
        />
      </span>
      <small id="login-help" class="p-error" v-if="errors?.login">
        {{ $t(errors.login) }}
      </small>
    </div>

    <div class="field">
      <label for="password" class="font-bold">
        {{ $t('User password') }}
      </label>
      <Password
        toggleMask
        id="password"
        v-bind="password"
        :placeholder="$t('User password')"
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

    <div class="field">
      <label for="passwordConfirm" class="font-bold">
        {{ $t('Confirm password') }}
      </label>
      <InputText
        type="password"
        id="passwordConfirm"
        v-bind="passwordConfirm"
        :placeholder="$t('Confirm password')"
        :class="{ 'p-invalid': !!errors?.passwordConfirm }"
        aria-describedby="passwordConfirm-help"
      />
      <small id="passwordConfirm-help" class="p-error" v-if="errors?.passwordConfirm">
        {{ $t(errors.passwordConfirm) }}
      </small>
    </div>

    <div class="field">
      <label for="fullname" class="font-bold">{{ $t('User name') }}</label>
      <span class="p-input-icon-left">
        <i class="pi pi-id-card" />
        <InputText
          id="fullname"
          v-bind="fullname"
          :placeholder="$t('User name')"
          :class="{ 'p-invalid': !!errors?.fullname }"
          aria-describedby="fullname-help"
        />
      </span>
      <small id="fullname-help" class="p-error" v-if="errors?.fullname">
        {{ $t(errors.fullname) }}
      </small>
    </div>

    <div class="field">
      <label for="email" class="font-bold">{{ $t('User email') }}</label>
      <span class="p-input-icon-left">
        <i class="pi pi-at" />
        <InputText
          id="email"
          v-bind="email"
          :placeholder="$t('User email')"
          :class="{ 'p-invalid': !!errors?.email }"
          aria-describedby="email-help"
        />
      </span>
      <small id="email-help" class="p-error" v-if="errors?.email">
        {{ $t(errors.email) }}
      </small>
    </div>

    <div class="field mb-6">
      <label for="phone" class="font-bold">{{ $t('User phone') }}</label>
      <span class="p-input-icon-left">
        <i class="pi pi-phone" />
        <InputMask
          date="phone"
          mask="+99(999)999-99-99"
          id="phone"
          v-bind="phone"
          :placeholder="$t('User phone')"
          :class="{ 'p-invalid': !!errors?.phone }"
          aria-describedby="phone-help"
        />
      </span>
      <small id="phone-help" class="p-error" v-if="errors?.phone">
        {{ $t(errors.phone) }}
      </small>
    </div>

    <div class="field">
      <Button
        type="submit"
        icon="pi pi-verified"
        class="block w-full p-3 text-xl text-center"
        :disabled="submitCount > SUBMIT_COUNT"
        :label="$t('Register in the application')"
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

    <p class="text-center font-medium py-2">
      {{ $t('Register to the application to continue') }}
    </p>
  </form>
</template>

<style scoped>
::v-deep(.p-input-icon-right > svg) {
  right: 0.8rem;
  cursor: pointer;
}
</style>
