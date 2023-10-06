<script setup></script>

<template>
  <div className="col-12">
    <div class="flex align-content-center mb-4">
      <div class="flex align-items-center justify-content-center mr-2">
        <AppIcons :name="$route?.name" :size="42" />
      </div>
      <div>
        <h3 class="my-auto">
          {{ $t($route?.meta?.title) }}
        </h3>
        <h5 class="text-sm text-color-secondary my-auto">
          {{ $t($route?.meta?.description) }}
        </h5>
      </div>
    </div>

    <div class="grid align-content-start">
      <div class="col-12 lg:col-6 xl:col-3">
        <div
          class="card surface-card cursor-pointer h-full w-full hover:shadow-5 hover:text-orange-500"
        >
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
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
              <i class="pi pi-file-word text-6xl" />
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
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
              <i class="pi pi-file-word text-6xl" />
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

      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 cursor-pointer h-full w-full hover:shadow-5">
          <div class="flex">
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
              <i class="pi pi-file-word text-6xl" />
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
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
              <i class="pi pi-file-word text-6xl" />
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
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
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

      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 cursor-pointer h-full w-full hover:shadow-5">
          <div class="flex">
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
              <i class="pi pi-file-word text-6xl" />
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
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
              <i class="pi pi-file-word text-6xl" />
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
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
              <i class="pi pi-file-word text-6xl" />
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
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
              <i class="pi pi-file-word text-6xl" />
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
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
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

  <!-- <div class="col-12 xl:col-8" v-if="stats?.software?.length > 0">
        <div class="card surface-50" style="height: 35rem">
          <div class="flex justify-content-between align-items-center mb-5">
            <div class="flex justify-content-start gap-2 align-items-center">
              <div class="flex flex-wrap gap-2 align-items-center">
                <i class="pi pi-microsoft text-4xl mr-2" />
                <div>
                  <h5 class="text-color m-0">
                    {{ $t('PC Software') }}
                  </h5>
                  <p class="text-color-secondary">
                    {{ $t('Software count') }} :
                    {{ stats?.software?.length || '-' }}
                  </p>
                </div>
              </div>
            </div>

            <div class="flex justify-content-end">
              <span class="p-input-icon-left p-input-icon-right sm:w-max w-full">
                <i class="pi pi-search" />
                <InputText
                  id="name"
                  class="sm:w-max w-full"
                  :placeholder="$t('Search')"
                  v-model="filters['global'].value"
                />
                <i
                  class="pi pi-times cursor-pointer hover:text-color"
                  v-tooltip.bottom="$t('Clear filter')"
                  @click="filters['global'].value = null"
                />
              </span>
            </div>
          </div>

          <DataTable
            scrollable
            dataKey="id"
            scrollHeight="25rem"
            v-model:filters="filters"
            :value="stats.software || []"
            :globalFilterFields="['name']"
          >
            <Column
              field="name"
              :header="$t('Software name')"
              headerClass="text-xl font-bold uppercase w-9"
              bodyClass="font-bold"
            />
            <Column
              field="count"
              :header="$t('Count')"
              headerClass="text-xl font-bold uppercase"
              bodyClass="font-bold text-base"
            />
          </DataTable>
        </div>
      </div> -->

  <!-- <div class="col-12 xl:col-4">
        <div class="card surface-50" style="height: 35rem">
          <div class="flex justify-content-between align-items-center mb-5">
            <div class="flex justify-content-start gap-2 align-items-center">
              <i class="pi pi-microsoft mr-2" style="font-size: 1.5rem"></i>
              <h5 class="my-0">
                {{ $t('PC SysInspector unwanted software') }}
              </h5>
            </div>
            <Button icon="pi pi-ellipsis-v" class="p-button-text p-button-plain p-button-rounded" />
          </div>

          <ul class="max-h-25rem list-none overflow-auto p-0 m-0">
            <li
              class="flex flex-column md:flex-row md:align-items-center md:justify-content-between mb-4"
              v-for="(item, index) of stats?.unsoftware"
              :key="`unsoftware-${index}`"
            >
              <div>
                <span class="text-900 font-medium mr-2 mb-1 md:mb-0">
                  {{ index + 1 }}. {{ item }}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div> -->
</template>
