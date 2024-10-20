<script setup>
import AppLogo from '@/components/AppLogo.vue';
import BtnSocialMedia from '@/components/buttons/BtnSocialMedia.vue';
</script>

<template>
  <div class="h-full w-full place-content-center">
    <div class="my-8 flex flex-col place-content-center lg:my-0 lg:flex-row">
      <div class="flex w-auto flex-col items-center justify-center">
        <header class="flex items-center justify-center">
          <div class="h-auto w-[30rem] text-center">
            <div class="mb-2 flex flex-row items-center">
              <p class="text-7xl font-bold uppercase" translate="no" lang="en">help</p>
              <AppLogo class="mx-2 text-primary-500" :size="56" />
              <p class="text-7xl font-bold uppercase" translate="no" lang="en">desk</p>
            </div>

            <div class="mb-8 text-center">
              <p class="font-medium text-surface-500">Веб-додаток техпідтримки</p>
            </div>

            <div class="mb-8 text-center">
              <p class="line-height-2 text-xl text-surface-500">
                Технічна підтримка - це тип обслуговування клієнтів, яке надає допомогу клієнтам з
                технічними проблемами щодо їхніх продуктів або послуг
              </p>
            </div>

            <ul class="mb-8 flex list-none justify-evenly p-0">
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

      <div class="mx-8 w-auto">
        <Divider layout="vertical" class="hidden lg:flex" />
        <Divider layout="horizontal" class="flex lg:hidden" />
      </div>

      <div class="flex w-auto items-center justify-center py-8">
        <main class="w-[30rem] items-center justify-center text-surface-600 dark:text-surface-300">
          <section id="documentation" class="mb-6">
            <h3 class="mb-2 text-2xl font-semibold text-surface-600 dark:text-surface-100">
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
            <h3 class="mb-2 text-2xl font-semibold text-surface-600 dark:text-surface-100">
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
            <h3 class="mb-2 text-2xl font-semibold text-surface-600 dark:text-surface-100">
              {{ 'Technical support' }}
            </h3>
            <span class="text-lg font-light">
              <RouterLink
                class="font-semibold text-primary-500 hover:text-primary-400"
                :to="{ name: 'technical-support' }"
              >
                Technical support
              </RouterLink>
              web service allows users to submit support requests through a web interface, track
              request status, and provide statistics and analytics on Help Desk performance.
            </span>
          </section>

          <section id="network-information">
            <h3 class="mb-2 text-2xl font-semibold text-surface-600 dark:text-surface-100">
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
