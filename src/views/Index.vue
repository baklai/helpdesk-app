<script setup>
import BtnSocialMedia from '@/components/buttons/BtnSocialMedia.vue';
</script>

<template>
  <div class="col-12 my-auto">
    <div class="flex flex-column lg:flex-row justify-content-center">
      <div class="w-auto flex flex-column align-items-center justify-content-center">
        <header class="flex align-items-center justify-content-center">
          <div class="w-30rem h-auto text-center">
            <div class="flex justify-content-center mb-2">
              <div class="justify-content-start">
                <p class="uppercase font-bold text-7xl m-0 text-color" translate="no" lang="en">
                  help
                </p>
              </div>
              <div class="flex align-items-center justify-content-center">
                <img src="/img/logo-app.webp" alt="HD logo" width="56" height="56" class="mx-2" />
              </div>
              <div class="justify-content-start">
                <p class="uppercase font-bold text-7xl m-0 text-color" translate="no" lang="en">
                  desk
                </p>
              </div>
            </div>

            <div class="text-center mb-6">
              <p class="text-600 font-medium">{{ $t('Web Application of technical support') }}</p>
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
            <p class="text-center text-500">
              {{ $helpdesk?.copyright }}
            </p>
          </div>
        </header>
      </div>

      <div class="w-auto mx-8">
        <Divider layout="vertical" class="hidden lg:flex" />
        <Divider layout="horizontal" class="flex lg:hidden" align="center" />
      </div>

      <div class="w-auto flex align-items-center justify-content-center py-5">
        <main class="w-30rem justify-content-center align-items-center">
          <section id="documentation" class="mb-4">
            <h3 class="mb-1">{{ 'Documentation' }}</h3>
            <span class="text-lg text-color-secondary font-light">
              <RouterLink class="text-blue-500" to="/docs">
                HD’s official documentation
              </RouterLink>
              provides you with all information you need to get started.
            </span>
          </section>

          <section id="pc-sys-inspector" class="mb-4">
            <h3 class="mb-1">{{ 'PC SysInspector' }}</h3>
            <span class="text-lg text-color-secondary font-light">
              <RouterLink class="text-blue-500" :to="{ name: 'pc-sys-inspector-statistics' }">
                PC SysInspector service
              </RouterLink>
              aggregates information about computers on the network, which can be useful for
              managing a fleet of computers and ensuring the security of an organization.
            </span>
          </section>

          <section id="hd-live-log" class="mb-4">
            <h3 class="mb-1">{{ 'Help Desk Live Log' }}</h3>
            <span class="text-lg text-color-secondary font-light">
              <RouterLink class="text-blue-500" :to="{ name: 'helpdesk-live-log-statistics' }">
                Help Desk Live Log
              </RouterLink>
              web service allows users to submit support requests through a web interface, track
              request status, and provide statistics and analytics on Help Desk performance.
            </span>
          </section>

          <section id="network-information">
            <h3 class="mb-1">{{ 'Network information' }}</h3>
            <span class="text-lg text-color-secondary font-light">
              <RouterLink class="text-blue-500" :to="{ name: 'network-statistics' }">
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
