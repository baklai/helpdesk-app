<script setup lang="jsx">
import { ref, computed, inject, onMounted } from 'vue';
import { FilterMatchMode } from 'primevue/api';
import { useI18n } from 'vue-i18n';
import { useToast } from 'primevue/usetoast';
import { useConfirm } from 'primevue/useconfirm';
import { Clipboard } from 'v-clipboard';

import Breadcrumb from 'primevue/breadcrumb';
import FileUpload from 'primevue/fileupload';

import { dateTimeToStr, byteToStr } from '@/service/DataFilters';
import { useFTPClient } from '@/stores/api/ftpclient';

const { t } = useI18n();
const toast = useToast();
const confirm = useConfirm();

const ftp = useFTPClient();

const axios = inject('axios');

const home = ref({ icon: 'pi pi-folder-open' });
const breadcrumb = ref([]);
const files = ref([]);
const loading = ref(false);
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS }
});
const lockedRowBack = computed(() => [
  {
    name: t('return to back'),
    size: null,
    type: 0,
    modifiedAt: null
  }
]);

const goToBack = async () => {
  if (breadcrumb.value.length) {
    breadcrumb.value.pop();
  }

  await update();
};

const update = async path => {
  try {
    loading.value = true;
    if (path) {
      breadcrumb.value.push({ label: path });
    }
    files.value = await ftp.update({ path: breadcrumb.value.map(item => item.label).join('/') });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t('Record not updated'),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const rename = async event => {
  const { value, newValue } = event;
  if (value === newValue) return;
  try {
    await ftp.rename({
      path: `/${breadcrumb.value.map(item => item.label).join('/')}/${value}`,
      newPath: `/${breadcrumb.value.map(item => item.label).join('/')}/${newValue}`
    });
    toast.add({
      severity: 'success',
      summary: t('HD Information'),
      detail: t('Record is renamed'),
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t('Record not renamed'),
      life: 3000
    });
  } finally {
    await update();
  }
};

const remove = async (name, type) => {
  confirm.require({
    message: t('Do you want to delete this record?'),
    header: t('HD Confirm delete record'),
    icon: 'pi pi-info-circle text-yellow-500',
    acceptIcon: 'pi pi-check',
    acceptClass: 'p-button-danger',
    rejectIcon: 'pi pi-times',
    accept: async () => {
      try {
        await ftp.remove({
          path: `/${breadcrumb.value.map(item => item.label).join('/')}/${name}`,
          type
        });
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
        await update();
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

const download = async filename => {
  try {
    loading.value = true;

    const file = await ftp.download({
      path: breadcrumb.value.map(item => item.label).join('/'),
      filename: filename
    });

    const blob = new Blob([file]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.download = filename;
    link.click();

    toast.add({
      severity: 'info',
      summary: t('HD Information'),
      detail: t('FTP File download'),
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t('File not downloaded'),
      life: 3000
    });
  } finally {
    loading.value = false;
  }
};

const uploadFile = async event => {
  try {
    const [file] = event.files;
    const bodyFormData = new FormData();
    bodyFormData.append('path', `/${breadcrumb.value.map(item => item.label).join('/')}`);
    bodyFormData.append('file', file);
    await ftp.uploadFile(bodyFormData);
    toast.add({
      severity: 'success',
      summary: t('HD Information'),
      detail: t('File is uploaded'),
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t('File not uploaded'),
      life: 3000
    });
  } finally {
    await update();
  }
};

const uploadFolder = async () => {
  const newFolderName = t('New Folder');
  try {
    await ftp.uploadFolder({
      path: `/${breadcrumb.value.map(item => item.label).join('/')}/${newFolderName}`
    });
    toast.add({
      severity: 'success',
      summary: t('HD Information'),
      detail: t('Folder is created'),
      life: 3000
    });
  } catch (err) {
    toast.add({
      severity: 'warn',
      summary: t('HD Warning'),
      detail: t('Folder not created'),
      life: 3000
    });
  } finally {
    await update();
  }
};

const copyLink = async filename => {
  try {
    const link =
      `${axios.defaults.baseURL}/ftp/download?` +
      `path=${breadcrumb.value.map(item => item.label).join('/')}` +
      '&' +
      `falename=${filename}`;
    const encodedLink = encodeURI(link);
    await Clipboard.copy(encodedLink);
    toast.add({
      severity: 'info',
      summary: t('HD Information'),
      detail: t(`Link copied to clipboard`),
      life: 3000
    });
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  await update();
});
</script>

<template>
  <div class="col-12">
    <div class="flex h-full">
      <div class="flex w-full overflow-x-auto">
        <DataTable
          rowHover
          sortable
          scrollable
          removableSort
          :value="files"
          :loading="loading"
          sortField="type"
          :sortOrder="-1"
          sortMode="single"
          scrollHeight="flex"
          responsiveLayout="scroll"
          columnResizeMode="expand"
          v-model:filters="filters"
          :globalFilterFields="['name']"
          :frozenValue="breadcrumb?.length ? lockedRowBack : null"
          style="height: calc(100vh - 6rem); width: 100%"
          class="text-lg"
          editMode="cell"
          @cell-edit-complete="rename"
          tableClass="editable-cells-table"
        >
          <template #header>
            <div class="flex flex-wrap gap-4 mb-2 align-items-center justify-content-between">
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
                <div class="flex flex-wrap align-items-center justify-content-between">
                  <span class="p-input-icon-left p-input-icon-right sm:w-max w-full">
                    <i class="pi pi-search" />
                    <InputText
                      id="name"
                      class="sm:w-max w-full"
                      :placeholder="$t('Search')"
                      v-model="filters['global'].value"
                    />
                    <i
                      v-show="!!filters['global'].value"
                      class="pi pi-times cursor-pointer hover:text-color"
                      v-tooltip.bottom="$t('Clear filter')"
                      @click="filters['global'].value = null"
                    />
                  </span>
                </div>
                <div class="flex gap-2 sm:w-max w-full justify-content-between">
                  <FileUpload
                    mode="basic"
                    name="file"
                    :auto="false"
                    :multiple="false"
                    customUpload
                    chooseLabel="Upload"
                    class="p-button p-component p-button-icon-only p-button-rounded p-button-text p-button-plain p-button-lg mx-2 hover:text-green-500 hover:surface-hover p-button-icon h-3rem w-3rem"
                    v-tooltip.bottom="$t('Upload file')"
                    @uploader="uploadFile"
                  >
                    <i class="pi pi-upload text-3xl"></i>
                  </FileUpload>

                  <Button
                    text
                    plain
                    rounded
                    icon="pi pi-folder"
                    iconClass="text-3xl"
                    class="p-button-lg mx-2 hover:text-orange-500 h-3rem w-3rem"
                    v-tooltip.bottom="$t('Create folder')"
                    @click="uploadFolder()"
                  />

                  <Button
                    text
                    plain
                    rounded
                    icon="pi pi-sync"
                    iconClass="text-3xl"
                    class="p-button-lg mx-2 hover:text-primary h-3rem w-3rem"
                    v-tooltip.bottom="$t('Update records')"
                    @click="update()"
                  />
                </div>
              </div>
            </div>
          </template>

          <template #loading>
            <i class="pi pi-spin pi-spinner text-4xl mr-4"></i>
            <span> {{ $t('Loading records data. Please wait') }}.</span>
          </template>

          <template #empty>
            <div
              v-if="!loading && files?.length === 0"
              class="flex flex-column justify-content-center p-datatable-loading-overlay p-component-overlay z-0"
            >
              <i class="pi pi-upload text-color-secondary" style="font-size: 4rem"></i>
              <h5>{{ $t('No files found in folder') }}</h5>
              <Button
                icon="pi pi-home"
                iconClass="text-sm"
                class="p-button-lg"
                :label="$t('Home folder')"
                @click="update()"
              />
            </div>
          </template>

          <Column
            sortable
            field="name"
            :header="$t('Name')"
            :style="{ minWidth: '45%' }"
            class="cursor-pointer"
            headerClass="font-bold text-center uppercase"
          >
            <template #body="{ data }">
              <div class="flex flex-row flex-wrap">
                <div class="flex align-items-center justify-content-center mr-4">
                  <i
                    class="pi pi-folder-open font-bold text-2xl text-color-secondary"
                    v-if="data.type === 0"
                  />
                  <i class="pi pi-file text-green-500 text-2xl" v-if="data.type === 1" />
                  <i
                    class="pi pi-folder font-bold text-orange-500 text-2xl"
                    v-if="data.type === 2"
                  />
                </div>
                <div class="flex align-items-center justify-content-center">
                  <Button
                    text
                    plain
                    :label="data.name"
                    icon="pi pi-angle-left"
                    iconClass="text-2xl"
                    class="hover:text-green-500 cursor-pointer"
                    v-tooltip.bottom="$t('Go to previous directory')"
                    @click="goToBack"
                    v-if="data.type === 0"
                  />
                  <span class="text-xl" v-if="data.type === 1">
                    {{ data.name }}
                  </span>
                  <span class="text-xl font-bold" v-if="data.type === 2">
                    {{ data.name }}
                  </span>
                </div>
              </div>
            </template>

            <template #editor="{ data, field }">
              <template v-if="!data?.type">
                <div class="flex flex-row flex-wrap">
                  <div class="flex align-items-center justify-content-center mr-4">
                    <i class="pi pi-folder-open font-bold text-2xl text-color-secondary" />
                  </div>
                  <div class="flex align-items-center justify-content-center">
                    <Button
                      text
                      plain
                      :label="data.name"
                      icon="pi pi-angle-left"
                      iconClass="text-2xl"
                      class="hover:text-green-500 cursor-pointer"
                      v-tooltip.bottom="$t('Go to previous directory')"
                      @click="goToBack"
                    />
                  </div>
                </div>
              </template>
              <template v-else>
                <InputText v-model="data[field]" autofocus class="w-full" />
              </template>
            </template>
          </Column>

          <Column
            sortable
            field="size"
            :header="$t('Size')"
            :style="{ minWidth: '15%' }"
            headerClass="font-bold text-center uppercase"
          >
            <template #body="{ data }">
              <span class="text-color-secondary">
                {{ data.size ? byteToStr(data.size) : '' }}
              </span>
            </template>
          </Column>

          <Column
            sortable
            field="type"
            :header="$t('Type')"
            :style="{ minWidth: '10%' }"
            headerClass="font-bold text-center uppercase"
          >
            <template #body="{ data }">
              <span class="text-color-secondary" v-if="data.type === 0"> </span>
              <span class="text-color-secondary" v-if="data.type === 1">
                {{ $t('File') }}
              </span>
              <span class="text-color-secondary" v-if="data.type === 2">
                {{ $t('Folder') }}
              </span>
            </template>
          </Column>

          <Column
            sortable
            field="modifiedAt"
            :header="$t('Modified time')"
            :style="{ minWidth: '10%' }"
            headerClass="font-bold text-center uppercase"
          >
            <template #body="{ data }">
              <span class="text-color-secondary">
                {{ data.modifiedAt ? dateTimeToStr(data.modifiedAt) : null }}
              </span>
            </template>
          </Column>

          <Column
            field="options"
            :header="null"
            :style="{ minWidth: '15%' }"
            headerClass="font-bold text-center uppercase"
          >
            <template #body="{ data }">
              <div class="flex justify-content-end flex-wrap">
                <Button
                  text
                  plain
                  rounded
                  icon="pi pi-folder-open"
                  iconClass="text-2xl"
                  class="p-button-lg mx-2 text-orange-500 h-3rem w-3rem"
                  v-tooltip.bottom="$t('Open folder')"
                  @click="update(data.name)"
                  v-if="data.type === 2"
                />

                <Button
                  text
                  plain
                  rounded
                  icon="pi pi-download"
                  iconClass="text-2xl"
                  class="p-button-lg mx-2 text-green-500 h-3rem w-3rem"
                  v-tooltip.bottom="$t('Download file')"
                  @click="download(data.name)"
                  v-if="data.type === 1"
                />

                <!-- <Button
                  text
                  plain
                  rounded
                  icon="pi pi-copy"
                  iconClass="text-2xl"
                  class="p-button-lg mx-2 text-primary h-3rem w-3rem"
                  v-tooltip.bottom="$t('Copy link to file')"
                  @click="copyLink(data.name)"
                  v-if="data.type === 1"
                /> -->

                <Button
                  text
                  plain
                  rounded
                  icon="pi pi-trash"
                  iconClass="text-2xl"
                  class="p-button-lg mx-2 text-red-500 h-3rem w-3rem"
                  v-tooltip.bottom="data.type === 1 ? $t('Remove file') : $t('Remove folder')"
                  @click="remove(data.name, data.type)"
                  v-if="data.type === 1 || data.type === 2"
                />
              </div>
            </template>
          </Column>

          <template #footer>
            <Breadcrumb :home="home" :model="breadcrumb" class="py-3">
              <template #item="{ label, item, props }">
                <router-link v-if="item.route" v-slot="routerProps" :to="item.route" custom>
                  <a :href="routerProps.href" v-bind="props.action">
                    <span v-bind="props.icon" />
                    <span v-bind="props.label">{{ label }}</span>
                  </a>
                </router-link>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                  <span v-if="item.icon" v-bind="props.icon" />
                  <span v-bind="props.label">{{ label }}</span>
                </a>
              </template>
            </Breadcrumb>
          </template>
        </DataTable>
      </div>
    </div>
  </div>
</template>

<style scoped>
::v-deep(.p-fileupload > span) {
  padding: 0;
}

::v-deep(.p-fileupload > span > svg) {
  width: 1.75rem;
  height: 1.75rem;
}

::v-deep(.p-datatable-header) {
  background: var(--surface-card);
}

::v-deep(.p-datatable-footer) {
  border: none;
  padding-left: 0 !important;
  padding-right: 0 !important;
}

::v-deep(.p-datatable .p-datatable-thead > tr > th) {
  background: var(--surface-card);
}

::v-deep(.p-datatable .p-datatable-tbody > tr) {
  background: var(--surface-card);
}

::v-deep(.p-component-overlay) {
  background-color: transparent;
}

::v-deep(tr.p-datatable-emptymessage > td) {
  border: none;
}

::v-deep(tr.p-datatable-emptymessage:hover) {
  background: none !important;
}

::v-deep(.p-datatable .p-datatable-tbody > tr:not(.p-highlight):hover) {
  background: var(--surface-ground);
}

::v-deep(.p-datatable .p-datatable-tbody > tr:not(.p-highlight):focus) {
  background-color: var(--surface-ground);
}

::v-deep(.p-datatable.p-datatable-sm .p-datatable-tbody > tr > td) {
  padding: 0.3rem 0.3rem;
}
</style>
