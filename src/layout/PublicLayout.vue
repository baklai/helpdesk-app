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
  <main class="min-h-screen min-w-screen overflow-hidden" :class="disabledSelectedFromHTML">
    <div class="flex h-screen">
      <div class="w-full lg:w-4 h-full px-6 py-6 flex flex-column justify-content-between">
        <div class="flex justify-content-center mb-2">
          <div class="justify-content-start">
            <p class="uppercase font-bold text-7xl m-0 text-color" translate="no" lang="en">help</p>
          </div>
          <div class="flex align-items-center justify-content-center">
            <img src="/img/logo-app.webp" alt="HD logo" width="56" height="56" class="mx-2" />
          </div>
          <div class="justify-content-start">
            <p class="uppercase font-bold text-7xl m-0 text-color" translate="no" lang="en">desk</p>
          </div>
        </div>
        <div class="flex flex-column align-items-center gap-4">
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
        class="bg-layout w-8 hidden lg:flex flex-column justify-content-between align-items-center px-6 py-6 bg-cover bg-norepeat"
      >
        <div class="mt-auto mb-auto">
          <div class="flex flex-column lg:flex-row justify-content-center">
            <div class="w-auto flex flex-column align-items-center justify-content-center">
              <header class="flex align-items-center justify-content-center">
                <div class="w-30rem h-auto text-center">
                  <div class="flex justify-content-center mb-2">
                    <div class="justify-content-start">
                      <p
                        class="uppercase font-bold text-8xl m-0 text-color"
                        translate="no"
                        lang="en"
                      >
                        help
                      </p>
                    </div>
                    <div class="flex align-items-center justify-content-center">
                      <img
                        src="/img/logo-app.webp"
                        alt="HD logo"
                        width="72"
                        height="72"
                        class="mx-2"
                      />
                    </div>
                    <div class="justify-content-start">
                      <p
                        class="uppercase font-bold text-8xl m-0 text-color"
                        translate="no"
                        lang="en"
                      >
                        desk
                      </p>
                    </div>
                  </div>

                  <div class="text-center mb-6">
                    <p class="text-600 text-xl font-medium">
                      {{ $t('Web Application of technical support') }}
                    </p>
                  </div>

                  <div class="text-center mb-3">
                    <p class="text-xl line-height-2 text-color-secondary">
                      {{ $t('Helpdesk technical support') }}
                    </p>
                  </div>

                  <ul class="list-none flex justify-content-evenly p-0 mb-2">
                    <li class="mx-4">
                      <BtnSocialMedia
                        icon="pi pi-facebook"
                        :href="$helpdesk?.authorSocial?.facebook"
                        tooltip="Facebook"
                      />
                    </li>

                    <li class="mx-4">
                      <BtnSocialMedia
                        icon="pi pi-github"
                        :href="$helpdesk?.authorSocial?.github"
                        tooltip="Github"
                      />
                    </li>

                    <li class="mx-4">
                      <BtnSocialMedia
                        icon="pi pi-linkedin"
                        :href="$helpdesk?.authorSocial?.linkedin"
                        tooltip="Linkedin"
                      />
                    </li>
                  </ul>

                  <p class="text-center text-500 my-4">
                    <RouterLink :to="{ name: 'home' }" class="text-blue-500">
                      {{ $t('Helpdesk home page') }}
                    </RouterLink>
                  </p>
                </div>
              </header>
            </div>
          </div>
        </div>
        <div class="flex align-items-center gap-5">
          <p class="text-color-secondary font-semibold">
            {{ $helpdesk?.copyright }}
          </p>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.bg-layout {
  background-image: url('/img/bg-app.svg');
  background-position: center center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}
</style>
