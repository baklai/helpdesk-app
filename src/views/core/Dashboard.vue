<script setup>
import { onMounted, ref } from 'vue';

import { useStatistic } from '@/stores/api/statistics';
import { dateToStr, methodHttpToColor } from '@/service/DataFilters';

const Statistic = useStatistic();

const stats = ref({});
const currentDate = ref();
const chartDataActivity = ref();
const chartDataActivityOptions = ref();
const chartDataActivityUsers = ref();
const chartDataActivityUsersOptions = ref();

const setChartDataActivity = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: stats.value.activity.map(({ date }) => dateToStr(date)),
    datasets: [
      {
        label: 'API',
        fill: true,
        borderColor: documentStyle.getPropertyValue('--orange-500'),
        tension: 0.4,
        backgroundColor: 'rgba(255,167,38,0.2)',
        data: stats.value.activity.map(({ count }) => count)
      }
    ]
  };
};

const setChartDataActivityOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.6,
    plugins: {
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      }
    }
  };
};

const setChartDataActivityUsers = () => {
  const documentStyle = getComputedStyle(document.documentElement);

  return {
    labels: stats.value.activityUsers.map(({ user }) => user),
    datasets: [
      {
        type: 'bar',
        label: 'GET',
        backgroundColor: documentStyle.getPropertyValue(methodHttpToColor('GET')),
        data: stats.value.activityUsers.map(({ methods }) =>
          methods.filter(({ method }) => method === 'GET').map(({ count }) => count)
        )
      },
      {
        type: 'bar',
        label: 'POST',
        backgroundColor: documentStyle.getPropertyValue(methodHttpToColor('POST')),
        data: stats.value.activityUsers.map(({ methods }) =>
          methods.filter(({ method }) => method === 'POST').map(({ count }) => count)
        )
      },
      {
        type: 'bar',
        label: 'PUT',
        backgroundColor: documentStyle.getPropertyValue(methodHttpToColor('PUT')),
        data: stats.value.activityUsers.map(({ methods }) =>
          methods.filter(({ method }) => method === 'PUT').map(({ count }) => count)
        )
      },
      {
        type: 'bar',
        label: 'DELETE',
        backgroundColor: documentStyle.getPropertyValue(methodHttpToColor('DELETE')),
        data: stats.value.activityUsers.map(({ methods }) =>
          methods.filter(({ method }) => method === 'DELETE').map(({ count }) => count)
        )
      }
    ]
  };
};

