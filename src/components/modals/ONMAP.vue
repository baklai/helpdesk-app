<script setup>
import html2pdf from 'html2pdf.js';
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { dateTimeToStr, unixDateTimeToStr } from '@/service/DataFilters';
import { useOnmap } from '@/stores/api/onmaps';

const toast = useToast();
const confirm = useConfirm();

const { findOne, removeOne } = useOnmap();

const emits = defineEmits(['close']);

defineExpose({
  toggle: async ({ id }) => {
    if (id) {
      try {
        record.value = await findOne({ id });
        visible.value = true;
      } catch (err) {
        visible.value = false;
      }
    }
  }
});

const visible = ref(false);
const refMenu = ref();

const options = ref([
  {
    label: 'Зберегти запис',
    icon: 'pi pi-save',
    command: async () => onSaveReport()
  },
  {
    label: 'Видалити запис',
    icon: 'pi pi-trash',
    command: async () => await onRemoveRecord()
  }
]);

const record = ref(null);

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
      summary: 'Інформація',
      detail: 'Звіт створено успішно',
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Сталася неочікувана помилка',
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

const onRemoveRecord = async () => {
  if (!record.value?.id) {
    return toast.add({
      severity: 'warn',
      summary: 'Попередження',
      detail: 'Запис не вибрано',
      life: 5000
    });
  }
  confirm.require({
    message: 'Ви бажаєте видалити цей запис?',
    header: 'Підтвердити видалення запису',
    icon: 'pi pi-question',
    acceptIcon: 'pi pi-check',
    acceptClass: '',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      try {
        await removeOne(record.value);
        toast.add({
          severity: 'success',
          summary: 'Інформація',
          detail: 'Запис видалено',
          life: 5000
        });
      } catch (err) {
        toast.add({
          severity: 'warn',
          summary: 'Попередження',
          detail: 'Запис не видалено',
          life: 5000
        });
      } finally {
        visible.value = false;
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Інформація',
        detail: 'Видалення запису не підтверджено',
        life: 5000
      });
    }
  });
};

const onCloseModal = async () => {
  record.value = null;
  emits('close', {});
};
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
    class="mx-auto w-[90vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw] 2xl:w-[45vw]"
    @hide="onCloseModal"
  >
    <template #header>
      <div class="flex w-full justify-between">
        <div class="flex items-center justify-center">
          <AppIcons name="onmap-scanner" :size="40" class="mr-4" />
          <div>
            <p class="line-height-2 text-lg font-bold">
              {{ record?.title || '-' }}
            </p>
            <p class="line-height-2 text-base font-normal text-surface-500">
              Звіт про ціль: {{ record?.target || '-' }}
            </p>
            <p class="line-height-2 text-base font-normal text-surface-500">
              Дата звіту: {{ dateTimeToStr(record?.updatedAt) || '-' }}
            </p>
          </div>
        </div>
        <div class="flex items-center">
          <Button
            text
            plain
            rounded
            class="h-12 w-12"
            icon="pi pi-ellipsis-v"
            v-tooltip.bottom="'Меню параметрів'"
            @click="event => refMenu.toggle(event)"
          />
        </div>
      </div>
    </template>

    <template #default>
      <div id="report" class="mx-auto my-2 w-full text-left">
        <h1 class="mb-6" v-if="record?.item">
          Onmap звіт про сканування - Відскановано
          {{ record?.item?.start ? unixDateTimeToStr(record.item.start) : '' }}
        </h1>

        <ul v-if="record?.host" class="inline list-none p-0">
          <li class="inline">
            <a @click.prevent="scrollTo('scansummary')" class="text-primary"> РЕЗЮМЕ СКАНУВАННЯ </a>
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
          <h2 id="scansummary" class="mb-2">Підсумок сканування</h2>
          <p>
            Nmap {{ record?.item?.version || '-' }} було розпочато о
            {{ record?.item?.startstr || '-' }} з цими аргументами:
            <br />
            <i> {{ record?.item?.args || '-' }} </i>
            <br />
          </p>
          <p v-for="(ver, index) in record.verbose">
            Verbosity: {{ ver.item.level }}; Debug level
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
            <h3>Адреса</h3>
            <ul class="pl-4">
              <li v-for="item in host.address">{{ item.item.addr }} ({{ item.item.addrtype }})</li>
            </ul>
          </div>

          <div v-if="host?.ports" v-for="port in host.ports" class="px-2">
            <h3>Порти</h3>
            <div v-for="extraport in port.extraports">
              <p>
                Всі {{ extraport.item.count }} скановані порти, але не показані нижче, знаходяться в
                стані: {{ extraport.item.state }}
              </p>
              <ul class="pl-4">
                <li v-for="extrareason in extraport.extrareasons">
                  {{ extrareason.item.count }} порти відповіли с: {{ extrareason.item.reason }}
                </li>
              </ul>
            </div>
          </div>

          <div v-for="ports in host.ports" v-if="host?.ports">
            <table cellspacing="1" class="m-0 w-full px-2">
              <tbody>
                <tr class="head">
                  <td colspan="2">Порт</td>
                  <td>Стан</td>
                  <td>Сервіс</td>
                  <td>Причина</td>
                  <td>Продукт</td>
                  <td>Версія</td>
                  <td>Додаткова інформація</td>
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
            <h3>Віддалене виявлення операційної системи</h3>
            <p v-if="!os?.osmatch?.length">Не вдалося визначити операційну систему.</p>
            <ul class="pl-4">
              <li v-if="os?.portused" v-for="portused in os.portused">
                Використаний порт:
                <b> {{ portused.item.portid }}/{{ portused.item.proto }} </b>
                <b> ({{ portused.item.state }}) </b>
              </li>
              <li v-if="os?.osmatch" v-for="osmatch in os.osmatch">
                Відповідність ОС:
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
      <Button text plain icon="pi pi-times" label="Закрити" @click="visible = !visible" />
      <Button text plain icon="pi pi-check" label="Зберегти" @click="onSaveReport" />
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
