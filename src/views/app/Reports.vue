<script setup>
import { dateToStr } from '@/service/DataFilters';
import { useReport } from '@/stores/api/reports';

const { getReport } = useReport();

const convertToCSV = data => {
  const header = Object.keys(data[0]).join(';');
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
          class="card surface-card cursor-pointer h-full w-full hover:shadow-5 hover:text-green-500"
          @click="
            $toast.add({
              severity: 'info',
              summary: $t('HD Information'),
              detail: $t('This functionality has not yet been implemented'),
              life: 3000
            })
          "
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
        <div
          class="card surface-50 cursor-pointer h-full w-full hover:shadow-5 hover:text-green-500"
          @click="generateReportToCSV('internet-access', 'helpdesk-report-internet-access')"
        >
          <div class="flex">
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
              <i class="pi pi-file-excel text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('List of users with internet access') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('Network IP Address of the technical support') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3">
        <div
          class="card surface-50 cursor-pointer h-full w-full hover:shadow-5 hover:text-green-500"
          @click="generateReportToCSV('users-email', 'helpdesk-report-users-email')"
        >
          <div class="flex">
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
              <i class="pi pi-file-word text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('List of users with email') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('Mailbox of the technical support') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3" disabled>
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

      <div class="col-12 lg:col-6 xl:col-3" disabled>
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

      <div class="col-12 lg:col-6 xl:col-3" disabled>
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

      <div class="col-12 lg:col-6 xl:col-3" disabled>
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

      <div class="col-12 lg:col-6 xl:col-3" disabled>
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

      <div class="col-12 lg:col-6 xl:col-3" disabled>
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
        <div
          class="card surface-50 cursor-pointer h-full w-full hover:shadow-5 hover:text-green-500"
          @click="generateReportToCSV('unwanted-software', 'helpdesk-report-unwanted-software')"
        >
          <div class="flex">
            <div
              class="flex align-items-center justify-content-center border-round w-3rem h-3rem mr-4"
            >
              <i class="pi pi-file-excel text-6xl" />
            </div>
            <div>
              <p class="text-900 font-medium text-xl mb-2">
                {{ $t('PC SysInspector service of the technical support') }}
              </p>
              <span class="block text-500 font-medium">
                {{ $t('PC SysInspector service') }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="col-12 lg:col-6 xl:col-3" disabled>
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
</template>

<style scoped>
div[disabled] {
  opacity: 0.1;
  pointer-events: none;
}
</style>
