<script setup>
import { ref, watchEffect } from 'vue';
import { useConfig } from '@/stores/config';
import { useFileHosting } from '@/stores/api/filehosting';
import { byteToStr } from '@/service/DataFilters';

const Config = useConfig();
const FileHosting = useFileHosting();

const nodes = ref([]);
const expandedKeys = ref({});

watchEffect(async () => {
  if (Config.cloud) {
    const records = await FileHosting.findAll({});
    nodes.value = initNodesList(records);
  }
});

const copyToClipboard = (value) => {
  navigator.clipboard.writeText(value);
};

const initNodesList = (arr, key = '') => {
  if (!arr?.length) return null;
  return arr.map((item, index) => {
    return {
      key: key.length ? `${key}-${index}` : `${index}`,
      label: item.name,
      type: item.type,
      size: item.size,
      data: item.path,
      icon: item.type === 'directory' ? 'pi pi-folder' : 'pi pi-file',
      children: initNodesList(item.children, key.length ? `${key}-${index}` : `${index}`)
    };
  });
};

const expandNode = (node) => {
  expandedKeys.value[node.key] = true;
  if (node.children && node.children.length) {
    for (let child of node.children) {
      expandNode(child);
    }
  }
};

const expandAll = () => {
  for (let node of nodes.value) {
    expandNode(node);
  }
  expandedKeys.value = { ...expandedKeys.value };
};

const collapseAll = () => {
  expandedKeys.value = {};
};
</script>

<template>
  <Dialog
    maximizable
    v-model:visible="Config.cloud"
    :header="$t('HD File Hosting')"
    :contentStyle="{ height: '400px' }"
    :style="{ minWidth: '30vw' }"
  >
    <template #header>
      <div class="flex align-content-center flex-wrap">
        <div class="flex align-items-center justify-content-center mr-3">
          <i class="pi pi-cloud-upload" style="font-size: 3rem"></i>
        </div>
        <div class="flex align-items-center justify-content-center mr-4">
          <div class="flex flex-column">
            <h5 class="mb-0">{{ $t('HD File Hosting') }}</h5>
            <p>{{ $t('File hosting of the technical support') }}</p>
          </div>
        </div>
      </div>
    </template>

    <Tree filter :value="nodes" v-model:expandedKeys="expandedKeys" filterMode="lenient" scrollHeight="flex">
      <template #default="{ node }">
        <div>
          <p class="font-bold">{{ node.label }}</p>
        </div>
      </template>
      <template #file="{ node }">
        <div class="flex justify-content-between flex-wrap w-full">
          <div class="flex align-items-center justify-content-center mr-2">
            <p class="text-color my-0">{{ node.label }}</p>
          </div>
          <div class="flex align-items-center justify-content-center">
            <p class="text-color-secondary my-0 mr-2">{{ byteToStr(node.size) }}</p>
            <Button
              text
              plain
              rounded
              icon="pi pi-copy"
              iconClass="text-2xl"
              class="mx-2"
              @click="copyToClipboard(node.data)"
              v-tooltip.bottom="$t('Copy url to clipboard')"
            />
            <a
              download
              type="button"
              :href="$helpdesk.baseURL + node.data"
              class="p-button p-button-text p-button-rounded p-button-plain text-green-300"
              v-tooltip.bottom="$t('Download file')"
            >
              <i class="pi pi-download text-2xl" />
            </a>
          </div>
        </div>
      </template>
    </Tree>

    <template #footer>
      <div class="flex justify-content-between flex-wrap">
        <div class="flex align-items-center justify-content-center">
          <Button text plain icon="pi pi-plus" :label="$t('Expand All')" @click="expandAll" />
          <Button text plain icon="pi pi-minus" :label="$t('Collapse All')" @click="collapseAll" />
        </div>
        <div class="flex align-items-center justify-content-center">
          <Button text plain icon="pi pi-cloud-upload" :label="$t('Upload file')" />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
::v-deep(.p-treenode-label) {
  width: 100%;
}
</style>
