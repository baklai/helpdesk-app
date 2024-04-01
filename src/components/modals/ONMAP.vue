<script setup>
import html2pdf from 'html2pdf.js';
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';

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
    acceptClass: '',
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
    const element = document.querySelector('#report');
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

const idHostDots = value => {
  return 'host_' + value.replace(/\./g, '_');
};

const scrollTo = href => {
  const element = document.getElementById(href);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
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
    class="w-[80rem]"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex justify-between w-full">
        <div class="flex items-center justify-center">
          <AppIcons name="onmap-scanner" :size="40" class="mr-4" />
          <div>
            <p class="text-lg font-bold line-height-2">
              {{ record?.title || '-' }}
            </p>
            <p class="text-base font-normal line-height-2 text-surface-500">
              {{ $t('Report target') }}: {{ record?.target || '-' }}
            </p>
            <p class="text-base font-normal line-height-2 text-surface-500">
              {{ $t('Report date') }}:
              {{ dateTimeToStr(record?.updatedAt) || '-' }}
            </p>
          </div>
        </div>

        <div class="flex gap-2 items-center">
          <Button
            text
            plain
            rounded
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="$t('Options menu')"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <template #default>
      <div id="report" class="w-full text-left my-2 mx-auto">
        <h1 class="mb-6" v-if="record?.item">
          {{ $t('Onmap Scan Report') }} - {{ $t('Scanned at') }}
          {{ record?.item?.start ? unixDateTimeToStr(record.item.start) : '' }}
        </h1>

        <ul v-if="record?.host" class="inline list-none p-0">
          <li class="inline">
            <a @click.prevent="scrollTo('scansummary')" class="text-primary">
              {{ $t('SCAN SUMMARY') }}
            </a>
          </li>

          <li v-for="host in record.host" class="inline">
            <span class="font-bold"> | </span>
            <a
              v-for="(address, index) in host.address"
              :class="host?.status[index]?.item?.state || ''"
              @click.prevent="scrollTo(idHostDots(address.item.addr))"
            >
              {{ address.item.addr }}
            </a>
          </li>
        </ul>

        <div v-if="record?.item">
          <h2 id="scansummary" class="mb-2">{{ $t('Scan Summary') }}</h2>

          <p>
            Nmap {{ record?.item?.version || '-' }} was initiated at
            {{ record?.item?.startstr || '-' }} with these arguments:
            <br />
            <i> {{ record?.item?.args || '-' }} </i>
            <br />
          </p>

          <p v-for="(ver, index) in record.verbose">
            Verbosity:
            {{ ver.item.level }}
            ; Debug level
            {{ record.debugging[index]?.item?.level || '-' }}
          </p>

          <p v-for="runstat in record.runstats">
            <span v-for="finished in runstat.finished">
              {{ finished.item.summary }}
            </span>
          </p>
        </div>

        <div v-if="record?.host" v-for="host in record.host">
          <h2
            v-for="(status, index) in host.status"
            :id="idHostDots(host.address[index].item.addr)"
            :class="['mb-6', status.item.state]"
          >
            {{ host.address[index].item.addr }}
          </h2>

          <div v-if="host?.address" class="px-2">
            <h3>{{ $t('Address') }}</h3>
            <ul class="pl-4">
              <li v-for="item in host.address">{{ item.item.addr }} ({{ item.item.addrtype }})</li>
            </ul>
          </div>

          <div v-if="host?.ports" v-for="port in host.ports" class="px-2">
            <h3>{{ $t('Ports') }}</h3>

            <div v-for="extraport in port.extraports">
              <p>
                The {{ extraport.item.count }} ports scanned but not shown below are in state:
                {{ extraport.item.state }}
              </p>

              <ul class="pl-4">
                <li v-for="extrareason in extraport.extrareasons">
                  {{ extrareason.item.count }} ports replied with: {{ extrareason.item.reason }}
                </li>
              </ul>
            </div>
          </div>

          <div v-for="ports in host.ports" v-if="host?.ports">
            <table cellspacing="1" class="w-full px-2 m-0">
              <tbody>
                <tr class="head">
                  <td colspan="2">{{ $t('Port') }}</td>
                  <td>{{ $t('State') }}</td>
                  <td>{{ $t('Service') }}</td>
                  <td>{{ $t('Reason') }}</td>
                  <td>{{ $t('Product') }}</td>
                  <td>{{ $t('Version') }}</td>
                  <td>{{ $t('Extra info') }}</td>
                </tr>

                <template v-for="{ item, script, service, state } in ports.port">
                  <tr :class="state[0].item.state">
                    <td>{{ item?.portid || '-' }}</td>
                    <td>{{ item?.protocol || '-' }}</td>
                    <td>{{ state[0]?.item?.state || '-' }}</td>
                    <td>{{ service[0]?.item?.name || '-' }}</td>
                    <td>{{ state[0]?.item?.reason || '-' }}</td>
                    <td>{{ service[0]?.item?.product || '-' }}</td>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <div v-if="host?.os" v-for="os in host.os" class="px-2">
            <h3>{{ $t('Remote Operating System Detection') }}</h3>
            <p v-if="!os?.osmatch?.length">{{ $t('Unable to identify operating system') }}.</p>
            <ul class="pl-4">
              <li v-if="os?.portused" v-for="portused in os.portused">
                {{ $t('Used port') }}:
                <b> {{ portused.item.portid }}/{{ portused.item.proto }} </b>
                <b> ({{ portused.item.state }}) </b>
              </li>
              <li v-if="os?.osmatch" v-for="osmatch in os.osmatch">
                {{ $t('OS match') }}:
                <b>{{ osmatch.item.name }}</b>
                <b>({{ osmatch.item.accuracy }}%)</b>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <ScrollTop target="parent" :threshold="400" behavior="smooth" />
    </template>

    <template #footer>
      <Button text plain icon="pi pi-times" :label="$t('Close')" @click="visible = false" />
      <Button text plain icon="pi pi-check" :label="$t('Save')" @click="onSaveReport" />
    </template>
  </Dialog>
</template>

<style scoped>
#report h1 {
  font-weight: bold;
  font-size: 14pt;
  color: #ffffff;
  background-color: #2a0d45;
  margin: 10px 0px 0px 0px;
  padding: 5px 4px 5px 4px;
  width: 100%;
  border: 1px solid black;
  text-align: left;
}

