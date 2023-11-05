<script setup>
import html2pdf from 'html2pdf.js';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

import Reportmenu from '@/components/partials/onmap/reportmenu.vue';
import Scansummary from '@/components/partials/onmap/scansummary.vue';
import Prescript from '@/components/partials/onmap/prescript.vue';
import Host from '@/components/partials/onmap/host.vue';

import { dateTimeToStr, unixDateTimeToStr } from '@/service/DataFilters';

import { useOnmap } from '@/stores/api/onmaps';

const { t } = useI18n();
const toast = useToast();
const Onmap = useOnmap();

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    if (id) {
      try {
        record.value = await Onmap.findOne({ id });

        visible.value = true;
      } catch (err) {
        visible.value = false;
      }
    }
  }
});

const visible = ref(false);

const record = ref(null);

const refMenu = ref();
const options = ref([
  {
    label: t('Save record'),
    icon: 'pi pi-save',
    command: async () => onSaveReport()
  },
  {
    label: t('Delete record'),
    icon: 'pi pi-trash',
    command: async () => await onRemoveRecord()
  }
]);

const onCloseModal = () => {
  record.value = null;
  emits('close', {});
};

const onRemoveRecord = async () => {
  confirm.require({
    message: t('Do you want to delete this record?'),
    header: t('HD Confirm delete record'),
    icon: 'pi pi-info-circle text-yellow-500',
    acceptIcon: 'pi pi-check',
    acceptClass: 'p-button-danger',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      if (record.value?.id) {
        try {
          await Onmap.removeOne(record.value);
          toast.add({
            severity: 'success',
            summary: t('HD Information'),
            detail: t('Record is removed'),
            life: 3000
          });
        } catch (err) {
          toast.add({
            severity: 'warn',
            summary: t('HD Warning'),
            detail: t('Record not removed'),
            life: 3000
          });
        } finally {
          visible.value = false;
        }
      } else {
        toast.add({
          severity: 'warn',
          summary: t('HD Warning'),
          detail: t('Record not selected'),
          life: 3000
        });
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: t('HD Information'),
        detail: t('Record deletion not confirmed'),
        life: 3000
      });
    }
  });
};

const onSaveReport = () => {
  try {
    const element = document.querySelector('#container');
    const options = {
      margin: 1,
      filename: `ONMAP_${record.value.target} (${new Date(
        record.value.updatedAt
      ).toLocaleDateString()}).pdf`,
      jsPDF: {
        format: 'a4',
        compress: true,
        floatPrecision: 16,
        orientation: 'portrait'
      }
    };
    html2pdf().set(options).from(element).save();

    toast.add({
      severity: 'success',
      summary: t('HD Information'),
      detail: t('Report created successfully'),
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t('An unexpected error has occurred'),
      life: 3000
    });
  }
};

onMounted(() => {});
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

  <Dialog
    modal
    closable
    dismissableMask
    :draggable="false"
    v-model:visible="visible"
    :style="{ width: '900px' }"
    class="p-fluid"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-content-between w-full">
        <div class="flex align-items-center justify-content-center">
          <AppIcons name="onmap-scanner" :size="40" class="mr-2" />
          <div>
            <p class="text-lg font-bold line-height-2 mb-0">
              {{ record?.title || '-' }}
            </p>
            <p class="text-base font-normal line-height-2 text-color-secondary mb-0">
              {{ $t('Report target') }}: {{ record?.target || '-' }}
            </p>
            <p class="text-base font-normal line-height-2 text-color-secondary mb-0">
              {{ $t('Report date') }}:
              {{ dateTimeToStr(record?.updatedAt) || '-' }}
            </p>
          </div>
        </div>
        <div class="flex gap-2 align-items-center">
          <Button
            text
            plain
            rounded
            icon="pi pi-ellipsis-v"
            class="mx-2"
            v-tooltip.bottom="$t('Options menu')"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <template #default>
      <div id="container">
        <h1>
          Onmap Scan Report - Scanned at
          {{ record?.item?.start ? unixDateTimeToStr(record.item.start) : '' }}
        </h1>

        <Reportmenu :hosts="record.host" v-if="record?.host" />

        <Scansummary
          :item="record?.item || null"
          :runstats="record?.runstats || []"
          :verbose="record?.verbose || []"
          :debugging="record?.debugging || []"
          v-if="record?.item"
        />

        <Prescript :prescript="record.prescript" v-if="record?.prescript" />

        <Host :hosts="record.host" v-if="record?.host" />
      </div>

      <ScrollTop target="parent" :threshold="400" behavior="smooth" class="bg-primary" />
    </template>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Close')" @click="visible = false" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveReport" />
    </template>
  </Dialog>
</template>

<style scoped>
#container {
  text-align: left;
  margin: 10px auto;
  width: 100%;
}

#container h1 {
  font-weight: bold;
  font-size: 14pt;
  color: #ffffff;
  background-color: #2a0d45;
  margin: 10px 0px 0px 0px;
  padding: 5px 4px 5px 4px;
  width: 100%;
  text-align: left;
}

#container h2 {
  font-weight: bold;
  font-size: 11pt;
  color: #000000;
  margin: 30px 0px 0px 0px;
  padding: 4px;
  width: 100%;
  background-color: #f0f8ff;
  text-align: left;
}
#container h2.green {
  color: #000000;
  background-color: #ccffcc;
  border-color: #006400;
}
#container h2.red {
  color: #000000;
  background-color: #ffcccc;
  border-color: #8b0000;
}

#container h3 {
  font-weight: bold;
  font-size: 10pt;
  color: #000000;
  /* background-color: #ffffff; */
  width: 75%;
  text-align: left;
}

#container p {
  font-size: 8pt;
  color: #000000;
  /* background-color: #ffffff; */
  width: 75%;
  text-align: left;
}

#container p i {
  font-size: 8pt;
  color: #000000;
  background-color: #cccccc;
}

#container a {
  text-decoration: none;
  font-size: 8pt;
  color: #000000;
  font-weight: bold;
  /* background-color: #ffffff; */
  color: #000000;
}

#container a:hover {
  text-decoration: underline;
}

#container a.up {
  color: #006400;
}

#container table {
  width: 80%;
  border: 0px;
  color: #000000;
  background-color: #000000;
  margin: 10px;
}

#container tr {
  vertical-align: top;
  font-size: 8pt;
  color: #000000;
  /* background-color: #ffffff; */
}

#container tr.head {
  background-color: #e1e1e1;
  color: #000000;
  font-weight: bold;
}

#container tr.open {
  background-color: #ccffcc;
  color: #000000;
}

#container tr.script {
  background-color: #effff7;
  color: #000000;
}

#container tr.filtered {
  background-color: #f2f2f2;
  color: #000000;
}

#container tr.closed {
  background-color: #f2f2f2;
  color: #000000;
}

#container td {
  padding: 2px;
}

#container .up {
  color: #000000;
  background-color: #ccffcc;
}

#container .down {
  color: #626262;
  background-color: #f2f2f2;
}

#container .hidden {
  display: none;
}

#container .unhidden {
  display: block;
}
</style>
