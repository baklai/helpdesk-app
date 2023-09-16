<script setup>
import { ref, computed, inject, onMounted } from 'vue';
import { required, minLength, email, sameAs } from '@vuelidate/validators';
import { useVuelidate } from '@vuelidate/core';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import { AutocompleteOffForms } from '@/service/ReadonlyForms';

const { t } = useI18n();
const toast = useToast();

const $auth = inject('auth');

const record = ref({
  login: undefined,
  password: undefined,
  fullname: undefined,
  email: undefined,
  phone: undefined
});

const password = computed(() => record.value.password);
const confirmPass = ref(undefined);

const $validate = useVuelidate(
  {
    login: { required },
    password: {
      required,
      minLengthValue: minLength(6)
    },
    confirmPass: { required, sameAsPassword: sameAs(password) },
    fullname: { required },
    email: { required, email },
    phone: { required }
  },
  record,
  confirmPass
);

const onSignup = async () => {
  const valid = await $validate.value.$validate();
  if (valid) {
    try {
      await $auth.signup(record.value);
      toast.add({
        severity: 'success',
        summary: t('HD Information'),
        detail: t('Registration Successful'),
        life: 3000
      });
      toast.add({
        severity: 'info',
        summary: t('HD Information'),
        detail: t('Your account is registered. Please check email for activation instructions.'),
        life: 10000
      });
    } catch (err) {
      toast.add({ severity: 'warn', summary: t('HD Warning'), detail: t(err.message), life: 3000 });
    }
  } else {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t('Input registration information'),
      life: 3000
    });
  }
};

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
                <label for="login" class="font-bold">{{ $t('User login') }}</label>
                <span class="p-input-icon-left">
                  <i class="pi pi-user" />
                  <InputText
                    id="login"
                    aria-describedby="login-help"
                    v-model="record.login"
                    :placeholder="$t('User login')"
                    :class="{ 'p-invalid': !!$validate.login.$errors.length }"
                  />
                </span>
                <small
                  id="login-help"
                  class="p-error"
                  v-for="error in $validate.login.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
                </small>
              </div>

              <div class="field">
                <label for="password" class="font-bold">
                  {{ $t('User password') }}
                </label>
                <Password
                  toggleMask
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
                <small
                  id="password-help"
                  class="p-error"
                  v-for="error in $validate.password.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
                </small>
              </div>

              <div class="field">
                <label for="confirm-password" class="font-bold">
                  {{ $t('Confirm password') }}
                </label>
                <InputText
                  type="password"
                  id="confirm-password"
                  aria-describedby="confirm-password-help"
                  v-model="record.confirmPass"
                  :placeholder="$t('Confirm password')"
                  :class="{ 'p-invalid': !!$validate.confirmPass.$errors.length }"
                />
                <small
                  id="confirm-password-help"
                  class="p-error"
                  v-for="error in $validate.confirmPass.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
                </small>
              </div>
            </div>

            <div class="field col">
              <div class="field">
                <label for="fullname" class="font-bold">{{ $t('User name') }}</label>
                <span class="p-input-icon-left">
                  <i class="pi pi-id-card" />
                  <InputText
                    id="fullname"
                    aria-describedby="fullname-help"
                    v-model="record.fullname"
                    :placeholder="$t('User name')"
                    :class="{ 'p-invalid': !!$validate.fullname.$errors.length }"
                  />
                </span>
                <small
                  id="fullname-help"
                  class="p-error"
                  v-for="error in $validate.fullname.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
                </small>
              </div>

              <div class="field">
                <label for="email" class="font-bold">{{ $t('User email') }}</label>
                <span class="p-input-icon-left">
                  <i class="pi pi-at" />
                  <InputText
                    id="email"
                    aria-describedby="email-help"
                    v-model="record.email"
                    :placeholder="$t('User email')"
                    :class="{ 'p-invalid': !!$validate.email.$errors.length }"
                  />
                </span>
                <small
                  id="email-help"
                  class="p-error"
                  v-for="error in $validate.email.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
                </small>
              </div>

              <div class="field">
                <label for="phone" class="font-bold">{{ $t('User phone') }}</label>
                <span class="p-input-icon-left">
                  <i class="pi pi-phone" />
                  <InputMask
                    id="phone"
                    date="phone"
                    mask="+99(999)999-99-99"
                    v-model="record.phone"
                    :placeholder="$t('User phone')"
                    :class="{ 'p-invalid': !!$validate.phone.$errors.length }"
                  />
                </span>
                <small
                  id="phone-help"
                  class="p-error"
                  v-for="error in $validate.phone.$errors"
                  :key="error.$uid"
                >
                  {{ $t(error.$message) }}
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
            :label="$t('Register in the application')"
          />
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
  right: 0.5rem !important;
  cursor: pointer;
}

.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: upright;
  text-align: center;
}
</style>