#report h2 {
  font-weight: bold;
  font-size: 11pt;
  color: #000000;
  margin: 30px 0px 0px 0px;
  padding: 4px;
  width: 100%;
  background-color: #f0f8ff;
  text-align: left;
}

#report h2.green {
  color: #000000;
  background-color: #ccffcc;
  border-color: #006400;
}

#report h2.red {
  color: #000000;
  background-color: #ffcccc;
  border-color: #8b0000;
}

#report h3 {
  font-weight: bold;
  font-size: 10pt;
  text-align: left;
}

#report p {
  text-align: left;
}

#report p i {
  color: #000000;
  background-color: #cccccc;
}

#report a {
  text-decoration: none;
  font-size: 8pt;
  color: #000000;
  font-weight: bold;
  background-color: #ffffff;
  color: #000000;
  cursor: pointer;
}

#report li a {
  text-decoration: none;
  font-size: 10pt;
  color: #000000;
  font-weight: bold;
  background-color: #ffffff;
  color: #000000;
}

#report a.up {
  color: #006400;
}

#report table {
  border: 0px;
  color: #000000;
  margin: 10px;
}

#report tr {
  vertical-align: top;
  font-size: 8pt;
  color: #000000;
  background-color: #ffffff;
}

#report tr.head {
  background-color: #e1e1e1;
  color: #000000;
  font-weight: bold;
}

#report tr.open {
  background-color: #ccffcc;
  color: #000000;
}

#report tr.script {
  background-color: #effff7;
  color: #000000;
}

#report tr.filtered {
  background-color: #f2f2f2;
  color: #000000;
}

#report tr.closed {
  background-color: #f2f2f2;
  color: #000000;
}

#report td {
  padding: 2px;
}

#report .up {
  color: #000000;
  background-color: #ccffcc;
}

#report .down {
  color: #626262;
  background-color: #f2f2f2;
}
</style>
