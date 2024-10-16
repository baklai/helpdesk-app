<script setup>
import { inject, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

const { t } = useI18n();
const toast = useToast();

const $auth = inject('auth');

const { errors, handleSubmit, resetForm, defineField } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(t('Value is required')),
    fullname: yup.string().required(t('Value is required')),
    phone: yup.string().required(t('Value is required'))
  }),
  initialValues: {}
});

const [email, emailAttrs] = defineField('email');
const [fullname, fullnameAttrs] = defineField('fullname');
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
});
</script>

<template>
  <form
    @submit.prevent="onSignup"
    class="flex w-[25rem] flex-col justify-center gap-6"
    autocomplete="off"
  >
    <div class="flex flex-col gap-2">
      <label for="fullname" class="text-lg font-semibold text-surface-950 dark:text-surface-50">
        {{ $t('User name') }}
      </label>
      <span class="relative">
        <i
          class="pi pi-id-card absolute left-3 top-2/4 -mt-2 text-surface-400 dark:text-surface-600"
        />
        <InputText
          id="fullname"
          v-model="fullname"
          v-bind="fullnameAttrs"
          :invalid="!!errors?.fullname"
          :placeholder="$t('User name')"
          class="w-full pl-10 text-xl"
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
        <i class="pi pi-at absolute left-3 top-2/4 -mt-2 text-surface-400 dark:text-surface-600" />
        <InputText
          id="email"
          v-model="email"
          v-bind="emailAttrs"
          :invalid="!!errors?.email"
          :placeholder="$t('User email')"
          class="w-full pl-10 text-xl"
          aria-describedby="email-help"
        />
      </span>
      <small id="email-help" class="text-red-500" v-if="errors?.email">
        {{ $t(errors.email) }}
      </small>
    </div>

    <div class="mb-4 flex flex-col gap-2">
      <label for="phone" class="text-lg font-semibold text-surface-950 dark:text-surface-50">
        {{ $t('User phone') }}
      </label>
      <span class="relative">
        <i
          class="pi pi-phone absolute left-3 top-2/4 -mt-2 text-surface-400 dark:text-surface-600"
        />
        <InputMask
          id="phone"
          date="phone"
          mask="+99(999)999-99-99"
          v-model="phone"
          v-bind="phoneAttrs"
          :invalid="!!errors?.phone"
          :placeholder="$t('User phone')"
          class="w-full pl-10 text-xl"
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
      class="block w-full p-3 text-center text-xl"
      :label="$t('Sign Up')"
      aria-describedby="submit-help"
    />

    <p class="text-center font-medium text-surface-500">
      {{ $t('Register to the application to continue') }}
    </p>

    <RouterLink
      :to="{ name: 'signin' }"
      class="cursor-pointer text-center font-semibold text-primary-600 hover:text-primary-500"
    >
      {{ $t('Sign In the application') }}
    </RouterLink>
  </form>
</template>
