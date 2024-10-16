<script setup>
import { ref } from 'vue';

import AppLogo from '@/components/AppLogo.vue';
import BtnSocialMedia from '@/components/buttons/BtnSocialMedia.vue';

const disabledSelectedFromHTML = ref({
  '-webkit-user-select': 'none',
  '-moz-user-select': 'none',
  '-ms-user-select': 'none',
  '-o-user-select': 'none',
  'user-select': 'none'
});
</script>

<template>
  <div
    class="flex h-screen min-h-screen min-w-full overflow-hidden bg-gradient-to-tr from-surface-950 to-primary-950"
    :style="disabledSelectedFromHTML"
  >
    <div
      :class="[
        'flex h-full w-full flex-col justify-between bg-surface-100 px-6 py-6 dark:bg-surface-950 lg:w-1/3',
        'bg-[url(/img/bg-app.svg)] bg-cover bg-center bg-no-repeat lg:bg-none'
      ]"
    >
      <div class="mb-2 flex flex-col items-center justify-center">
        <div class="flex flex-row items-center">
          <p
            class="text-6xl font-bold uppercase text-surface-950 dark:text-surface-50"
            translate="no"
            lang="en"
          >
            help
          </p>
          <AppLogo class="mx-2 text-primary-500" :size="60" />
          <p
            class="text-6xl font-bold uppercase text-surface-950 dark:text-surface-50"
            translate="no"
            lang="en"
          >
            desk
          </p>
        </div>

        <p class="text-xl font-medium text-surface-500">
          {{ $t('Web Application of technical support') }}
        </p>
      </div>

      <main class="flex flex-col items-center gap-4">
        <RouterView />
      </main>

      <p class="text-center font-semibold text-surface-500">
        A problem?
        <a
          target="_blank"
          :href="$helpdesk.authorUrl"
          class="cursor-pointer font-semibold text-primary-600 hover:text-primary-500"
        >
          Click here
        </a>
        and let us help you.
      </p>
    </div>

    <div
      class="hidden w-2/3 flex-col items-center justify-between bg-[url('/img/bg-app.svg')] bg-cover bg-center bg-no-repeat px-6 py-6 lg:flex"
    >
      <div class="m-auto flex flex-col items-center justify-center">
        <div class="mb-2 flex flex-row items-center">
          <p class="text-8xl font-bold uppercase text-surface-100" translate="no" lang="en">help</p>
          <AppLogo class="mx-2 text-primary-500" :size="98" :stroke="'rgb(var(--primary-900))'" />
          <p class="text-8xl font-bold uppercase text-surface-100" translate="no" lang="en">desk</p>
        </div>

        <div class="mb-8 text-center">
          <p class="text-xl font-medium text-surface-300">
            {{ $t('Web Application of technical support') }}
          </p>
        </div>

        <div class="mb-8 w-[30rem] text-center">
          <p class="line-height-2 text-xl text-surface-400">
            {{ $t('Helpdesk technical support') }}
          </p>
        </div>

        <ul class="mb-6 flex list-none justify-evenly">
          <li class="mx-6 flex">
            <BtnSocialMedia
              icon="pi pi-facebook"
              :href="$helpdesk?.authorSocial?.facebook"
              tooltip="Facebook"
            />
          </li>

          <li class="mx-6">
            <BtnSocialMedia
              icon="pi pi-github"
              :href="$helpdesk?.authorSocial?.github"
              tooltip="Github"
            />
          </li>

          <li class="mx-6">
            <BtnSocialMedia
              icon="pi pi-linkedin"
              :href="$helpdesk?.authorSocial?.linkedin"
              tooltip="Linkedin"
            />
          </li>
        </ul>

        <p class="text-center">
          <RouterLink
            :to="{ name: 'home' }"
            class="font-medium uppercase text-primary-600 hover:text-primary-500"
          >
            {{ $t('Helpdesk home page') }}
          </RouterLink>
        </p>
      </div>

      <div class="flex items-center text-surface-300">
        <p class="py-4 font-semibold">
          {{ $helpdesk?.copyright }}
        </p>
      </div>
    </div>
  </div>
</template>
