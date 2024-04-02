<script setup>
import { ref } from 'vue';
import Knob from 'primevue/knob';

import { useConfig } from '@/stores/config';

defineProps(['visible']);
defineEmits(['update:visible']);

const $config = useConfig();

const primaryColors = ref([]);

const surfaceColors = ref([]);
</script>

<template>
  <Sidebar
    position="right"
    class="w-[30rem]"
    :visible="visible"
    @update:visible="$emit('update:visible', !visible)"
  >
    <template #header>
      <div class="flex content-center font-semibold text-surface-900 dark:text-surface-100">
        <div class="flex items-center justify-center mr-2">
          <i class="pi pi-cog inline-block text-2xl" />
        </div>
        <div class="flex items-center justify-center">
          <p class="inline-block text-2xl">{{ $t('HD Options') }}</p>
        </div>
      </div>
    </template>

    <Divider />

    <div class="px-4">
      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full text-lg font-semibold">{{ $t('Scale') }}</h5>
        </div>
        <div class="flex flex-1 flex-col justify-center items-center">
          <Knob v-model="$config.scale" :size="100" :step="1" :min="10" :max="18" />
        </div>
      </div>

      <Divider />

      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full text-lg font-semibold">{{ $t('Primary Colors') }}</h5>
        </div>
        <div class="flex flex-1 items-center justify-between">
          <!-- <div class="flex gap-2 items-center">
            <i
              class="pi pi-circle-fill"
              v-for="item in primaryColors"
              :key="item"
              :class="{ 'text-primary-500': item === $config.scale }"
            ></i>
          </div> -->
          <div class="self-stretch justify-center items-center gap-2 inline-flex flex-wrap">
            <button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(16, 185, 129)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(34, 197, 94)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(132, 204, 22)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(239, 68, 68)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(249, 115, 22)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(245, 158, 11)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(234, 179, 8)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(20, 184, 166)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(6, 182, 212)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer ring-2 ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-800 ring-primary-500"
              style="background-color: rgb(14, 165, 233)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(59, 130, 246)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(99, 102, 241)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(139, 92, 246)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(168, 85, 247)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(217, 70, 239)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(236, 72, 153)"
            ></button>
          </div>
        </div>
      </div>

      <Divider />

      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full text-lg font-semibold">{{ $t('Surface Colors') }}</h5>
        </div>
        <div class="flex-1">
          <div class="self-stretch justify-center items-center gap-2 inline-flex">
            <button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer ring-2 ring-offset-2 ring-offset-surface-0 dark:ring-offset-surface-800 hover:ring-surface-500"
              style="background-color: rgb(100, 116, 139)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(107, 114, 128)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(113, 113, 122)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(115, 115, 115)"
            ></button
            ><button
              type="button"
              class="w-4 h-4 rounded-full cursor-pointer"
              style="background-color: rgb(120, 113, 108)"
            ></button>
          </div>
          <!-- <div class="flex gap-2 items-center">
            <i
              class="pi pi-circle-fill"
              v-for="item in surfaceColors"
              :key="item"
              :class="{ 'text-primary-500': item === $config.scale }"
            ></i>
          </div> -->
        </div>
      </div>

      <Divider />

      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full text-lg font-semibold">
            {{ $t('Ripple Effect') }}
          </h5>
        </div>
        <div class="flex-1">
          <InputSwitch v-model="$config.ripple" aria-labelledby="single" />
        </div>
      </div>

      <Divider />

      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full text-lg font-semibold">{{ $t('Menu Type') }}</h5>
        </div>
        <div class="flex-1 justify-center">
          <SelectButton v-model="$config.menuMode" :options="['static', 'overlay']" />
        </div>
      </div>

      <Divider />

      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full text-lg font-semibold">{{ $t('Input Style') }}</h5>
        </div>
        <div class="flex-1 justify-center">
          <SelectButton v-model="$config.inputStyle" :options="['outlined', 'filled']" />
        </div>
      </div>

      <Divider />

      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full text-lg font-semibold">{{ $t('Themes style') }}</h5>
        </div>
        <div class="flex-1 justify-center">
          <SelectButton v-model="$config.theme" :options="['light', 'dark']" />
        </div>
      </div>

      <Divider />

      <Button :label="$t('Set default options')" class="w-full" @click="$config.setDefault" />
    </div>
  </Sidebar>
</template>
