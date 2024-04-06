<script setup>
import AppLogo from '@/components/AppLogo.vue';
import BtnSocialMedia from '@/components/buttons/BtnSocialMedia.vue';
</script>

<template>
  <div class="flex-shrink-0 p-4 w-full my-auto">
    <div class="flex flex-col lg:flex-row justify-center">
      <div class="w-auto flex flex-col items-center justify-center">
        <header class="flex items-center justify-center">
          <div class="w-[30rem] h-auto text-center">
            <div class="flex justify-center mb-2">
              <div class="justify-start">
                <p class="uppercase font-bold text-7xl" translate="no" lang="en">help</p>
              </div>
              <div class="flex items-center justify-center">
                <AppLogo class="mx-2 text-primary-500" :size="56" />
              </div>
              <div class="justify-start">
                <p class="uppercase font-bold text-7xl" translate="no" lang="en">desk</p>
              </div>
            </div>

            <div class="text-center mb-8">
              <p class="font-medium text-surface-500">
                {{ $t('Web Application of technical support') }}
              </p>
            </div>

            <div class="text-center mb-8">
              <p class="text-xl line-height-2 text-surface-500">
                {{ $t('Helpdesk technical support') }}
              </p>
            </div>

            <ul class="list-none flex justify-evenly p-0 mb-8">
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
            <p class="text-center text-surface-500">
              {{ $helpdesk?.copyright }}
            </p>
          </div>
        </header>
      </div>

      <div class="w-auto mx-8">
        <Divider layout="vertical" class="hidden lg:flex" />
        <Divider layout="horizontal" class="flex lg:hidden" />
      </div>

      <div class="w-auto flex items-center justify-center py-8">
        <main class="w-[30rem] justify-center items-center text-surface-600 dark:text-surface-300">
          <section id="documentation" class="mb-6">
            <h3 class="text-2xl mb-2 font-semibold text-surface-600 dark:text-surface-100">
              {{ 'Documentation' }}
            </h3>
            <span class="text-lg font-light">
              <RouterLink class="font-semibold text-primary-500 hover:text-primary-400" to="/docs">
                HD’s official documentation
              </RouterLink>
              provides you with all information you need to get started.
            </span>
          </section>

          <section id="pc-sys-inspector" class="mb-6">
            <h3 class="text-2xl mb-2 font-semibold text-surface-600 dark:text-surface-100">
              {{ 'PC SysInspector' }}
            </h3>
            <span class="text-lg font-light">
              <RouterLink
                class="font-semibold text-primary-500 hover:text-primary-400"
                :to="{ name: 'pc-sys-inspector' }"
              >
                PC SysInspector service
              </RouterLink>
              aggregates information about computers on the network, which can be useful for
              managing a fleet of computers and ensuring the security of an organization.
            </span>
          </section>

          <section id="hd-live-log" class="mb-6">
            <h3 class="text-2xl mb-2 font-semibold text-surface-600 dark:text-surface-100">
              {{ 'Help Desk Live Log' }}
            </h3>
            <span class="text-lg font-light">
              <RouterLink
                class="font-semibold text-primary-500 hover:text-primary-400"
                :to="{ name: 'helpdesk-live-log' }"
              >
                Help Desk Live Log
              </RouterLink>
              web service allows users to submit support requests through a web interface, track
              request status, and provide statistics and analytics on Help Desk performance.
            </span>
          </section>

          <section id="network-information">
            <h3 class="text-2xl mb-2 font-semibold text-surface-600 dark:text-surface-100">
              {{ 'Network information' }}
            </h3>
            <span class="text-lg font-light">
              <RouterLink
                class="font-semibold text-primary-500 hover:text-primary-400"
                :to="{ name: 'network-info' }"
              >
                Network information
              </RouterLink>
              web service is designed for keeping track of IP addresses of network devices and users
              on a local network. It allows administrators to keep records, as well as provides
              information on the availability of devices and their current status.
            </span>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>
