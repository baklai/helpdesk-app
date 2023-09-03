<script setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import DBСompany from '@/components/modals/Сompany.vue';
import DBBranch from '@/components/modals/Branch.vue';
import DBEnterprise from '@/components/modals/Enterprise.vue';
import DBDepartment from '@/components/modals/Department.vue';
import DBLocation from '@/components/modals/Location.vue';
import DBPosition from '@/components/modals/Position.vue';
import DBUnit from '@/components/modals/Unit.vue';

const { t } = useI18n();

const refModalСompany = ref();
const refModalBranch = ref();
const refModalEnterprise = ref();
const refModalDepartment = ref();
const refModalLocation = ref();
const refModalPosition = ref();
const refModalUnit = ref();

const refMenu = ref();

const items = ref([
  {
    label: t('Unit records'),
    items: [
      {
        label: t('Unit'),
        icon: 'pi pi-desktop',
        command: () => refModalUnit.value.toggle({})
      }
    ]
  },
  {
    label: t('Locations records'),
    items: [
      {
        label: t('Location'),
        icon: 'pi pi-map-marker',
        command: () => refModalLocation.value.toggle({})
      }
    ]
  },
  {
    label: t('Companies records'),
    items: [
      {
        label: t('Company'),
        icon: 'pi pi-building',
        command: () => refModalСompany.value.toggle({})
      },
      {
        label: t('Branch'),
        icon: 'pi pi-building',
        command: () => refModalBranch.value.toggle({})
      },
      {
        label: t('Enterprise'),
        icon: 'pi pi-building',
        command: () => refModalEnterprise.value.toggle({})
      },
      {
        label: t('Department'),
        icon: 'pi pi-building',
        command: () => refModalDepartment.value.toggle({})
      }
    ]
  },
  {
    label: t('Positions records'),
    items: [
      {
        label: t('Position'),
        icon: 'pi pi-briefcase',
        command: () => refModalPosition.value.toggle({})
      }
    ]
  }
]);
</script>

<template>
  <Menu ref="refMenu" id="dbtables_menu" :model="items" :popup="true" />

  <Button
    text
    plain
    rounded
    aria-haspopup="true"
    aria-controls="dbtables_menu"
    icon="pi pi-database"
    iconClass="text-2xl"
    class="p-button-lg hover:text-color h-3rem w-3rem"
    v-tooltip.bottom="$t('DB Tables')"
    @click="(event) => refMenu.toggle(event)"
  />

  <DBСompany ref="refModalСompany" @close="() => true" />
  <DBBranch ref="refModalBranch" @close="() => true" />
  <DBEnterprise ref="refModalEnterprise" @close="() => true" />
  <DBDepartment ref="refModalDepartment" @close="() => true" />
  <DBLocation ref="refModalLocation" @close="() => true" />
  <DBPosition ref="refModalPosition" @close="() => true" />
  <DBUnit ref="refModalUnit" @close="() => true" />
</template>
