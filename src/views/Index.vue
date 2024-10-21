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
              <p class="font-medium text-surface-500">Веб-додаток технічної підтримки</p>
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
        <main class="w-[35rem] items-center justify-center text-surface-600 dark:text-surface-300">
          <section id="documentation" class="mb-6">
            <h3 class="mb-2 text-2xl font-semibold text-surface-600 dark:text-surface-100">
              Документація
            </h3>
            <span class="text-lg font-light">
              <RouterLink class="font-semibold text-primary-500 hover:text-primary-400" to="/docs">
                HD Довідник
              </RouterLink>
              містить усю інформацію, необхідну для початку роботи.
            </span>
          </section>

          <section id="pc-sys-inspector" class="mb-6">
            <h3 class="mb-2 text-2xl font-semibold text-surface-600 dark:text-surface-100">
              ПК SysInspector
            </h3>
            <span class="text-lg font-light">
              <RouterLink
                class="font-semibold text-primary-500 hover:text-primary-400"
                :to="{ name: 'pc-sys-inspector' }"
              >
                ПК SysInspector сервіс
              </RouterLink>
              збирає інформацію про комп’ютери в мережі, яка може бути корисною для управління
              парком комп'ютерів і забезпечення безпеки організації.
            </span>
          </section>

          <section id="hd-live-log" class="mb-6">
            <h3 class="mb-2 text-2xl font-semibold text-surface-600 dark:text-surface-100">
              Технічна підтримка
            </h3>
            <span class="text-lg font-light">
              <RouterLink
                class="font-semibold text-primary-500 hover:text-primary-400"
                :to="{ name: 'technical-support' }"
              >
                Технічна підтримка
              </RouterLink>
              веб-додаток дозволяє користувачам надсилати запити на підтримку через веб-інтерфейс,
              трек статус запиту, а також надавати статистику та аналітику продуктивності служби
              підтримки.
            </span>
          </section>

          <section id="network-information">
            <h3 class="mb-2 text-2xl font-semibold text-surface-600 dark:text-surface-100">
              Мережева інформація
            </h3>
            <span class="text-lg font-light">
              <RouterLink
                class="font-semibold text-primary-500 hover:text-primary-400"
                :to="{ name: 'network-info' }"
              >
                Мережева інформація
              </RouterLink>
              веб-сервіс призначений для відстеження IP-адрес мережевих пристроїв і користувачів в
              локальній мережі. Це дозволяє адміністраторам вести облік, а також забезпечує
              інформація про наявність пристроїв та їх поточний стан.
            </span>
          </section>
        </main>
      </div>
    </div>
  </div>
</template>
