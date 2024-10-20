<script setup>
import { inject, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';

const SUBMIT_COUNT = 3;

const toast = useToast();

const $auth = inject('auth');

const { values, errors, submitCount, handleSubmit, resetForm, defineField } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required('Потрібно вказати значення'),
    password: yup.string().min(6).required('Потрібно вказати значення')
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
      summary: 'Інформація',
      detail: 'Авторизація пройшла успішно',
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
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
    class="flex w-[25rem] flex-col justify-center gap-6"
    autocomplete="off"
  >
    <div class="flex flex-col gap-2">
      <label for="email" class="text-xl font-semibold text-surface-950 dark:text-surface-50">
        Електронна пошта
      </label>
      <span class="relative">
        <i class="pi pi-at absolute left-3 top-2/4 -mt-2 text-surface-400 dark:text-surface-600" />
        <InputText
          id="email"
          size="large"
          class="w-full pl-10 text-xl"
          v-model="email"
          v-bind="emailAttrs"
          placeholder="Електронна пошта"
          :invalid="!!errors?.email"
          aria-describedby="email-help"
        />
      </span>
      <small id="email-help" class="text-red-500" v-if="errors?.email">
        {{ errors.email }}
      </small>
    </div>

    <div class="flex flex-col gap-2">
      <label for="password" class="text-xl font-semibold text-surface-950 dark:text-surface-50">
        Пароль
      </label>
      <span class="relative">
        <i
          class="pi pi-lock absolute left-3 top-2/4 z-10 -mt-2 text-surface-400 dark:text-surface-600"
        />
        <Password
          toggleMask
          size="large"
          inputId="password"
          v-model="password"
          v-bind="passwordAttrs"
          :invalid="!!errors?.password"
          placeholder="Пароль"
          promptLabel="Виберіть пароль"
          weakLabel="Занадто простий"
          mediumLabel="Середня складність"
          strongLabel="Складний пароль"
          aria-describedby="password-help"
          inputClass="text-xl px-4 py-4 pl-10"
          class="w-full"
        >
          <template #header>
            <h6>Виберіть пароль</h6>
          </template>
          <template #footer>
            <Divider />
            <p class="mt-2">Рекомендації:</p>
            <ul class="ml-2 mt-0 list-disc pl-2 leading-normal">
              <li>Принаймні одна маленька літера</li>
              <li>Принаймні одна велика літера</li>
              <li>Принаймні одна цифра</li>
              <li>Мінімум 6 символів</li>
            </ul>
          </template>
        </Password>
      </span>
      <small id="password-help" class="text-red-500" v-if="errors?.password">
        {{ errors.password }}
      </small>
    </div>

    <div class="mb-4 flex flex-col gap-2">
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
            Запам'ятати мене
          </label>
        </div>

        <RouterLink
          :to="{ name: 'resetpassword' }"
          class="cursor-pointer font-semibold text-primary-600 hover:text-primary-500"
        >
          Забули пароль?
        </RouterLink>
      </div>
    </div>

    <div class="flex flex-col gap-2">
      <Button
        type="submit"
        icon="pi pi-sign-in"
        class="block w-full p-3 text-center text-xl"
        :disabled="submitCount > SUBMIT_COUNT"
        label="Увійти"
        aria-describedby="submit-help"
      />
      <small
        id="submit-help"
        class="block w-full text-center text-red-500"
        v-if="submitCount > SUBMIT_COUNT"
      >
        Ви надсилали занадто багато разів
      </small>
    </div>

    <p class="text-center font-medium text-surface-500">Увійдіть в програму, щоб продовжити</p>

    <RouterLink
      :to="{ name: 'signup' }"
      class="cursor-pointer text-center font-semibold text-primary-600 hover:text-primary-500"
    >
      Зареєструватися
    </RouterLink>
  </form>
</template>
