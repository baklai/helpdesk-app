<script setup>
import { ref } from 'vue';

import { useConfig } from '@/stores/config';

defineProps(['visible']);
defineEmits(['update:visible']);

const $config = useConfig();

const scales = ref([12, 13, 14, 15, 16]);

const incrementScale = () => {
  $config.scale++;
};

const decrementScale = () => {
  $config.scale--;
};
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
          <h5 class="flex items-center h-full">{{ $t('Scale') }}</h5>
        </div>
        <div class="flex flex-1 items-center justify-between">
          <Button
            icon="pi pi-minus"
            type="button"
            @click="decrementScale"
            class="p-button-text p-button-rounded p-button-plain w-2rem h-2rem mr-2"
            :disabled="$config.scale === scales[0]"
          />
          <div class="flex gap-2 items-center">
            <i
              class="pi pi-circle-fill"
              v-for="item in scales"
              :key="item"
              :class="{ 'text-primary-500': item === $config.scale }"
            ></i>
          </div>
          <Button
            icon="pi pi-plus"
            type="button"
            pButton
            @click="incrementScale"
            class="p-button-text p-button-rounded p-button-plain w-2rem h-2rem ml-2"
            :disabled="$config.scale === scales[scales.length - 1]"
          />
        </div>
      </div>

      <Divider />

      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full">
            {{ $t('Ripple Effect') }}
          </h5>
        </div>
        <div class="flex-1">
          <SelectButton
            v-model="$config.ripple"
            :options="[true, false]"
            aria-labelledby="single"
          />
        </div>
      </div>

      <Divider />

      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full">{{ $t('Menu Type') }}</h5>
        </div>
        <div class="flex-1">
          <SelectButton v-model="$config.menuMode" :options="['static', 'overlay']" />
        </div>
      </div>

      <Divider />

      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full">{{ $t('Input Style') }}</h5>
        </div>
        <div class="flex-1">
          <SelectButton v-model="$config.inputStyle" :options="['outlined', 'filled']" />
        </div>
      </div>

      <Divider />

      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full">{{ $t('Themes style') }}</h5>
        </div>
        <div class="flex-1">
          <SelectButton v-model="$config.theme" :options="['light', 'dark']" />
        </div>
      </div>

      <Divider />

      <Button
        :label="$t('Set default options')"
        class="p-button-text w-full"
        @click="$config.setDefault"
      />
    </div>
  </Sidebar>
</template>
