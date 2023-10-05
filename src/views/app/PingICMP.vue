<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import Terminal from 'primevue/terminal';
import TerminalService from 'primevue/terminalservice';
import { useI18n } from 'vue-i18n';

import { useTool } from '@/stores/api/systools';

const { t } = useI18n();

const Tool = useTool();

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
      response = t('Today is ') + new Date().toLocaleDateString();
      break;

    case 'ping':
      response = `ICMP Ping running on ${host}`;
      try {
        const ping = await Tool.getCommandPING({ host: host });
        if (ping.output) {
          response += ping?.output;
        }
      } catch (err) {
        response += `ICMP Ping on ${value} does not answer`;
      }
      break;

    default:
      response = 'Unknown command: <span>sdkfjg</span>' + command;
  }

  TerminalService.emit('response', response);
};
</script>

<template>
  <div className="col-12">
    <div className="h-full">
      <div class="flex flex-wrap gap-4 mb-4 align-items-center justify-content-between">
        <div class="flex flex-wrap gap-2 align-items-center">
          <i class="mr-2 hidden sm:block">
            <AppIcons :name="$route?.name" :size="42" />
          </i>
          <div>
            <h3 class="text-color m-0">
              {{ $t($route?.meta?.title) }}
            </h3>
            <p class="text-color-secondary">
              {{ $t($route?.meta?.description) }}
            </p>
          </div>
        </div>
        <div
          class="flex flex-wrap gap-2 align-items-center justify-content-between sm:w-max w-full"
        >
          <div class="flex gap-2 sm:w-max w-full justify-content-between">
            <Button
              text
              plain
              rounded
              icon="pi pi-filter-slash"
              iconClass="text-2xl"
              class="p-button-lg hover:text-color h-3rem w-3rem"
              v-tooltip.bottom="$t('Clear terminal')"
            />

            <Button
              text
              plain
              rounded
              icon="pi pi-cog"
              iconClass="text-2xl"
              class="p-button-lg hover:text-color h-3rem w-3rem"
              v-tooltip.bottom="$t('Options')"
            />
          </div>
        </div>
      </div>

      <Terminal
        :welcomeMessage="`Helpdesk [ Version ${$helpdesk?.version} ] ${$helpdesk?.copyright}`"
        :prompt="`${$helpdesk?.user?.login}$&nbsp;`"
        class="h-30rem text-xl"
        aria-label="Helpdesk Terminal Service"
      />

      <div class="px-4 py-4">
        <p>
          <code class="text-base font-normal text-color surface-hover">-t</code>
          <span class="text-lg font-normal line-height-2">
            : Пинговать целевой хост непрерывно, пока не будет прервано пользователем.
          </span>
        </p>

        <p>
          <code class="text-base font-normal text-color surface-hover">-n &lt;число&gt;</code>
          <span class="text-lg font-normal line-height-2">
            : Указывает количество отправляемых запросов пинга.
          </span>
        </p>

        <p>
          <code class="text-base font-normal text-color surface-hover">-l &lt;размер&gt;</code>
          <span class="text-lg font-normal line-height-2">
            : Задает размер пакета данных пинга в байтах.
          </span>
        </p>

        <p>
          <code class="text-base font-normal text-color surface-hover">-f &lt;количество&gt;</code>
          <span class="text-lg font-normal line-height-2">
            : Устанавливает флаг "Фрагментация запрещена" в отправляемых пакетах.
          </span>
        </p>

        <p>
          <code class="text-base font-normal text-color surface-hover">-i &lt;время&gt;</code>
          <span class="text-lg font-normal line-height-2">
            : Устанавливает интервал между отправкой пакетов пинга в миллисекундах.
          </span>
        </p>

        <p>
          <code class="text-base font-normal text-color surface-hover">-v &lt;TTL&gt;</code>
          <span class="text-lg font-normal line-height-2">
            : Задает значение поля "Time to Live" (TTL) в отправляемых пакетах.
          </span>
        </p>

        <p>
          <code class="text-base font-normal text-color surface-hover">-r &lt;количество&gt;</code>
          <span class="text-lg font-normal line-height-2">
            : Позволяет задать максимальное количество прыжков (просмотров) пакетов пинга.
          </span>
        </p>

        <p>
          <code class="text-base font-normal text-color surface-hover">-w &lt;время&gt;</code>
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
