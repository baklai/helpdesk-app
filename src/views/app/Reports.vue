<script setup>
import { ref, onMounted } from 'vue';
import { useStatistic } from '@/stores/api/statistics';
import { dateToStr } from '@/service/DataFilters';

import AppIcons from '@/components/AppIcons.vue';

onMounted(async () => {});
</script>

<template>
  <div className="col-12">
    <div class="flex align-content-center mb-6">
      <div class="flex align-items-center justify-content-center mr-2">
        <AppIcons :name="$route?.name" :size="42" />
      </div>
      <div>
        <h3 class="my-auto">
          {{ $t($route?.meta?.title) }}
        </h3>
        <h5 class="text-sm text-color-secondary my-auto">{{ $t($route?.meta?.description) }}</h5>
      </div>
    </div>

    <div class="grid align-content-start">
      <div class="col-12">
        <div class="flex align-content-center">
          <div class="flex align-items-center justify-content-center mr-2">
            <AppIcons name="network-info" :size="24" />
          </div>
          <h3 class="my-auto">
            {{ $t('Network information') }}
          </h3>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 cursor-pointer h-full w-full hover:shadow-5">
          <div class="flex flex-column align-items-center justify-content-center">
            <div class="border-round p-2">
              <i class="pi pi-plus-circle text-6xl" />
            </div>
            <p>{{ $t('Create report template') }}</p>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 cursor-pointer h-full w-full hover:shadow-5">
          <div class="flex">
            <div class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4">
              <i class="pi pi-table text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('List of users with internet access') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('List of users with internet access') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 cursor-pointer h-full w-full hover:shadow-5">
          <div class="flex">
            <div class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4">
              <i class="pi pi-table text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('List of users with mail') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('List of users with mail') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="flex align-content-center">
          <div class="flex align-items-center justify-content-center mr-2">
            <AppIcons name="helpdesk-live-log" :size="24" />
          </div>
          <h3 class="my-auto">
            {{ $t('Help Desk Live Log') }}
          </h3>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 cursor-pointer h-full w-full hover:shadow-5">
          <div class="flex flex-column align-items-center justify-content-center">
            <div class="border-round p-2">
              <i class="pi pi-plus-circle text-6xl" />
            </div>
            <p>{{ $t('Create report template') }}</p>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 cursor-pointer h-full w-full hover:shadow-5">
          <div class="flex">
            <div class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4">
              <i class="pi pi-table text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('Requests for the current week') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('Requests for the current week') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 cursor-pointer h-full w-full hover:shadow-5">
          <div class="flex">
            <div class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4">
              <i class="pi pi-table text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('Requests for the current month') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('Requests for the current month') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 cursor-pointer h-full w-full hover:shadow-5">
          <div class="flex">
            <div class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4">
              <i class="pi pi-chart-bar text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('Requests for the current year by month') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('Requests for the current year by month') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="flex align-content-center">
          <div class="flex align-items-center justify-content-center mr-2">
            <AppIcons name="pc-sys-inspector" :size="24" />
          </div>
          <h3 class="my-auto">
            {{ $t('PC SysInspector') }}
          </h3>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 cursor-pointer h-full w-full hover:shadow-5">
          <div class="flex flex-column align-items-center justify-content-center">
            <div class="border-round p-2">
              <i class="pi pi-plus-circle text-6xl" />
            </div>
            <p>{{ $t('Create report template') }}</p>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 cursor-pointer h-full w-full hover:shadow-5">
          <div class="flex">
            <div class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4">
              <i class="pi pi-table text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('List of PCs with problematic users') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('List of PCs with problematic users') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 cursor-pointer h-full w-full hover:shadow-5">
          <div class="flex">
            <div class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4">
              <i class="pi pi-table text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('List of PCs with unwanted software') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('List of PCs with unwanted software') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 cursor-pointer h-full w-full hover:shadow-5">
          <div class="flex">
            <div class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4">
              <i class="pi pi-table text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('List of PCs with shared resources') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('List of PCs with shared resources') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 cursor-pointer h-full w-full hover:shadow-5">
          <div class="flex">
            <div class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4">
              <i class="pi pi-table text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('List of unwanted software') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('List of unwanted software') }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 cursor-pointer h-full w-full hover:shadow-5">
          <div class="flex">
            <div class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4">
              <i class="pi pi-chart-pie text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('PC Statuses') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('PC Statuses') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
