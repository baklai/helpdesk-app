<script setup>
import { ref, watchEffect } from 'vue';
import Knob from 'primevue/knob';

import { useConfig } from '@/stores/config';

defineProps(['visible']);
defineEmits(['update:visible']);

const $config = useConfig();

const primaryColor = ref([]);
const surfaceColor = ref([]);

const primaryColors = ref([
  {
    color: '16 185 129',
    styles: [
      '--primary-50: 236 253 245',
      '--primary-100: 209 250 229',
      '--primary-200: 167 243 208',
      '--primary-300: 110 231 183',
      '--primary-400: 52 211 153',
      '--primary-500: 16 185 129',
      '--primary-600: 5 150 105',
      '--primary-700: 4 120 87',
      '--primary-800: 6 95 70',
      '--primary-900: 4 78 56',
      '--primary-950: 2 44 34'
    ]
  },
  {
    color: '34 197 94',
    styles: [
      '--primary-50: 240 253 244',
      '--primary-100: 220 252 231',
      '--primary-200: 187 247 208',
      '--primary-300: 134 239 172',
      '--primary-400: 78 222 128',
      '--primary-500: 34 197 94',
      '--primary-600: 22 163 74',
      '--primary-700: 21 128 61',
      '--primary-800: 22 101 52',
      '--primary-900: 20 83 45',
      '--primary-950: 23 78 22'
    ]
  },
  {
    color: '132 204 22',
    styles: [
      '--primary-50: 247 254 231',
      '--primary-100: 236 252 203',
      '--primary-200: 217 249 157',
      '--primary-300: 190 242 100',
      '--primary-400: 163 230 53',
      '--primary-500: 132 204 22',
      '--primary-600: 101 163 13',
      '--primary-700: 77 124 15',
      '--primary-800: 63 98 18',
      '--primary-900: 54 83 20',
      '--primary-950: 26 46 5'
    ]
  },
  {
    color: '239 68 68',
    styles: [
      '--primary-50: 254 242 242',
      '--primary-100: 254 226 226',
      '--primary-200: 254 202 202',
      '--primary-300: 252 165 165',
      '--primary-400: 248 113 113',
      '--primary-500: 239 68 68',
      '--primary-600: 220 38 38',
      '--primary-700: 185 28 28',
      '--primary-800: 153 27 27',
      '--primary-900: 127 29 29',
      '--primary-950: 69 10 10'
    ]
  },
  {
    color: '249 115 22',
    styles: [
      '--primary-50: 255 247 237',
      '--primary-100: 255 237 213',
      '--primary-200: 254 215 170',
      '--primary-300: 253 186 116',
      '--primary-400: 251 146 60',
      '--primary-500: 249 115 22',
      '--primary-600: 234 88 12',
      '--primary-700: 194 65 12',
      '--primary-800: 154 52 18',
      '--primary-900: 124 45 18',
      '--primary-950: 67 20 7'
    ]
  },
  {
    color: '245 158 11',
    styles: [
      '--primary-50: 255 251 235',
      '--primary-100: 254 243 199',
      '--primary-200: 253 230 138',
      '--primary-300: 252 211 77',
      '--primary-400: 251 191 36',
      '--primary-500: 245 158 11',
      '--primary-600: 217 119 6',
      '--primary-700: 180 83 9',
      '--primary-800: 146 64 14',
      '--primary-900: 120 53 15',
      '--primary-950: 69 26 3'
    ]
  },
  {
    color: '234 179 8',
    styles: [
      '--primary-50: 254 252 232',
      '--primary-100: 254 249 195',
      '--primary-200: 254 240 138',
      '--primary-300: 253 224 71',
      '--primary-400: 250 204 21',
      '--primary-500: 234 179 8',
      '--primary-600: 202 138 4',
      '--primary-700: 161 98 7',
      '--primary-800: 130 77 14',
      '--primary-900: 113 63 18',
      '--primary-950: 66 32 6'
    ]
  },
  {
    color: '20 184 166',
    styles: [
      '--primary-50: 240 253 250',
      '--primary-100: 204 251 241',
      '--primary-200: 153 246 228',
      '--primary-300: 94 234 212',
      '--primary-400: 45 212 191',
      '--primary-500: 20 184 166',
      '--primary-600: 13 148 136',
      '--primary-700: 15 118 110',
      '--primary-800: 21 94 89',
      '--primary-900: 20 78 74',
      '--primary-950: 4 47 46'
    ]
  },
  {
    color: '6 182 212',
    styles: [
      '--primary-50: 236 254 255',
      '--primary-100: 207 250 254',
      '--primary-200: 165 243 252',
      '--primary-300: 103 232 249',
      '--primary-400: 34 211 238',
      '--primary-500: 6 182 212',
      '--primary-600: 8 145 178',
      '--primary-700: 14 116 144',
      '--primary-800: 21 94 117',
      '--primary-900: 22 78 99',
      '--primary-950: 8 51 68'
    ]
  },
  {
    color: '14 165 233',
    styles: [
      '--primary-50: 240 249 255',
      '--primary-100: 224 242 254',
      '--primary-200: 186 230 253',
      '--primary-300: 125 211 252',
      '--primary-400: 56 189 248',
      '--primary-500: 14 165 233',
      '--primary-600: 2 132 199',
      '--primary-700: 3 105 161',
      '--primary-800: 21 94 133',
      '--primary-900: 12 74 110',
      '--primary-950: 8 47 73'
    ]
  },
  {
    color: '59 130 246',
    styles: [
      '--primary-50: 239 246 255',
      '--primary-100: 219 234 254',
      '--primary-200: 191 219 254',
      '--primary-300: 147 197 253',
      '--primary-400: 96 165 250',
      '--primary-500: 59 130 246',
      '--primary-600: 37 99 235',
      '--primary-700: 29 78 216',
      '--primary-800: 30 64 175',
      '--primary-900: 30 58 138',
      '--primary-950: 23 37 84'
    ]
  },
  {
    color: '99 102 241',
    styles: [
      '--primary-50: 238 242 255',
      '--primary-100: 224 231 255',
      '--primary-200: 199 210 254',
      '--primary-300: 165 180 252',
      '--primary-400: 129 140 248',
      '--primary-500: 99 102 241',
      '--primary-600: 79 70 229',
      '--primary-700: 67 56 202',
      '--primary-800: 55 48 163',
      '--primary-900: 49 46 129',
      '--primary-950: 30 27 75'
    ]
  },
  {
    color: '139 92 246',
    styles: [
      '--primary-50: 245 243 255',
      '--primary-100: 237 233 254',
      '--primary-200: 221 214 254',
      '--primary-300: 196 181 253',
      '--primary-400: 167 139 250',
      '--primary-500: 139 92 246',
      '--primary-600: 124 58 237',
      '--primary-700: 109 40 217',
      '--primary-800: 91 33 182',
      '--primary-900: 76 29 149',
      '--primary-950: 50 23 102'
    ]
  },
  {
    color: '168 85 247',
    styles: [
      '--primary-50: 250 245 255',
      '--primary-100: 243 232 255',
      '--primary-200: 233 213 255',
      '--primary-300: 216 180 254',
      '--primary-400: 192 132 252',
      '--primary-500: 168 85 247',
      '--primary-600: 147 51 234',
      '--primary-700: 126 34 206',
      '--primary-800: 107 33 168',
      '--primary-900: 88 28 135',
      '--primary-950: 59 20 100'
    ]
  },
  {
    color: '217 70 239',
    styles: [
      '--primary-50: 253 244 255',
      '--primary-100: 250 232 255',
      '--primary-200: 245 208 254',
      '--primary-300: 240 171 252',
      '--primary-400: 232 121 249',
      '--primary-500: 217 70 239',
      '--primary-600: 192 38 211',
      '--primary-700: 162 28 175',
      '--primary-800: 126 34 153',
      '--primary-900: 109 40 121',
      '--primary-950: 74 9 78'
    ]
  },
  {
    color: '236 72 153',
    styles: [
      '--primary-50: 253 242 248',
      '--primary-100: 252 231 243',
      '--primary-200: 251 207 232',
      '--primary-300: 249 168 212',
      '--primary-400: 244 114 182',
      '--primary-500: 236 72 153',
      '--primary-600: 219 39 119',
      '--primary-700: 190 24 93',
      '--primary-800: 157 23 77',
      '--primary-900: 131 24 67',
      '--primary-950: 80 7 36'
    ]
  }
]);

