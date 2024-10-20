<script setup>
import { ref, onMounted, defineAsyncComponent } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import ProgressBar from 'primevue/progressbar';

// import ModalRecord from '@/components/modals/Report.vue';

const ModalRecord = defineAsyncComponent(() => import('@/components/modals/Report.vue'));

import { dateToStr } from '@/service/DataFilters';
import { useReport } from '@/stores/api/reports';

const toast = useToast();
const confirm = useConfirm();

const { findAll, removeOne, generateReport } = useReport();

const report = ref(null);
const reports = ref([]);
const loading = ref(false);
const refModal = ref(null);

const refMenu = ref();
const options = ref([
  {
    label: 'Створити звіт',
    icon: 'pi pi-plus-circle',
    command: async () => refModal.value.toggle({})
  },
  {
    label: 'Експортувати звіт',
    icon: 'pi pi-file-export',
    command: async () => await reportToCSV(report.value)
  },
  {
    label: 'Оновити звіт',
    icon: 'pi pi-file-edit',
    command: async () => refModal.value.toggle(report.value)
  },
  {
    label: 'Видалити звіт',
    icon: 'pi pi-trash',
    command: async () => confirmDelete(report.value)
  }
]);

const onMenuClick = (event, value) => {
  report.value = value;
  refMenu.value.toggle(event);
};

const onCloseModal = async () => {
  report.value = null;
  reports.value = await findAll({});
};

const confirmDelete = ({ id }) => {
  confirm.require({
    message: 'Ви бажаєте видалити цей запис?',
    header: 'Підтвердити видалення запису',
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      try {
        await removeOne({ id });
        toast.add({
          severity: 'success',
          summary: 'Інформація',
          detail: 'Запис видалено',
          life: 3000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: 'Попередження',
          detail: 'Запис не видалено',
          life: 3000
        });
      } finally {
        reports.value = await findAll();
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Інформація',
        detail: 'Видалення запису не підтверджено',
        life: 3000
      });
    }
  });
};

const convertToCSV = data => {
  const [first] = data;
  const headerI18n = Object.keys(first).map(item => t(item));
  const header = headerI18n.join(';');
  const rows = data.map(obj => Object.values(obj).join(';'));
  return `${header}\n${rows.join('\n')}`;
};

const reportToCSV = async ({ id }) => {
  try {
    loading.value = true;

    const data = await generateReport({ id });
    const filename = `report-at-${dateToStr(new Date())}`;
    const csvData = convertToCSV(data);
    const blobDate = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = window.URL.createObjectURL(blobDate);
    a.download = filename + '.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: t(err.message),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  try {
    reports.value = await findAll({});
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: t(err.message),
      life: 3000
    });
  }
});
</script>

<template>
  <Menu ref="refMenu" popup :model="options">
    <template #item="{ label, item, props }">
      <a :href="item.url" v-bind="props.action">
        <span v-bind="props.icon" />
        <span v-bind="props.label">{{ label }}</span>
      </a>
    </template>
  </Menu>

  <div class="h-full w-full">
    <div class="mb-6 flex content-center">
      <div class="mr-2 flex items-center justify-center">
        <AppIcons :name="$route?.name" :size="42" />
      </div>
      <div>
        <h3 class="text-2xl">
          {{ $t($route?.meta?.title) }}
        </h3>
        <p class="text-base text-surface-500">
          {{ $t($route?.meta?.description) }}
        </p>
      </div>
    </div>

    <div class="flex flex-wrap justify-start gap-6 p-8">
      <Card
        class="flex w-full cursor-pointer items-center justify-center hover:shadow-xl lg:w-2/4 xl:w-1/4"
        @click="refModal.toggle({})"
      >
        <template #content>
          <div class="flex flex-col items-center justify-center gap-4">
            <i class="pi pi-plus-circle text-5xl" />
            <p class="text-xl font-medium">Створити шаблон звіту</p>
          </div>
        </template>
      </Card>

      <Card
        class="w-full hover:shadow-xl lg:w-2/4 xl:w-1/4"
        v-for="item in reports"
        :key="`report-${item.id}`"
      >
        <template #title>
          <div class="flex w-full justify-between">
            <div class="flex items-center justify-center">
              <i class="pi pi-file-excel mr-4 text-6xl" />
              <div>
                <p class="line-height-2 text-lg font-bold">
                  {{ item?.name || '-' }}
                </p>
                <p class="line-height-2 text-sm font-normal text-surface-500">
                  Звіт створений {{ item?.creator }}
                </p>
                <p class="line-height-2 text-sm font-normal text-surface-500">
                  Створено о {{ dateToStr(item?.updatedAt) || '-' }}
                </p>
              </div>
            </div>

            <div class="flex items-center">
              <Button
                text
                plain
                rounded
                class="h-12 w-12"
                icon="pi pi-cog"
                v-tooltip.bottom="'Меню опцій'"
                @click="event => onMenuClick(event, item)"
              />
            </div>
          </div>
        </template>

        <template #content>
          <ProgressBar
            mode="indeterminate"
            style="height: 6px; margin-bottom: 12px"
            v-if="loading && report.id === item.id"
          />

          <div class="pl-[5rem]">
            <p class="text-base">
              {{ item?.description || '-' }}
            </p>
          </div>
        </template>
      </Card>
    </div>

    <ModalRecord ref="refModal" @close="onCloseModal" />
  </div>
</template>
