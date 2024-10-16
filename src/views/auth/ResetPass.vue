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
    email: yup.string().email().required(t('Value is required'))
  }),
  initialValues: {}
});

const [email, emailAttrs] = defineField('email');

const onReset = handleSubmit(async values => {
  try {
    await $auth.reset(values);
    toast.add({
      severity: 'success',
      summary: t('Information'),
      detail: t('Reset password passed'),
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

onMounted(() => {
  resetForm();
});
</script>

<template>
  <form
    @submit.prevent="onReset"
    class="flex w-[25rem] flex-col justify-center gap-6"
    autocomplete="off"
  >
    <div class="flex flex-col gap-2">
      <label for="email" class="text-2xl font-bold text-surface-950 dark:text-surface-50">
        {{ $t('Forgot password') }}?
      </label>
      <p class="text-start font-medium text-surface-500">
        {{ $t('Enter your email to reset your password') }}
      </p>
      <span class="relative">
        <i class="pi pi-at absolute left-3 top-2/4 -mt-2 text-surface-400 dark:text-surface-600" />
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
      <Button
        type="submit"
        icon="pi pi-lock-open"
        class="block w-full p-3 text-center text-xl"
        :disabled="submitCount > SUBMIT_COUNT"
        :label="$t('Reset password')"
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

    <RouterLink
      :to="{ name: 'signin' }"
      class="cursor-pointer text-center font-semibold text-primary-600 hover:text-primary-500"
    >
      {{ $t('Sign In the application') }}
    </RouterLink>
  </form>
</template>