const surfaceColors = ref([
  {
    color: '100 116 139',
    styles: [
      '--surface-0: 255 255 255',
      '--surface-50: 248 250 252',
      '--surface-100: 241 245 249',
      '--surface-200: 226 232 240',
      '--surface-300: 203 213 225',
      '--surface-400: 148 163 184',
      '--surface-500: 100 116 139',
      '--surface-600: 71 85 105',
      '--surface-700: 45 55 72',
      '--surface-800: 30 41 59',
      '--surface-900: 15 23 42',
      '--surface-950: 3 6 23'
    ]
  },
  {
    color: '107 114 128',
    styles: [
      '--surface-0: 255 255 255',
      '--surface-50: 249 250 251',
      '--surface-100: 243 244 246',
      '--surface-200: 229 231 235',
      '--surface-300: 209 213 219',
      '--surface-400: 156 163 175',
      '--surface-500: 107 114 128',
      '--surface-600: 75 85 99',
      '--surface-700: 55 65 81',
      '--surface-800: 31 41 55',
      '--surface-900: 17 24 39',
      '--surface-950: 8 8 8'
    ]
  },
  {
    color: '113 113 122',
    styles: [
      '--surface-0: 255 255 255',
      '--surface-50: 250 250 250',
      '--surface-100: 244 244 245',
      '--surface-200: 228 228 231',
      '--surface-300: 212 212 216',
      '--surface-400: 161 161 170',
      '--surface-500: 113 113 122',
      '--surface-600: 82 82 91',
      '--surface-700: 63 63 70',
      '--surface-800: 39 39 42',
      '--surface-900: 24 24 27',
      '--surface-950: 18 18 19'
    ]
  },
  {
    color: '115 115 115',
    styles: [
      '--surface-0: 255 255 255',
      '--surface-50: 250 250 250',
      '--surface-100: 245 245 245',
      '--surface-200: 229 229 229',
      '--surface-300: 212 212 212',
      '--surface-400: 163 163 163',
      '--surface-500: 115 115 115',
      '--surface-600: 82 82 82',
      '--surface-700: 64 64 64',
      '--surface-800: 38 38 38',
      '--surface-900: 24 24 24',
      '--surface-950: 17 17 17'
    ]
  },
  {
    color: '120 113 108',
    styles: [
      '--surface-0: 255 255 255',
      '--surface-50: 250 250 249',
      '--surface-100: 245 245 244',
      '--surface-200: 231 229 228',
      '--surface-300: 214 211 209',
      '--surface-400: 168 162 158',
      '--surface-500: 120 113 108',
      '--surface-600: 87 83 78',
      '--surface-700: 68 64 60',
      '--surface-800: 46 42 41',
      '--surface-900: 36 33 31',
      '--surface-950: 28 25 23'
    ]
  }
]);

