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
      class="w-full lg:w-1/3 h-full px-6 py-6 flex flex-col justify-between bg-surface-100 dark:bg-surface-950"
    >
      <div class="flex flex-col items-center justify-center mb-2">
        <div class="flex">
          <div class="justify-start">
            <p
              class="uppercase font-bold text-7xl m-0 text-surface-950 dark:text-surface-50"
              translate="no"
              lang="en"
            >
              help
            </p>
          </div>
          <AppLogo class="mx-2 text-primary-500" :size="60" />
          <div class="justify-start">
            <p
              class="uppercase font-bold text-7xl m-0 text-surface-950 dark:text-surface-50"
              translate="no"
              lang="en"
            >
              desk
            </p>
          </div>
        </div>

        <p class="text-xl font-medium text-surface-500">
          {{ $t('Web Application of technical support') }}
        </p>
      </div>

      <main class="flex flex-col items-center gap-4">
        <RouterView />
      </main>

      <p class="text-center text-surface-500 font-semibold">
        A problem?
        <a
          target="_blank"
          :href="$helpdesk.authorUrl"
          class="font-semibold cursor-pointer text-primary-600 hover:text-primary-500"
        >
          Click here
        </a>
        and let us help you.
      </p>
    </div>

    <div
      class="bg-[url('/img/bg-app.svg')] w-2/3 hidden lg:flex flex-col justify-between items-center px-6 py-6 bg-cover bg-center bg-no-repeat"
    >
      <div class="flex flex-col m-auto items-center justify-center">
        <div class="flex flex-row items-center mb-2">
          <p
            class="uppercase text-center font-bold text-8xl text-surface-100"
            translate="no"
            lang="en"
          >
            help
          </p>

          <AppLogo class="mx-2 text-primary-500" :size="98" :stroke="'rgb(var(--primary-900))'" />

          <p class="uppercase font-bold text-8xl text-surface-100" translate="no" lang="en">desk</p>
        </div>

        <div class="text-center mb-8">
          <p class="text-xl font-medium text-surface-300">
            {{ $t('Web Application of technical support') }}
          </p>
        </div>

        <div class="w-[30rem] text-center mb-8">
          <p class="text-xl line-height-2 text-surface-400">
            {{ $t('Helpdesk technical support') }}
          </p>
        </div>

        <ul class="flex justify-evenly list-none mb-6">
          <li class="flex mx-6">
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
            class="uppercase font-medium text-primary-600 hover:text-primary-500"
          >
            {{ $t('Helpdesk home page') }}
          </RouterLink>
        </p>
      </div>

      <div class="flex items-center text-surface-300">
        <p class="font-semibold py-4">
          {{ $helpdesk?.copyright }}
        </p>
      </div>
    </div>
  </div>
</template>
