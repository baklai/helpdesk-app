<script setup></script>

<template>
  <Button
    text
    plain
    rounded
    class="text-2xl w-12 h-12 hover:text-surface-600 dark:hover:text-surface-300"
    :icon="$helpdesk.loggedIn ? 'pi pi-sign-out' : 'pi pi-sign-in'"
    v-tooltip.top="$helpdesk.loggedIn ? $t('Sign Out') : $t('Sign In')"
    @click="$helpdesk.loggedIn ? $auth.signout() : $router.push({ name: 'signin' })"
  />
</template>
