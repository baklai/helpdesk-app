<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import Terminal from 'primevue/terminal';
import TerminalService from 'primevue/terminalservice';
import { useI18n } from 'vue-i18n';

import { usePing } from '@/stores/api/pings';

const { t } = useI18n();

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
      response = t('Command List: help, date, ping');
      break;

    case 'date':
      response = t('Now is ') + new Date().toLocaleString();
      break;

    case 'ping':
      response = `ICMP Ping running on ${host}`;
      try {
        const ping = await Ping.createOne({ host: host });
        if (ping.output) {
          response += ping?.output;
        }
      } catch (err) {
        response += `ICMP Ping on ${host} does not answer`;
      }
      break;

    default:
      response = 'Unknown command: <span>sdkfjg</span>' + command;
  }

  TerminalService.emit('response', response);
};
</script>

<template>
  <div class="h-full w-full">
    <div class="flex flex-wrap gap-4 mb-6 items-center justify-between">
      <div class="flex flex-wrap gap-2 items-center">
        <i class="mr-2 hidden sm:block">
          <AppIcons :name="$route?.name" :size="42" />
        </i>
        <div>
          <h3 class="text-2xl">
            {{ $t($route?.meta?.title) }}
          </h3>
          <p class="text-base text-surface-500">
            {{ $t($route?.meta?.description) }}
          </p>
        </div>
      </div>
      <div class="flex flex-wrap gap-2 items-center justify-between sm:w-max w-full">
        <div class="flex gap-2 sm:w-max w-full justify-between">
          <Button
            text
            plain
            rounded
            icon="pi pi-trash"
            iconClass="text-2xl"
            class="h-12 w-12"
            v-tooltip.bottom="$t('Clear terminal')"
          />

          <Button
            text
            plain
            rounded
            icon="pi pi-cog"
            iconClass="text-2xl"
            class="h-12 w-12"
            v-tooltip.bottom="$t('Options')"
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
      class="h-2/3 text-base whitespace-pre-wrap"
      aria-label="Helpdesk Terminal Service"
    />

    <div class="px-6 py-6">
      <h5 class="font-bold">
        {{ $t('Example') }}:
        <span class="font-normal p-2"> ping 192.168.0.1 </span>
      </h5>

      <h5 class="font-bold">
        {{ $t('Example') }}:
        <span class="font-normal p-2"> ping 192.168.0.1 -n 3 -w 1000 </span>
      </h5>

      <p>
        <code class="text-base font-normal">-n &lt;{{ $t('number') }}&gt;</code>
        <span class="text-lg font-normal line-height-2">
          : {{ $t('number of requests sent') }}
        </span>
      </p>

      <p>
        <code class="text-base font-normal">-w &lt;{{ $t('number') }}&gt;</code>
        <span class="text-lg font-normal line-height-2">
          : {{ $t('response time in milliseconds') }}
        </span>
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
