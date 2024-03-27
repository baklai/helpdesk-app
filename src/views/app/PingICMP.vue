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
  <div className="flex-shrink-0 p-4 w-full">
    <div className="h-full">
      <div class="flex flex-wrap gap-4 mb-6 items-center justify-between">
        <div class="flex flex-wrap gap-2 items-center">
          <i class="mr-2 hidden sm:block">
            <AppIcons :name="$route?.name" :size="42" />
          </i>
          <div>
            <h3 class="m-0">
              {{ $t($route?.meta?.title) }}
            </h3>
            <p class="text-surface-500">
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
        :welcomeMessage="`Helpdesk [ Version ${$helpdesk?.version} ] ${$helpdesk?.copyright}`"
        :prompt="`${$helpdesk?.user?.login || 'helpdesk'}$&nbsp;`"
        class="h-[30rem] text-xl"
        aria-label="Helpdesk Terminal Service"
      />

      <div class="px-6 py-6">
        <h5>
          Example:
          <span class="font-normal text-primary surface-hover rounded p-2">
            ping 192.168.0.1 -n 3 -w 1000
          </span>
        </h5>

        <p>
          <code class="text-base font-normal surface-hover">-n &lt;число&gt;</code>
          <span class="text-lg font-normal line-height-2">
            : Указывает количество отправляемых запросов пинга.
          </span>
        </p>

        <p>
          <code class="text-base font-normal surface-hover">-w &lt;время&gt;</code>
          <span class="text-lg font-normal line-height-2">
            : Устанавливает время ожидания ответа в миллисекундах.
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
code {
  padding: 0.2rem 0.5rem;
  border-radius: 0.3rem;
}

::v-deep(.p-terminal) {
  background-color: #212121;
  color: #adacac;
}

::v-deep(.p-terminal-content) {
  margin-top: 2rem;
}

::v-deep(.p-terminal-prompt) {
  color: #ffd54f;
}

::v-deep(.p-terminal-command) {
  color: #ffffff;
}

::v-deep(.p-terminal-input) {
  color: #ffffff;
  font-size: 1.25rem;
}

::v-deep(.p-terminal-response) {
  font-size: 1.12rem;
  padding: 0.5rem;
  color: #cac6c6;
  white-space: pre;
  font-family: monospace;
}
</style>
