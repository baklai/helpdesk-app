<script setup></script>

<template>
  <Button
    text
    plain
    rounded
    :icon="$helpdesk.loggedIn ? 'pi pi-sign-out' : 'pi pi-sign-in'"
    v-tooltip.bottom="$helpdesk.loggedIn ? $t('Sign Out') : $t('Sign In')"
    @click="$helpdesk.loggedIn ? $auth.signout() : $router.push({ name: 'signin' })"
  />
</template>
