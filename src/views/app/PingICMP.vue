<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import Terminal from 'primevue/terminal';
import TerminalService from 'primevue/terminalservice';

import { usePing } from '@/stores/api/pings';

const Ping = usePing();

onMounted(() => {
  TerminalService.on('command', commandHandler);
});

onBeforeUnmount(() => {
  TerminalService.off('command', commandHandler);
});

const commandHandler = async text => {
  let response;
  let argsIndex = text.indexOf(' ');
  let command = argsIndex !== -1 ? text.substring(0, argsIndex) : text;

  const host = '127.0.0.1';

  switch (command) {
    case 'help':
      response = 'Список команд: help, date, ping';
      break;

    case 'date':
      response = 'Зараз ' + new Date().toLocaleString();
      break;

    case 'ping':
      response = `ICMP Пінг працює ${host}`;
      try {
        const ping = await Ping.createOne({ host: host });
        if (ping.output) {
          response += ping?.output;
        }
      } catch (err) {
        response += `ICMP Пінг на ${value} не відповідає`;
      }
      break;

    default:
      response = 'Невідома команда: <span>qwerty</span>' + command;
  }

  TerminalService.emit('response', response);
};
</script>

<template>
  <div class="h-full w-full">
    <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div class="flex flex-wrap items-center gap-2">
        <i class="mr-2 hidden sm:block">
          <AppIcons :name="$route?.name" :size="42" />
        </i>
        <div>
          <h3 class="text-2xl">
            {{ $route?.meta?.title }}
          </h3>
          <p class="text-base text-surface-500">
            {{ $route?.meta?.description }}
          </p>
        </div>
      </div>
      <div class="flex w-full flex-wrap items-center justify-between gap-2 sm:w-max">
        <div class="flex w-full justify-between gap-2 sm:w-max">
          <Button
            text
            plain
            rounded
            icon="pi pi-trash"
            iconClass="text-2xl"
            class="h-12 w-12"
            v-tooltip.bottom="'Очистити термінал'"
          />

          <Button
            text
            plain
            rounded
            icon="pi pi-cog"
            iconClass="text-2xl"
            class="h-12 w-12"
            v-tooltip.bottom="'Опції'"
          />
        </div>
      </div>
    </div>

    <Terminal
      prompt="helpdesk$&nbsp;"
      :welcomeMessage="`Helpdesk [ Version ${$helpdesk?.version} ] ${$helpdesk?.copyright}`"
      :pt="{
        prompt: {
          class: ['text-green-500 font-bold']
        },
        commandtext: {
          class: [
            'flex-1 shrink grow-0',
            'text-white-500 font-bold',
            'border-0',
            'p-0',
            'bg-transparent text-inherit',
            'outline-none'
          ]
        },
        command: {
          class: ['text-white-500 font-bold']
        },
        response: {
          class: ['text-primary-500 py-2']
        }
      }"
      class="!h-2/3 whitespace-pre-wrap text-base"
      aria-label="Helpdesk Terminal Service"
    />

    <div class="px-6 py-6">
      <h5 class="font-bold">
        Приклад:
        <span class="p-2 font-normal"> ping 192.168.0.1 </span>
      </h5>

      <h5 class="font-bold">
        Приклад:
        <span class="p-2 font-normal"> ping 192.168.0.1 -n 3 -w 1000 </span>
      </h5>

      <p>
        <code class="text-base font-normal">-n &lt;номер&gt;</code>
        <span class="line-height-2 text-lg font-normal"> : кількість відправлених запитів </span>
      </p>

      <p>
        <code class="text-base font-normal">-w &lt;номер&gt;</code>
        <span class="line-height-2 text-lg font-normal"> : час відповіді у мілісекундах </span>
      </p>
    </div>
  </div>
</template>

<style scoped>
code {
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
}

::v-deep([data-pc-section='welcomemessage']) {
  color: #71717a;
  padding-bottom: 4px;
}
</style>
