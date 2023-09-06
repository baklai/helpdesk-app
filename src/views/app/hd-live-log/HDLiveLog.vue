<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { useStatistic } from '@/stores/api/statistics';
import { MONTHS_OF_YEAR, DAYS_OF_WEEK } from '@/service/Constants';
import { dateToStr } from '@/service/DataFilters';

const Statistic = useStatistic();

const { t } = useI18n();
const stats = ref({});

const yearChartData = ref();
const monthChartData = ref();
const weekChartData = ref();
const currentDate = ref(Date.now());
const chartOptions = ref({
  plugins: {
    legend: {
      display: false
    }
  }
});

onMounted(async () => {
  stats.value = await Statistic.request();
  yearChartData.value = {
    labels: MONTHS_OF_YEAR.map(month => t(month.label)),
    datasets: [
      {
        label: t('Count of requests'),
        data: MONTHS_OF_YEAR.map(
          month => stats.value.yearchar.find(item => item.month === month.key)?.count || 0
        )
      }
    ]
  };

  monthChartData.value = {
    labels: stats.value.monthchar.map(item => item.date),
    datasets: [
      {
        label: t('Count of requests'),
        data: stats.value.monthchar.map(item => item.count)
      }
    ]
  };

  weekChartData.value = {
    labels: DAYS_OF_WEEK.map(week => t(week.label)),
    datasets: [
      {
        label: t('Count of requests'),
        data: DAYS_OF_WEEK.map(
          day => stats.value.weekchar.find(item => item.day - 1 === day.key)?.count || 0
        )
      }
    ]
  };
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

    <div class="grid align-content-start" style="height: calc(100vh - 9rem)">
      <div class="col-12 lg:col-8 xl:col-9">
        <div class="grid">
          <div class="col-12 lg:col-6 xl:col-4">
            <div class="card surface-50 mb-4">
              <div class="flex justify-content-between mb-3">
                <div>
                  <span class="block text-500 font-medium mb-3">
                    {{ $t('Total number of requests') }}
                  </span>
                  <div class="text-900 font-medium text-xl">{{ stats?.requests || '-' }}</div>
                </div>
                <div
                  class="flex align-items-center justify-content-center bg-blue-100 border-round w-3rem h-3rem p-2"
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
              <span class="text-500">{{ dateToStr(currentDate) || '-' }}</span>
            </div>
            <div class="card surface-50 mb-4">
              <div class="flex justify-content-between mb-3">
                <div>
                  <span class="block text-500 font-medium mb-3">
                    {{ $t('Total number of closed requests') }}
                  </span>
                  <div class="text-900 font-medium text-xl">{{ stats?.closed || '-' }}</div>
                </div>
                <div
                  class="flex align-items-center justify-content-center bg-green-500 border-round w-3rem h-3rem p-2"
                >
                  <i class="pi pi-check-circle text-white text-2xl"></i>
                </div>
              </div>
              <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
              <span class="text-500">{{ dateToStr(currentDate) || '-' }}</span>
            </div>
            <div class="card surface-50 mb-4">
              <div class="flex justify-content-between mb-3">
                <div>
                  <span class="block text-500 font-medium mb-3">
                    {{ $t('Total number of opened requests') }}
                  </span>
                  <div class="text-900 font-medium text-xl">{{ stats?.opened || '-' }}</div>
                </div>
                <div
                  class="flex align-items-center justify-content-center bg-orange-500 border-round w-3rem h-3rem p-2"
                >
                  <i class="pi pi-info-circle text-white text-2xl"></i>
                </div>
              </div>
              <span class="text-green-500 font-medium mr-2">{{ $t('Actual on') }}</span>
              <span class="text-500">{{ dateToStr(currentDate) || '-' }}</span>
            </div>
          </div>

          <div class="col-12 lg:col-6 xl:col-8">
            <div class="card surface-50">
              <div class="flex justify-content-start gap-2 align-items-center mb-6">
                <i class="pi pi-chart-bar text-2xl mr-2"></i>
                <h5 class="my-0">{{ $t('Requests by current week') }}</h5>
              </div>
              <Chart type="bar" :data="weekChartData" :options="chartOptions" class="w-full" />
            </div>
          </div>

          <div class="col-12">
            <div class="card surface-50">
              <div class="flex justify-content-start gap-2 align-items-center mb-6">
                <i class="pi pi-chart-bar text-2xl mr-2"></i>
                <h5 class="my-0">{{ $t('Requests by current month') }}</h5>
              </div>
              <Chart type="bar" :data="monthChartData" :options="chartOptions" class="w-full" />
            </div>
          </div>
          <div class="col-12">
            <div class="card surface-50">
              <div class="flex justify-content-start gap-2 align-items-center mb-6">
                <i class="pi pi-chart-bar text-2xl mr-2"></i>
                <h5 class="my-0">{{ $t('Requests by current year') }}</h5>
              </div>
              <Chart type="bar" :data="yearChartData" :options="chartOptions" class="w-full" />
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-4 xl:col-3">
        <div class="card surface-50 mb-4">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of companies') }}
              </span>
              <div class="text-900 font-medium text-xl">{{ stats?.companies || '-' }}</div>
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
          <span class="text-500">{{ dateToStr(currentDate) || '-' }}</span>
        </div>

        <div class="card surface-50 mb-4">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of branches') }}
              </span>
              <div class="text-900 font-medium text-xl">{{ stats?.branches || '-' }}</div>
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
          <span class="text-500">{{ dateToStr(currentDate) || '-' }}</span>
        </div>

        <div class="card surface-50 mb-4">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of enterprises') }}
              </span>
              <div class="text-900 font-medium text-xl">{{ stats?.enterprises || '-' }}</div>
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
          <span class="text-500">{{ dateToStr(currentDate) || '-' }}</span>
        </div>

        <div class="card surface-50 mb-4">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of departments') }}
              </span>
              <div class="text-900 font-medium text-xl">{{ stats?.departments || '-' }}</div>
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
          <span class="text-500">{{ dateToStr(currentDate) || '-' }}</span>
        </div>

        <div class="card surface-50 mb-4">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of locations') }}
              </span>
              <div class="text-900 font-medium text-xl">{{ stats?.locations || '-' }}</div>
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
          <span class="text-500">{{ dateToStr(currentDate) || '-' }}</span>
        </div>

        <div class="card surface-50 mb-4">
          <div class="flex justify-content-between mb-3">
            <div>
              <span class="block text-500 font-medium mb-3">
                {{ $t('Total number of positions') }}
              </span>
              <div class="text-900 font-medium text-xl">{{ stats?.positions || '-' }}</div>
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
          <span class="text-500">{{ dateToStr(currentDate) || '-' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
