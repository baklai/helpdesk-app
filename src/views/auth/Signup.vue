<script setup>
import { inject, onMounted } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

const $auth = inject('auth');

const { errors, handleSubmit, resetForm, defineField } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required('Потрібно вказати значення'),
    fullname: yup.string().required('Потрібно вказати значення'),
    phone: yup.string().required('Потрібно вказати значення')
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
      summary: 'Інформація',
      detail:
        "Ваш обліковий запис зареєстровано. Будь ласка, зв'яжіться з адміністратором для активації облікового запису.",
      life: 10000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: err.message,
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
        Повне ім'я
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
          placeholder="Повне ім'я"
          class="w-full pl-10 text-xl"
          aria-describedby="fullname-help"
        />
      </span>
      <small id="fullname-help" class="text-red-500" v-if="errors?.fullname">
        {{ errors.fullname }}
      </small>
    </div>

    <div class="flex flex-col gap-2">
      <label for="email" class="text-lg font-semibold text-surface-950 dark:text-surface-50">
        Електронна пошта
      </label>
      <span class="relative">
        <i class="pi pi-at absolute left-3 top-2/4 -mt-2 text-surface-400 dark:text-surface-600" />
        <InputText
          id="email"
          v-model="email"
          v-bind="emailAttrs"
          :invalid="!!errors?.email"
          placeholder="Електронна пошта"
          class="w-full pl-10 text-xl"
          aria-describedby="email-help"
        />
      </span>
      <small id="email-help" class="text-red-500" v-if="errors?.email">
        {{ errors.email }}
      </small>
    </div>

    <div class="mb-4 flex flex-col gap-2">
      <label for="phone" class="text-lg font-semibold text-surface-950 dark:text-surface-50">
        Номер телефону
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
          placeholder="Номер телефону"
          class="w-full pl-10 text-xl"
          aria-describedby="phone-help"
        />
      </span>
      <small id="phone-help" class="text-red-500" v-if="errors?.phone">
        {{ errors.phone }}
      </small>
    </div>

    <Button
      type="submit"
      icon="pi pi-verified"
      class="block w-full p-3 text-center text-xl"
      label="Зареєструватися"
      aria-describedby="submit-help"
    />

    <p class="text-center font-medium text-surface-500">Зареєструйтесь в додатку, щоб продовжити</p>

    <RouterLink
      :to="{ name: 'signin' }"
      class="cursor-pointer text-center font-semibold text-primary-600 hover:text-primary-500"
    >
      Увійти в додаток
    </RouterLink>
  </form>
</template>
