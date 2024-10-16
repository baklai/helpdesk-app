<script setup></script>

<template>
  <Button
    text
    plain
    rounded
    class="h-12 w-12 text-2xl"
    :icon="$helpdesk.loggedIn ? 'pi pi-sign-out' : 'pi pi-sign-in'"
    v-tooltip.top="$helpdesk.loggedIn ? $t('Sign Out') : $t('Sign In')"
    @click="$helpdesk.loggedIn ? $auth.signout() : $router.push({ name: 'signin' })"
  />
</template>
