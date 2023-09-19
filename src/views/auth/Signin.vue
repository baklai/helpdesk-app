<script setup>
import { ref, inject, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, minLength } from '@vuelidate/validators';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { AutocompleteOffForms } from '@/service/ReadonlyForms';

const { t } = useI18n();
const toast = useToast();

const $auth = inject('auth');

const login = ref(null);
const password = ref(null);
const remember = ref(false);

const $validate = useVuelidate(
  {
    login: { required },
    password: { required, minLength: minLength(6) }
  },
  { login, password }
);

const onSignin = async () => {
  const valid = await $validate.value.$validate();
  if (valid) {
    try {
      await $auth.signin({
        login: login.value,
        password: password.value,
        remember: remember.value
      });
      toast.add({
        severity: 'success',
        summary: t('HD Information'),
        detail: t('Authorization passed'),
        life: 3000
      });
    } catch (err) {
      toast.add({ severity: 'warn', summary: t('HD Warning'), detail: t(err.message), life: 3000 });
    }
  } else {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t('Input login and password'),
      life: 3000
    });
  }
};

onMounted(() => {
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
      <p class="text-600 font-medium">{{ $t('Sign In to the application to continue') }}</p>
    </div>
    <form @submit.prevent="onSignin" class="p-fluid w-full">
      <div class="field mb-4">
        <label class="text-900 text-xl font-medium">
          {{ $t('Login') }}
        </label>
        <span class="p-input-icon-left">
          <i class="pi pi-user" />
          <InputText
            v-model="login"
            :placeholder="$t('Login')"
            :class="{ 'p-invalid': !!$validate.login.$errors.length }"
          />
        </span>
        <small class="p-error" v-for="error in $validate.login.$errors" :key="error.$uid">
          {{ $t(error.$message) }}
        </small>
      </div>

      <div class="field mb-2">
        <label class="text-900 text-xl font-medium">
          {{ $t('Password') }}
        </label>
        <Password
          toggleMask
          v-model="password"
          :placeholder="$t('Password')"
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
        <small class="p-error" v-for="error in $validate.password.$errors" :key="error.$uid">
          {{ $t(error.$message) }}
        </small>
      </div>

      <div class="field mb-5">
        <div class="flex align-items-center justify-content-between">
          <div class="flex align-items-center">
            <Checkbox v-model="remember" binary class="mr-2" />
            <label>{{ $t('Remember me') }}</label>
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
          :label="$t('Sign In')"
        />
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
  right: 0.5rem !important;
  cursor: pointer;
}
</style>