watchEffect(() => {
  document.documentElement.style = primaryColor.value.join(';') + surfaceColor.value.join(';');
});
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

    <Divider class="!m-0 !mb-8" />

    <div class="px-4">
      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full text-lg font-semibold">{{ $t('Display scale') }}</h5>
        </div>
        <div class="flex flex-1 flex-col justify-center items-center">
          <Knob v-model="$config.scale" :size="100" :step="1" :min="10" :max="18" />
        </div>
      </div>

      <Divider />

      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full text-lg font-semibold">{{ $t('Primary colors') }}</h5>
        </div>
        <div class="flex flex-1 items-center justify-center">
          <div class="self-stretch justify-center items-center gap-2 inline-flex flex-wrap">
            <button
              type="button"
              :class="[
                'w-4 h-4 rounded-full cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-offset-surface-800'
              ]"
              v-for="item in primaryColors"
              :key="item.color"
              :style="`background-color: rgb(${item.color})`"
              @click="primaryColor = item.styles"
            />
          </div>
        </div>
      </div>

      <Divider />

      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full text-lg font-semibold">{{ $t('Surface colors') }}</h5>
        </div>
        <div class="flex flex-1 items-center justify-center">
          <div class="self-stretch justify-center items-center gap-2 inline-flex flex-wrap">
            <button
              type="button"
              :class="[
                'w-4 h-4 rounded-full cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-offset-surface-800'
              ]"
              v-for="item in surfaceColors"
              :key="item.color"
              :style="`background-color: rgb(${item.color})`"
              @click="surfaceColor = item.styles"
            />
          </div>
        </div>
      </div>

      <Divider />

      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full text-lg font-semibold">
            {{ $t('Ripple effect') }}
          </h5>
        </div>
        <div class="flex-1">
          <InputSwitch v-model="$config.ripple" aria-labelledby="single" />
        </div>
      </div>

      <Divider />

      <div class="flex my-3">
        <div class="flex-1">
          <h5 class="flex items-center h-full text-lg font-semibold">{{ $t('Menu type') }}</h5>
        </div>
        <div class="flex-1 justify-center">
          <SelectButton v-model="$config.menuMode" :options="['static', 'overlay']" />
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

      <Button
        :label="$t('Set default options')"
        class="w-full my-6"
        @click="$config.setDefaultConfigs"
      />
    </div>
  </Sidebar>
</template>
