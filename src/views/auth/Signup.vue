<script setup>
import { inject, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { AutocompleteOffForms } from '@/service/ReadonlyForms';

const { t } = useI18n();
const toast = useToast();

const $auth = inject('auth');

const { errors, handleSubmit, resetForm, defineField } = useForm({
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

const [login, loginAttrs] = defineField('login');
const [password, passwordAttrs] = defineField('password');
const [passwordConfirm, passwordConfirmAttrs] = defineField('passwordConfirm');
const [fullname, fullnameAttrs] = defineField('fullname');
const [email, emailAttrs] = defineField('email');
const [phone, phoneAttrs] = defineField('phone');

const onSignup = handleSubmit(async values => {
  try {
    await $auth.signup(values);
    toast.add({
      severity: 'success',
      summary: t('Information'),
      detail: t(
        'Your account is registered. Please contact with administrator for activation of account.'
      ),
      life: 10000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('Warning'),
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
  <form
    @submit.prevent="onSignup"
    class="flex flex-col justify-center gap-2 w-[25rem]"
    autocomplete="off"
  >
    <div class="flex flex-col gap-2">
      <label for="login" class="text-lg font-semibold text-surface-950 dark:text-surface-50">
        {{ $t('User login') }}
      </label>
      <span class="relative">
        <i
          class="pi pi-user absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
        />
        <InputText
          id="login"
          v-model="login"
          v-bind="loginAttrs"
          :invalid="!!errors?.login"
          :placeholder="$t('User login')"
          aria-describedby="login-help"
          class="w-full pl-10"
        />
      </span>
      <small id="login-help" class="text-red-500" v-if="errors?.login">
        {{ $t(errors.login) }}
      </small>
    </div>

    <div class="flex flex-col gap-2">
      <label for="password" class="text-lg font-semibold text-surface-950 dark:text-surface-50">
        {{ $t('User password') }}
      </label>
      <span class="relative">
        <i
          class="pi pi-lock absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600 z-10"
        />
        <Password
          toggleMask
          id="password"
          v-model="password"
          v-bind="passwordAttrs"
          :invalid="!!errors?.password"
          :placeholder="$t('User password')"
          :promptLabel="$t('Choose a password')"
          :weakLabel="$t('Too simple')"
          :mediumLabel="$t('Average complexity')"
          :strongLabel="$t('Complex password')"
          aria-describedby="password-help"
          inputClass="pl-10"
          class="w-full"
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
      </span>
      <small id="password-help" class="text-red-500" v-if="errors?.password">
        {{ $t(errors.password) }}
      </small>
    </div>

    <div class="flex flex-col gap-2">
      <label
        for="passwordConfirm"
        class="text-lg font-semibold text-surface-950 dark:text-surface-50"
      >
        {{ $t('Confirm password') }}
      </label>
      <span class="relative">
        <i
          class="pi pi-unlock absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
        />
        <InputText
          type="password"
          id="passwordConfirm"
          v-model="passwordConfirm"
          v-bind="passwordConfirmAttrs"
          :invalid="!!errors?.passwordConfirm"
          :placeholder="$t('Confirm password')"
          aria-describedby="passwordConfirm-help"
          class="w-full pl-10"
        />
      </span>
      <small id="passwordConfirm-help" class="text-red-500" v-if="errors?.passwordConfirm">
        {{ $t(errors.passwordConfirm) }}
      </small>
    </div>

    <div class="flex flex-col gap-2">
      <label for="fullname" class="text-lg font-semibold text-surface-950 dark:text-surface-50">
        {{ $t('User name') }}
      </label>
      <span class="relative">
        <i
          class="pi pi-id-card absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
        />
        <InputText
          id="fullname"
          v-model="fullname"
          v-bind="fullnameAttrs"
          :invalid="!!errors?.fullname"
          :placeholder="$t('User name')"
          class="w-full pl-10"
          aria-describedby="fullname-help"
        />
      </span>
      <small id="fullname-help" class="text-red-500" v-if="errors?.fullname">
        {{ $t(errors.fullname) }}
      </small>
    </div>

    <div class="flex flex-col gap-2">
      <label for="email" class="text-lg font-semibold text-surface-950 dark:text-surface-50">
        {{ $t('User email') }}
      </label>
      <span class="relative">
        <i class="pi pi-at absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
        <InputText
          id="email"
          v-model="email"
          v-bind="emailAttrs"
          :invalid="!!errors?.email"
          :placeholder="$t('User email')"
          class="w-full pl-10"
          aria-describedby="email-help"
        />
      </span>
      <small id="email-help" class="text-red-500" v-if="errors?.email">
        {{ $t(errors.email) }}
      </small>
    </div>

    <div class="flex flex-col gap-2">
      <label for="phone" class="text-lg font-semibold text-surface-950 dark:text-surface-50">
        {{ $t('User phone') }}
      </label>
      <span class="relative">
        <i
          class="pi pi-phone absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600"
        />
        <InputMask
          id="phone"
          date="phone"
          mask="+99(999)999-99-99"
          v-model="phone"
          v-bind="phoneAttrs"
          :invalid="!!errors?.phone"
          :placeholder="$t('User phone')"
          class="w-full pl-10"
          aria-describedby="phone-help"
        />
      </span>
      <small id="phone-help" class="text-red-500" v-if="errors?.phone">
        {{ $t(errors.phone) }}
      </small>
    </div>

    <Button
      type="submit"
      icon="pi pi-verified"
      class="block w-full mt-4 mb-2 text-xl"
      :label="$t('Register in the application')"
      aria-describedby="submit-help"
    />

    <p class="text-center font-medium text-surface-500">
      {{ $t('Register to the application to continue') }}
    </p>
  </form>
</template>