const setChartDataActivityUsersOptions = () => {
  const documentStyle = getComputedStyle(document.documentElement);
  const textColor = documentStyle.getPropertyValue('--text-color');
  const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
  const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

  return {
    maintainAspectRatio: false,
    aspectRatio: 0.8,
    plugins: {
      tooltips: {
        mode: 'index',
        intersect: false
      },
      legend: {
        labels: {
          color: textColor
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      },
      y: {
        stacked: true,
        ticks: {
          color: textColorSecondary
        },
        grid: {
          color: surfaceBorder
        }
      }
    }
  };
};

onMounted(async () => {
  currentDate.value = dateToStr(Date.now());
  stats.value = await Statistic.dashboard();

  chartDataActivity.value = setChartDataActivity();
  chartDataActivityOptions.value = setChartDataActivityOptions();

  chartDataActivityUsers.value = setChartDataActivityUsers();
  chartDataActivityUsersOptions.value = setChartDataActivityUsersOptions();
});
</script>

<template>
  <div className="col-12">
    <div class="flex align-content-center mb-4">
      <div class="flex align-items-center justify-content-center mr-2">
        <AppIcons :name="$route?.name" :size="42" />
      </div>
      <div>
        <h5 class="text-sm text-color-secondary m-0">
          {{ $t($route?.meta?.title) }}
        </h5>
        <h3 class="m-0">{{ $t($route?.meta?.description) }}</h3>
      </div>
    </div>

    <div class="grid align-content-start">
      <div class="col-12 xl:col-6">
        <div class="card surface-50 mb-0">
          <h5>{{ $t('API Activity for the current month') }}</h5>
          <Chart
            type="line"
            :data="chartDataActivity"
            :options="chartDataActivityOptions"
            class="h-30rem"
          />
        </div>
      </div>

      <div class="col-12 xl:col-6">
        <div class="card surface-50 mb-0">
          <h5>{{ $t('User activity for the current month') }}</h5>
          <Chart
            type="bar"
            :data="chartDataActivityUsers"
            :options="chartDataActivityUsersOptions"
            class="h-30rem"
          />
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">{{ $t('Total number of users') }}</span>
              <div class="text-900 font-medium text-xl">
                {{ stats?.users || '-' }}
              </div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-green-100 border-round w-3rem h-3rem p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>account-supervisor-outline</title>
                <path
                  d="M16.5 15.5C18.22 15.5 20.25 16.3 20.5 16.78V17.5H12.5V16.78C12.75 16.3 14.78 15.5 16.5 15.5M16.5 14C14.67 14 11 14.92 11 16.75V19H22V16.75C22 14.92 18.33 14 16.5 14M9 13C6.67 13 2 14.17 2 16.5V19H9V17.5H3.5V16.5C3.5 15.87 6.29 14.34 9.82 14.5A5.12 5.12 0 0 1 11.37 13.25A12.28 12.28 0 0 0 9 13M9 6.5A1.5 1.5 0 1 1 7.5 8A1.5 1.5 0 0 1 9 6.5M9 5A3 3 0 1 0 12 8A3 3 0 0 0 9 5M16.5 8.5A1 1 0 1 1 15.5 9.5A1 1 0 0 1 16.5 8.5M16.5 7A2.5 2.5 0 1 0 19 9.5A2.5 2.5 0 0 0 16.5 7Z"
                />
              </svg>
            </div>
          </div>
          <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
          <span class="text-500">{{ currentDate }}</span>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of requests') }}
              </span>
              <div class="text-900 font-medium text-xl">
                {{ stats?.requests || '-' }}
              </div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-green-100 border-round w-3rem h-3rem p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>book-open-outline</title>
                <path
                  d="M21,4H3A2,2 0 0,0 1,6V19A2,2 0 0,0 3,21H21A2,2 0 0,0 23,19V6A2,2 0 0,0 21,4M3,19V6H11V19H3M21,19H13V6H21V19M14,9.5H20V11H14V9.5M14,12H20V13.5H14V12M14,14.5H20V16H14V14.5Z"
                />
              </svg>
            </div>
          </div>
          <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
          <span class="text-500">{{ currentDate }}</span>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of PC SysInspector reports') }}
              </span>
              <div class="text-900 font-medium text-xl">
                {{ stats?.inspectors || '-' }}
              </div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-green-100 border-round w-3rem h-3rem p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>monitor-dashboard</title>
                <path
                  d="M21,16V4H3V16H21M21,2A2,2 0 0,1 23,4V16A2,2 0 0,1 21,18H14V20H16V22H8V20H10V18H3C1.89,18 1,17.1 1,16V4C1,2.89 1.89,2 3,2H21M5,6H14V11H5V6M15,6H19V8H15V6M19,9V14H15V9H19M5,12H9V14H5V12M10,12H14V14H10V12Z"
                />
              </svg>
            </div>
          </div>
          <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
          <span class="text-500">{{ currentDate }}</span>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of IP Addresses') }}
              </span>
              <div class="text-900 font-medium text-xl">
                {{ stats?.ipaddress || '-' }}
              </div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-green-100 border-round w-3rem h-3rem p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>ip-network-outline</title>
                <path
                  d="M15,20A1,1 0 0,0 14,19H13V17H17A2,2 0 0,0 19,15V5A2,2 0 0,0 17,3H7A2,2 0 0,0 5,5V15A2,2 0 0,0 7,17H11V19H10A1,1 0 0,0 9,20H2V22H9A1,1 0 0,0 10,23H14A1,1 0 0,0 15,22H22V20H15M7,15V5H17V15H7M10,6H8V14H10V6M14,6H11V14H13V12H14A2,2 0 0,0 16,10V8A2,2 0 0,0 14,6M14,10H13V8H14V10Z"
                />
              </svg>
            </div>
          </div>
          <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
          <span class="text-500">{{ currentDate }}</span>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of channels') }}
              </span>
              <div class="text-900 font-medium text-xl">
                {{ stats?.channels || '-' }}
              </div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-blue-100 border-round w-3rem h-3rem p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>swap-horizontal</title>
                <path d="M21,9L17,5V8H10V10H17V13M7,11L3,15L7,19V16H14V14H7V11Z" />
              </svg>
            </div>
          </div>
          <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
          <span class="text-500">{{ currentDate }}</span>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of units') }}
              </span>
              <div class="text-900 font-medium text-xl">
                {{ stats?.units || '-' }}
              </div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-blue-100 border-round w-3rem h-3rem p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>expansion-card-variant</title>
                <path
                  d="M2 7H4.5V17H3V8.5H2M22 7V16H14V17H7V16H6V7M10 9H8V12H10M13 9H11V12H13M20 9H15V14H20V9Z"
                />
              </svg>
            </div>
          </div>
          <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
          <span class="text-500">{{ currentDate }}</span>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of positions') }}
              </span>
              <div class="text-900 font-medium text-xl">
                {{ stats?.positions || '-' }}
              </div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-blue-100 border-round w-3rem h-3rem p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>briefcase-account-outline</title>
                <path
                  d="M20,6C20.58,6 21.05,6.2 21.42,6.59C21.8,7 22,7.45 22,8V19C22,19.55 21.8,20 21.42,20.41C21.05,20.8 20.58,21 20,21H4C3.42,21 2.95,20.8 2.58,20.41C2.2,20 2,19.55 2,19V8C2,7.45 2.2,7 2.58,6.59C2.95,6.2 3.42,6 4,6H8V4C8,3.42 8.2,2.95 8.58,2.58C8.95,2.2 9.42,2 10,2H14C14.58,2 15.05,2.2 15.42,2.58C15.8,2.95 16,3.42 16,4V6H20M4,8V19H20V8H4M14,6V4H10V6H14M12,9A2.25,2.25 0 0,1 14.25,11.25C14.25,12.5 13.24,13.5 12,13.5A2.25,2.25 0 0,1 9.75,11.25C9.75,10 10.76,9 12,9M16.5,18H7.5V16.88C7.5,15.63 9.5,14.63 12,14.63C14.5,14.63 16.5,15.63 16.5,16.88V18Z"
                />
              </svg>
            </div>
          </div>
          <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
          <span class="text-500">{{ currentDate }}</span>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of locations') }}
              </span>
              <div class="text-900 font-medium text-xl">
                {{ stats?.locations || '-' }}
              </div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-blue-100 border-round w-3rem h-3rem p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>map-marker-outline</title>
                <path
                  d="M12,6.5A2.5,2.5 0 0,1 14.5,9A2.5,2.5 0 0,1 12,11.5A2.5,2.5 0 0,1 9.5,9A2.5,2.5 0 0,1 12,6.5M12,2A7,7 0 0,1 19,9C19,14.25 12,22 12,22C12,22 5,14.25 5,9A7,7 0 0,1 12,2M12,4A5,5 0 0,0 7,9C7,10 7,12 12,18.71C17,12 17,10 17,9A5,5 0 0,0 12,4Z"
                />
              </svg>
            </div>
          </div>
          <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
          <span class="text-500">{{ currentDate }}</span>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of companies') }}
              </span>
              <div class="text-900 font-medium text-xl">
                {{ stats?.companies || '-' }}
              </div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-blue-100 border-round w-3rem h-3rem p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>office-building-outline</title>
                <path
                  d="M19 3V21H13V17.5H11V21H5V3H19M15 7H17V5H15V7M11 7H13V5H11V7M7 7H9V5H7V7M15 11H17V9H15V11M11 11H13V9H11V11M7 11H9V9H7V11M15 15H17V13H15V15M11 15H13V13H11V15M7 15H9V13H7V15M15 19H17V17H15V19M7 19H9V17H7V19M21 1H3V23H21V1Z"
                />
              </svg>
            </div>
          </div>
          <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
          <span class="text-500">{{ currentDate }}</span>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of branches') }}
              </span>
              <div class="text-900 font-medium text-xl">
                {{ stats?.branches || '-' }}
              </div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-blue-100 border-round w-3rem h-3rem p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>office-building-outline</title>
                <path
                  d="M19 3V21H13V17.5H11V21H5V3H19M15 7H17V5H15V7M11 7H13V5H11V7M7 7H9V5H7V7M15 11H17V9H15V11M11 11H13V9H11V11M7 11H9V9H7V11M15 15H17V13H15V15M11 15H13V13H11V15M7 15H9V13H7V15M15 19H17V17H15V19M7 19H9V17H7V19M21 1H3V23H21V1Z"
                />
              </svg>
            </div>
          </div>
          <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
          <span class="text-500">{{ currentDate }}</span>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of enterprises') }}
              </span>
              <div class="text-900 font-medium text-xl">
                {{ stats?.enterprises || '-' }}
              </div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-blue-100 border-round w-3rem h-3rem p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>office-building-outline</title>
                <path
                  d="M19 3V21H13V17.5H11V21H5V3H19M15 7H17V5H15V7M11 7H13V5H11V7M7 7H9V5H7V7M15 11H17V9H15V11M11 11H13V9H11V11M7 11H9V9H7V11M15 15H17V13H15V15M11 15H13V13H11V15M7 15H9V13H7V15M15 19H17V17H15V19M7 19H9V17H7V19M21 1H3V23H21V1Z"
                />
              </svg>
            </div>
          </div>
          <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
          <span class="text-500">{{ currentDate }}</span>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div class="card surface-50 mb-0">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of departments') }}
              </span>
              <div class="text-900 font-medium text-xl">
                {{ stats?.departments || '-' }}
              </div>
            </div>
            <div
              class="flex align-items-center justify-content-center bg-blue-100 border-round w-3rem h-3rem p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <title>office-building-outline</title>
                <path
                  d="M19 3V21H13V17.5H11V21H5V3H19M15 7H17V5H15V7M11 7H13V5H11V7M7 7H9V5H7V7M15 11H17V9H15V11M11 11H13V9H11V11M7 11H9V9H7V11M15 15H17V13H15V15M11 15H13V13H11V15M7 15H9V13H7V15M15 19H17V17H15V19M7 19H9V17H7V19M21 1H3V23H21V1Z"
                />
              </svg>
            </div>
          </div>
          <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
          <span class="text-500">{{ currentDate }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
