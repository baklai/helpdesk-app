<script setup>
import { useI18n } from 'vue-i18n';

import { dateToStr } from '@/service/DataFilters';
import { useReport } from '@/stores/api/reports';

const { t } = useI18n();

const { getReport } = useReport();

const convertToCSV = data => {
  const [first] = data;
  const headerI18n = Object.keys(first).map(item => t(item));
  const header = headerI18n.join(';');
  const rows = data.map(obj => Object.values(obj).join(';'));
  return `${header}\n${rows.join('\n')}`;
};

const generateReportToCSV = async (path, filename = `report-at-${dateToStr(new Date())}`) => {
  const data = await getReport(path);
  const csvData = convertToCSV(data);
  const blobDate = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = window.URL.createObjectURL(blobDate);
  a.download = filename + '.csv';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
</script>

<template>
  <div className="flex-shrink-0 p-4 w-full">
    <div class="flex content-center mb-6">
      <div class="flex items-center justify-center mr-2">
        <AppIcons :name="$route?.name" :size="42" />
      </div>
      <div>
        <h3 class="my-auto">
          {{ $t($route?.meta?.title) }}
        </h3>
        <h5 class="text-sm text-surface-500 my-auto">
          {{ $t($route?.meta?.description) }}
        </h5>
      </div>
    </div>

    <div class="flex flex-wrap content-start">
      <div class="flex-shrink-0 p-4 w-full lg:w-2/4 xl:w-1/4">
        <div
          class="cursor-pointer h-full w-full hover:shadow-5 hover:text-green-500"
          @click="() => $helpdesk.notImplemented()"
        >
          <div class="flex flex-col items-center justify-center">
            <div class="rounded p-2">
              <i class="pi pi-plus-circle text-6xl" />
            </div>
            <p>{{ $t('Create report template') }}</p>
          </div>
        </div>
      </div>

      <div class="flex-shrink-0 p-4 w-full lg:w-2/4 xl:w-1/4">
        <div
          class="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-6 cursor-pointer h-full w-full hover:shadow-5 hover:text-green-500"
          @click="generateReportToCSV('internet-access', 'helpdesk-report-internet-access')"
        >
          <div class="flex">
            <div class="flex items-center justify-center rounded w-12 h-12 mr-4">
              <i class="pi pi-file-excel text-6xl" />
            </div>
            <div>
              <p class="font-medium text-xl mb-2">
                {{ $t('List of users with internet access') }}
              </p>
              <span class="block font-medium">
                {{ $t('Network IP Address of the technical support') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-shrink-0 p-4 w-full lg:w-2/4 xl:w-1/4">
        <div
          class="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-6 cursor-pointer h-full w-full hover:shadow-5 hover:text-green-500"
          @click="generateReportToCSV('users-email', 'helpdesk-report-users-email')"
        >
          <div class="flex">
            <div class="flex items-center justify-center rounded w-12 h-12 mr-4">
              <i class="pi pi-file-excel text-6xl" />
            </div>
            <div>
              <p class="font-medium text-xl mb-2">
                {{ $t('List of users with email') }}
              </p>
              <span class="block font-medium">
                {{ $t('Mailbox of the technical support') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="flex-shrink-0 p-4 w-full lg:w-2/4 xl:w-1/4">
        <div
          class="bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-300 dark:border-surface-600 p-6 cursor-pointer h-full w-full hover:shadow-5 hover:text-green-500"
          @click="generateReportToCSV('unwanted-software', 'helpdesk-report-unwanted-software')"
        >
          <div class="flex">
            <div class="flex items-center justify-center rounded w-12 h-12 mr-4">
              <i class="pi pi-file-excel text-6xl" />
            </div>
            <div>
              <p class="font-medium text-xl mb-2">
                {{ $t('List of unwanted software') }}
              </p>
              <span class="block font-medium">
                {{ $t('PC SysInspector service of the technical support') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
div[disabled] {
  opacity: 0.1;
  pointer-events: none;
}
</style>
