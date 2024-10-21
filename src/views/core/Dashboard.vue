<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';

const Chart = defineAsyncComponent(() => import('primevue/chart'));

import { useStatistic } from '@/stores/api/statistics';
import { dateToStr } from '@/service/DataFilters';

const Statistic = useStatistic();

const stats = ref({});
const currentDate = ref();
const chartDataActivity = ref();
const chartDataActivityOptions = ref({
  plugins: {
    legend: {
      display: false
    }
  }
});
const chartDataActivityProfiles = ref();
const chartDataActivityProfilesOptions = ref({
  maintainAspectRatio: false,
  aspectRatio: 0.8,
  scales: {
    x: {
      stacked: true
    },
    y: {
      stacked: true
    }
  }
});

const setChartDataActivity = () => {
  return {
    labels: stats.value.activity.map(({ date }) => dateToStr(date)),
    datasets: [
      {
        label: 'API',
        fill: true,
        tension: 0.4,
        color: '#666',
        borderColor: 'rgb(34,197,94,0.5)',
        backgroundColor: 'rgba(34,197,94,0.2)',
        data: stats.value.activity.map(({ count }) => count)
      }
    ]
  };
};

const setChartDataActivityProfiles = () => {
  return {
    labels: stats.value.activityProfiles.map(({ profile }) => profile),
    datasets: [
      {
        type: 'bar',
        label: 'GET',
        fill: true,
        tension: 0.4,
        color: '#666',
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgb(59, 130, 246, 0.5)',
        data: stats.value.activityProfiles.map(({ methods }) =>
          methods.filter(({ method }) => method === 'GET').map(({ count }) => count)
        )
      },
      {
        type: 'bar',
        label: 'POST',
        fill: true,
        tension: 0.4,
        color: '#666',
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgb(34, 197, 94, 0.5)',
        data: stats.value.activityProfiles.map(({ methods }) =>
          methods.filter(({ method }) => method === 'POST').map(({ count }) => count)
        )
      },
      {
        type: 'bar',
        label: 'PUT',
        fill: true,
        tension: 0.4,
        color: '#666',
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgb(249, 115, 22, 0.5)',
        data: stats.value.activityProfiles.map(({ methods }) =>
          methods.filter(({ method }) => method === 'PUT').map(({ count }) => count)
        )
      },
      {
        type: 'bar',
        label: 'DELETE',
        fill: true,
        tension: 0.4,
        color: '#666',
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgb(239, 68, 68, 0.5)',
        data: stats.value.activityProfiles.map(({ methods }) =>
          methods.filter(({ method }) => method === 'DELETE').map(({ count }) => count)
        )
      }
    ]
  };
};

onMounted(async () => {
  currentDate.value = dateToStr(Date.now());
  stats.value = await Statistic.dashboard();

  chartDataActivity.value = setChartDataActivity();
  chartDataActivityProfiles.value = setChartDataActivityProfiles();
});
</script>

