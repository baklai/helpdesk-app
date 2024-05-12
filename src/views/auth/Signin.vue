<script setup>
import { inject, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

const SUBMIT_COUNT = 3;

const { t } = useI18n();
const toast = useToast();

const $auth = inject('auth');

const { values, errors, submitCount, handleSubmit, resetForm, defineField } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(t('Value is required')),
    password: yup.string().min(6).required(t('Value is required'))
  }),
  initialValues: {
    remember: JSON.parse(localStorage.getItem('app-auth-remember')) || false
  }
});

const [email, emailAttrs] = defineField('email');
const [password, passwordAttrs] = defineField('password');
const [remember, rememberAttrs] = defineField('remember');

const onSignin = handleSubmit(async values => {
  try {
    await $auth.signin(values);
    toast.add({
      severity: 'success',
      summary: t('Information'),
      detail: t('Authorization passed'),
      life: 3000
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

const onChangeRemember = () => {
  localStorage.setItem('app-auth-remember', values.remember);
};

onMounted(() => {
  resetForm();
});
</script>

<template>
  <form
    @submit.prevent="onSignin"
    class="flex flex-col justify-center gap-6 w-[25rem]"
    autocomplete="off"
  >
    <div class="flex flex-col gap-2">
      <label for="email" class="text-xl font-semibold text-surface-950 dark:text-surface-50">
        {{ $t('Email') }}
      </label>
      <span class="relative">
        <i class="pi pi-at absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600" />
        <InputText
          id="email"
          size="large"
          class="w-full pl-10 text-xl"
          v-model="email"
          v-bind="emailAttrs"
          :placeholder="$t('Email')"
          :invalid="!!errors?.email"
          aria-describedby="email-help"
        />
      </span>
      <small id="email-help" class="text-red-500" v-if="errors?.email">
        {{ $t(errors.email) }}
      </small>
    </div>

    <div class="flex flex-col gap-2">
      <label for="password" class="text-xl font-semibold text-surface-950 dark:text-surface-50">
        {{ $t('Password') }}
      </label>
      <span class="relative">
        <i
          class="pi pi-lock absolute top-2/4 -mt-2 left-3 text-surface-400 dark:text-surface-600 z-10"
        />
        <Password
          toggleMask
          size="large"
          inputId="password"
          v-model="password"
          v-bind="passwordAttrs"
          :invalid="!!errors?.password"
          :placeholder="$t('Password')"
          :promptLabel="$t('Choose a password')"
          :weakLabel="$t('Too simple')"
          :mediumLabel="$t('Average complexity')"
          :strongLabel="$t('Complex password')"
          aria-describedby="password-help"
          inputClass="text-xl px-4 py-4 pl-10"
          class="w-full"
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
      </span>
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
            v-model="remember"
            v-bind="rememberAttrs"
            class="mr-2"
            @change="onChangeRemember"
          />
          <label for="remember" class="text-surface-950 dark:text-surface-50">
            {{ $t('Remember me') }}
          </label>
        </div>

        <RouterLink
          :to="{ name: 'resetpassword' }"
          class="font-semibold cursor-pointer text-primary-600 hover:text-primary-500"
        >
          {{ $t('Forgot password') }}?
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

    <RouterLink
      :to="{ name: 'signup' }"
      class="text-center font-semibold cursor-pointer text-primary-600 hover:text-primary-500"
    >
      {{ $t('Register in the application') }}
    </RouterLink>
  </form>
</template>
