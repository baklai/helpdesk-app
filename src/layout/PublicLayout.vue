<script setup>
import { ref } from 'vue';

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
  <main class="min-h-screen min-w-full overflow-hidden" :class="disabledSelectedFromHTML">
    <div class="flex h-screen">
      <div class="w-full lg:w-1/3 h-full px-6 py-6 flex flex-col justify-between">
        <div class="flex justify-center mb-2">
          <div class="justify-start">
            <p class="uppercase font-bold text-7xl m-0 text-color" translate="no" lang="en">help</p>
          </div>
          <img src="/img/logo-app.webp" alt="HD logo" width="56" height="56" class="mx-2" />
          <div class="justify-start">
            <p class="uppercase font-bold text-7xl m-0 text-color" translate="no" lang="en">desk</p>
          </div>
        </div>
        <div class="flex flex-col items-center gap-4">
          <RouterView />
        </div>
        <p class="text-center text-color-secondary font-semibold">
          A problem?
          <a
            target="_blank"
            :href="$helpdesk.authorUrl"
            class="text-primary hover:underline cursor-pointer font-medium"
          >
            Click here
          </a>
          and let us help you.
        </p>
      </div>
      <div
        class="bg-image w-2/3 hidden lg:flex flex-col justify-between items-center px-6 py-6 bg-cover bg-center bg-no-repeat"
      >
        <div class="mt-auto mb-auto">
          <div class="flex flex-col lg:flex-row justify-center">
            <div class="w-auto flex flex-col items-center justify-center">
              <header class="flex items-center justify-center">
                <div class="w-[30rem] h-auto text-center">
                  <div class="flex justify-center mb-6">
                    <div class="justify-start">
                      <p
                        class="uppercase font-bold text-8xl text-primary-50"
                        translate="no"
                        lang="en"
                      >
                        help
                      </p>
                    </div>
                    <img
                      src="/img/logo-app.webp"
                      alt="HD logo"
                      width="72"
                      height="72"
                      class="mx-2"
                    />
                    <div class="justify-start">
                      <p
                        class="uppercase font-bold text-8xl text-primary-50"
                        translate="no"
                        lang="en"
                      >
                        desk
                      </p>
                    </div>
                  </div>

                  <div class="text-center mb-8">
                    <p class="text-xl font-medium text-surface-300">
                      {{ $t('Web Application of technical support') }}
                    </p>
                  </div>

                  <div class="text-center mb-8">
                    <p class="text-xl line-height-2 text-surface-400">
                      {{ $t('Helpdesk technical support') }}
                    </p>
                  </div>

                  <ul class="list-none flex justify-evenly p-0 mb-2">
                    <li class="mx-6">
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

                  <p class="text-center my-6">
                    <RouterLink :to="{ name: 'home' }" class="uppercase text-primary-500">
                      {{ $t('Helpdesk home page') }}
                    </RouterLink>
                  </p>
                </div>
              </header>
            </div>
          </div>
        </div>
        <div class="flex items-center text-surface-300">
          <p class="font-semibold py-4">
            {{ $helpdesk?.copyright }}
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.bg-image {
  background-image: url('/img/bg-app.svg');
}
</style>