<template>
  <div class="h-full w-full">
    <div class="mb-6 flex content-center">
      <div class="mr-2 flex items-center justify-center">
        <AppIcons :name="$route?.name" :size="42" />
      </div>
      <div>
        <h3 class="text-2xl">
          {{ $route?.meta?.title }}
        </h3>
        <p class="text-base text-surface-500">
          {{ $route?.meta?.description }}
        </p>
      </div>
    </div>

    <div class="flex flex-wrap content-start">
      <div class="w-full p-4 xl:w-2/4">
        <div
          class="mb-0 rounded-lg border border-surface-300 bg-surface-50 p-6 dark:border-surface-600 dark:bg-surface-800"
        >
          <h5 class="text-center text-xl font-bold">Активність API за поточний місяць</h5>
          <Chart
            type="line"
            :data="chartDataActivity"
            :options="chartDataActivityOptions"
            class="h-[30rem]"
          />
        </div>
      </div>

      <div class="w-full p-4 xl:w-2/4">
        <div
          class="mb-0 rounded-lg border border-surface-300 bg-surface-50 p-6 dark:border-surface-600 dark:bg-surface-800"
        >
          <h5 class="text-center text-xl font-bold">Активність профілю за поточний тиждень</h5>
          <Chart
            type="bar"
            :data="chartDataActivityProfiles"
            :options="chartDataActivityProfilesOptions"
            class="h-[30rem]"
          />
        </div>
      </div>

      <div class="w-full flex-shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <div
          class="mb-0 rounded-lg border border-surface-300 bg-surface-50 p-6 dark:border-surface-600 dark:bg-surface-800"
        >
          <div class="mb-3 flex justify-between">
            <div>
              <span class="mb-3 block font-bold">Загальна кількість профілів</span>
              <div class="text-xl font-bold text-primary-500">
                {{ stats?.profiles || '-' }}
              </div>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded bg-green-100 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>account-supervisor-outline</title>
                <path
                  d="M16.5 15.5C18.22 15.5 20.25 16.3 20.5 16.78V17.5H12.5V16.78C12.75 16.3 14.78 15.5 16.5 15.5M16.5 14C14.67 14 11 14.92 11 16.75V19H22V16.75C22 14.92 18.33 14 16.5 14M9 13C6.67 13 2 14.17 2 16.5V19H9V17.5H3.5V16.5C3.5 15.87 6.29 14.34 9.82 14.5A5.12 5.12 0 0 1 11.37 13.25A12.28 12.28 0 0 0 9 13M9 6.5A1.5 1.5 0 1 1 7.5 8A1.5 1.5 0 0 1 9 6.5M9 5A3 3 0 1 0 12 8A3 3 0 0 0 9 5M16.5 8.5A1 1 0 1 1 15.5 9.5A1 1 0 0 1 16.5 8.5M16.5 7A2.5 2.5 0 1 0 19 9.5A2.5 2.5 0 0 0 16.5 7Z"
                />
              </svg>
            </div>
          </div>
          <span class="mr-2 font-medium text-green-500">Актуально на</span>
          <span class="">{{ currentDate }}</span>
        </div>
      </div>

      <div class="w-full flex-shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <div
          class="mb-0 rounded-lg border border-surface-300 bg-surface-50 p-6 dark:border-surface-600 dark:bg-surface-800"
        >
          <div class="mb-3 flex justify-between">
            <div>
              <span class="mb-3 block font-bold"> Загальна кількість запитів </span>
              <div class="text-xl font-bold text-primary-500">
                {{ stats?.requests || '-' }}
              </div>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded bg-green-100 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>book-open-outline</title>
                <path
                  d="M21,4H3A2,2 0 0,0 1,6V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V6A2,2 0 0,0 21,4M3,19V6H11V19H3M21,19H13V6H21V19M14,9.5H20V11H14V9.5M14,12H20V13.5H14V12M14,14.5H20V16H14V14.5Z"
                />
              </svg>
            </div>
          </div>
          <span class="mr-2 font-medium text-green-500">Актуально на</span>
          <span class="">{{ currentDate }}</span>
        </div>
      </div>

      <div class="w-full flex-shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <div
          class="mb-0 rounded-lg border border-surface-300 bg-surface-50 p-6 dark:border-surface-600 dark:bg-surface-800"
        >
          <div class="mb-3 flex justify-between">
            <div>
              <span class="mb-3 block font-bold"> Загальна кількість звітів ПК SysInspector </span>
              <div class="text-xl font-bold text-primary-500">
                {{ stats?.inspectors || '-' }}
              </div>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded bg-green-100 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>monitor-dashboard</title>
                <path
                  d="M21,16V4H3V16H21M21,2A2,2 0 0,1 23,4V16A2,2 0 0,1 21,18H14V20H16V22H8V20H10V18H3C1.89,18 1,17.1 1,16V4C1,2.89 1.89,2 3,2H21M5,6H14V11H5V6M15,6H19V8H15V6M19,9V14H15V9H19M5,12H9V14H5V12M10,12H14V14H10V12Z"
                />
              </svg>
            </div>
          </div>
          <span class="mr-2 font-medium text-green-500">Актуально на</span>
          <span class="">{{ currentDate }}</span>
        </div>
      </div>

      <div class="w-full flex-shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <div
          class="mb-0 rounded-lg border border-surface-300 bg-surface-50 p-6 dark:border-surface-600 dark:bg-surface-800"
        >
          <div class="mb-3 flex justify-between">
            <div>
              <span class="mb-3 block font-bold"> Загальна кількість IP-адрес </span>
              <div class="text-xl font-bold text-primary-500">
                {{ stats?.ipaddress || '-' }}
              </div>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded bg-green-100 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>ip-network-outline</title>
                <path
                  d="M15,20A1,1 0 0,0 14,19H13V17H17A2,2 0 0,0 19,15V5A2,2 0 0,0 17,3H7A2,2 0 0,0 5,5V15A2,2 0 0,0 7,17H11V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H22V20H15M7,15V5H17V15H7M10,6H8V14H10V6M14,6H11V14H13V12H14A2,2 0 0,0 16,10V8A2,2 0 0,0 14,6M14,10H13V8H14V10Z"
                />
              </svg>
            </div>
          </div>
          <span class="mr-2 font-medium text-green-500">Актуально на</span>
          <span class="">{{ currentDate }}</span>
        </div>
      </div>

      <div class="w-full flex-shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <div
          class="mb-0 rounded-lg border border-surface-300 bg-surface-50 p-6 dark:border-surface-600 dark:bg-surface-800"
        >
          <div class="mb-3 flex justify-between">
            <div>
              <span class="mb-3 block font-bold"> Загальна кількість каналів </span>
              <div class="text-xl font-bold text-primary-500">
                {{ stats?.channels || '-' }}
              </div>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded bg-blue-100 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>swap-horizontal</title>
                <path d="M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z" />
              </svg>
            </div>
          </div>
          <span class="mr-2 font-medium text-green-500">Актуально на</span>
          <span class="">{{ currentDate }}</span>
        </div>
      </div>

      <div class="w-full flex-shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <div
          class="mb-0 rounded-lg border border-surface-300 bg-surface-50 p-6 dark:border-surface-600 dark:bg-surface-800"
        >
          <div class="mb-3 flex justify-between">
            <div>
              <span class="mb-3 block font-bold"> Загальна кількість пристроїв </span>
              <div class="text-xl font-bold text-primary-500">
                {{ stats?.units || '-' }}
              </div>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded bg-blue-100 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>expansion-card-variant</title>
                <path
                  d="M2 7H4.5V17H3V8.5H2M22 7V16H14V17H7V16H6V7M10 9H8V12H10M13 9H11V12H13M20 9H15V14H20V9Z"
                />
              </svg>
            </div>
          </div>
          <span class="mr-2 font-medium text-green-500">Актуально на</span>
          <span class="">{{ currentDate }}</span>
        </div>
      </div>

      <div class="w-full flex-shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <div
          class="mb-0 rounded-lg border border-surface-300 bg-surface-50 p-6 dark:border-surface-600 dark:bg-surface-800"
        >
          <div class="mb-3 flex justify-between">
            <div>
              <span class="mb-3 block font-bold"> Загальна кількість посад </span>
              <div class="text-xl font-bold text-primary-500">
                {{ stats?.positions || '-' }}
              </div>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded bg-blue-100 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>briefcase-account-outline</title>
                <path
                  d="M20,6C20.58,6 21.05,6.2 21.42,6.59C21.8,7 22,7.45 22,8V19C22,19.55 21.8,20 21.42,20.41C21.05,20.8 20.58,21 20,21H4C3.42,21 2.95,20.8 2.58,20.41C2.2,20 2,19.55 2,19V8C2,7.45 2.2,7 2.58,6.59C2.95,6.2 3.42,6 4,6H8V4C8,3.42 8.2,2.95 8.58,2.58C8.95,2.2 9.42,2 10,2H14C14.58,2 15.05,2.2 15.42,2.58C15.8,2.95 16,3.42 16,4V6H20M4,8V19H20V8H4M14,6V4H10V6H14M12,9A2.25,2.25 0 0,1 14.25,11.25C14.25,12.5 13.24,13.5 12,13.5A2.25,2.25 0 0,1 9.75,11.25C9.75,10 10.76,9 12,9M16.5,18H7.5V16.88C7.5,15.63 9.5,14.63 12,14.63C14.5,14.63 16.5,15.63 16.5,16.88V18Z"
                />
              </svg>
            </div>
          </div>
          <span class="mr-2 font-medium text-green-500">Актуально на</span>
          <span class="">{{ currentDate }}</span>
        </div>
      </div>

      <div class="w-full flex-shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <div
          class="mb-0 rounded-lg border border-surface-300 bg-surface-50 p-6 dark:border-surface-600 dark:bg-surface-800"
        >
          <div class="mb-3 flex justify-between">
            <div>
              <span class="mb-3 block font-bold"> Загальна кількість розташувань </span>
              <div class="text-xl font-bold text-primary-500">
                {{ stats?.locations || '-' }}
              </div>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded bg-blue-100 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>map-marker-outline</title>
                <path
                  d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z"
                />
              </svg>
            </div>
          </div>
          <span class="mr-2 font-medium text-green-500">Актуально на</span>
          <span class="">{{ currentDate }}</span>
        </div>
      </div>

      <div class="w-full flex-shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <div
          class="mb-0 rounded-lg border border-surface-300 bg-surface-50 p-6 dark:border-surface-600 dark:bg-surface-800"
        >
          <div class="mb-3 flex justify-between">
            <div>
              <span class="mb-3 block font-bold"> Загальна кількість організацій </span>
              <div class="text-xl font-bold text-primary-500">
                {{ stats?.organizations || '-' }}
              </div>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded bg-blue-100 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>office-building-outline</title>
                <path
                  d="M19 3V21H13V17.5H11V21H5V3H19M15 7H17V5H15V7M11 7H13V5H11V7M7 7H9V5H7V7M15 11H17V9H15V11M11 11H13V9H11V11M7 11H9V9H7V11M15 15H17V13H15V15M11 15H13V13H11V15M7 15H9V13H7V15M15 19H17V17H15V19M7 19H9V17H7V19M21 1H3V23H21V1Z"
                />
              </svg>
            </div>
          </div>
          <span class="mr-2 font-medium text-green-500">Актуально на</span>
          <span class="">{{ currentDate }}</span>
        </div>
      </div>

      <div class="w-full flex-shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <div
          class="mb-0 rounded-lg border border-surface-300 bg-surface-50 p-6 dark:border-surface-600 dark:bg-surface-800"
        >
          <div class="mb-3 flex justify-between">
            <div>
              <span class="mb-3 block font-bold"> Загальна кількість підрозділів </span>
              <div class="text-xl font-bold text-primary-500">
                {{ stats?.subdivisions || '-' }}
              </div>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded bg-blue-100 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>office-building-outline</title>
                <path
                  d="M19 3V21H13V17.5H11V21H5V3H19M15 7H17V5H15V7M11 7H13V5H11V7M7 7H9V5H7V7M15 11H17V9H15V11M11 11H13V9H11V11M7 11H9V9H7V11M15 15H17V13H15V15M11 15H13V13H11V15M7 15H9V13H7V15M15 19H17V17H15V19M7 19H9V17H7V19M21 1H3V23H21V1Z"
                />
              </svg>
            </div>
          </div>
          <span class="mr-2 font-medium text-green-500">Актуально на</span>
          <span class="">{{ currentDate }}</span>
        </div>
      </div>

      <div class="w-full flex-shrink-0 p-4 lg:w-2/4 xl:w-1/4">
        <div
          class="mb-0 rounded-lg border border-surface-300 bg-surface-50 p-6 dark:border-surface-600 dark:bg-surface-800"
        >
          <div class="mb-3 flex justify-between">
            <div>
              <span class="mb-3 block font-bold"> Загальна кількість відділів </span>
              <div class="text-xl font-bold text-primary-500">
                {{ stats?.departments || '-' }}
              </div>
            </div>
            <div class="flex h-12 w-12 items-center justify-center rounded bg-blue-100 p-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>office-building-outline</title>
                <path
                  d="M19 3V21H13V17.5H11V21H5V3H19M15 7H17V5H15V7M11 7H13V5H11V7M7 7H9V5H7V7M15 11H17V9H15V11M11 11H13V9H11V11M7 11H9V9H7V11M15 15H17V13H15V15M11 15H13V13H11V15M7 15H9V13H7V15M15 19H17V17H15V19M7 19H9V17H7V19M21 1H3V23H21V1Z"
                />
              </svg>
            </div>
          </div>
          <span class="mr-2 font-medium text-green-500">Актуально на</span>
          <span class="">{{ currentDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
