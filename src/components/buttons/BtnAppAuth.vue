<script setup>
import { inject } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

const { t } = useI18n();
const toast = useToast();

const $auth = inject('auth');

const onSignout = async () => {
  try {
    await $auth.signout();
    toast.add({
      severity: 'info',
      summary: t('HD Information'),
      detail: t('Logout successfully completed'),
      life: 3000
    });
  } catch (err) {
    toast.add({ severity: 'warn', summary: t('HD Warning'), detail: t(err.message), life: 3000 });
  }
};
</script>

<template>
  <Button
    text
    plain
    rounded
    :icon="$helpdesk.loggedIn ? 'pi pi-sign-out' : 'pi pi-sign-in'"
    v-tooltip.bottom="$helpdesk.loggedIn ? $t('Sign Out') : $t('Sign In')"
    @click="$helpdesk.loggedIn ? onSignout() : $router.push({ name: 'signin' })"
  />
</template>
