<script setup></script>

<template>
  <Button
    text
    rounded
    severity="secondary"
    :icon="$helpdesk.loggedIn ? 'pi pi-sign-out' : 'pi pi-sign-in'"
    v-tooltip.top="$helpdesk.loggedIn ? $t('Sign Out') : $t('Sign In')"
    @click="$helpdesk.loggedIn ? $auth.signout() : $router.push({ name: 'signin' })"
  />
</template>
