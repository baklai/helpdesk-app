<script setup>
import PanelMenu from 'primevue/panelmenu';

import { useSidebar } from '@/stores/sidebar';

const $sidebar = useSidebar();
</script>

<template>
  <PanelMenu
    :model="$sidebar.navLinks"
    class="w-full"
    :pt="{
      headercontent: ({ context, instance }) => ({
        class: [
          'py-1',
          'cursor-auto',
          'font-semibold',
          'text-surface-600 dark:text-surface-0/80',
          'transition duration-200 ease-in-out',
          'transition-shadow duration-200'
        ]
      }),
      menucontent: {
        class: ['py-2', 'px-4']
      }
    }"
  >
    <template #item="{ item, active }">
      <span
        v-if="typeof item === 'string'"
        :class="['flex items-center', 'mx-0 my-2', 'font-bold', 'uppercase']"
      >
        {{ item }}
      </span>

      <router-link
        v-else-if="item.name && !item.items"
        v-slot="{ href, navigate }"
        :to="{ name: item.name }"
        custom
      >
        <a
          :class="[
            'flex items-center',
            'px-3 py-2',
            'rounded-md',
            'font-semibold',
            'cursor-pointer',
            'text-surface-700 dark:text-surface-0/80',
            'hover:bg-surface-100 dark:hover:bg-surface-700',
            'hover:text-surface-900',
            'transition duration-200 ease-in-out',
            'transition-shadow duration-200',
            {
              'font-bold !text-primary-500': item.name === $router.currentRoute.value.name
            }
          ]"
          :href="href"
          @click="navigate"
        >
          <AppIcons :name="item.icon" class="mr-2" :size="18" />
          <span class="text-color ml-2">{{ item.label }}</span>
        </a>
      </router-link>

      <a
        v-else
        :class="[
          'flex items-center',
          'px-3 py-2',
          'rounded-md',
          'cursor-pointer',
          'text-surface-700 dark:text-surface-0/80',
          'hover:bg-surface-100 dark:hover:bg-surface-700',
          'hover:text-surface-900',
          'transition duration-200 ease-in-out',
          'transition-shadow duration-200'
        ]"
        :href="item.url"
        :target="item.target"
      >
        <AppIcons :name="item.icon" class="mr-2" :size="18" />
        <span class="ml-2">{{ item.label }}</span>
        <span
          v-if="item.items"
          :class="[
            'pi pi-angle-down',
            'ml-auto text-sm',
            'transform transition delay-200',
            { 'rotate-180': active }
          ]"
        />
      </a>
    </template>
  </PanelMenu>
</template>
