<script setup>
import { ref, onMounted } from 'vue';
import 'vis-network/styles/vis-network.css';
import { Network } from 'vis-network';

import { useLocation } from '@/stores/api/locations';
import { useNetworkMap } from '@/stores/api/netmaps';

let network = null;

const NetworkMap = useNetworkMap();
const Location = useLocation();

const ipaddreses = ref([]);
const locations = ref([]);
const location = ref();

const GROUPS = ref({
  '-': {
    image: '/img/netmap/unknown.png',
    shape: 'image'
  },

  'Async Server': {
    image: '/img/netmap/server.png',
    shape: 'image'
  },

  Broadcast: {
    image: '/img/netmap/gateway.png',
    shape: 'image'
  },

  'Catalist Switch': {
    image: '/img/netmap/switches.png',
    shape: 'image'
  },

  Cisco: {
    image: '/img/netmap/cisco.png',
    shape: 'image'
  },

  'Cisco rezerv': {
    image: '/img/netmap/cisco.png',
    shape: 'image'
  },

  Concentrator: {
    image: '/img/netmap/unknown.png',
    shape: 'image'
  },

  'Dynamix UM-S': {
    image: '/img/netmap/modem.png',
    shape: 'image'
  },

  'For video conferencing': {
    image: '/img/netmap/unknown.png',
    shape: 'image'
  },

  Gateway: {
    image: '/img/netmap/gateway.png',
    shape: 'image'
  },

  'HP Switch': {
    image: '/img/netmap/switches.png',
    shape: 'image'
  },

  IPPhon: {
    image: '/img/netmap/ipphon.png',
    shape: 'image'
  },

  Medoc: {
    image: '/img/netmap/unknown.png',
    shape: 'image'
  },

  MikroTik: {
    image: '/img/netmap/unknown.png',
    shape: 'image'
  },

  Modem: {
    image: '/img/netmap/modem.png',
    shape: 'image'
  },

  MOXA: {
    image: '/img/netmap/unknown.png',
    shape: 'image'
  },

  NetBook: {
    image: '/img/netmap/laptop.png',
    shape: 'image'
  },

  NoteBook: {
    image: '/img/netmap/laptop.png',
    shape: 'image'
  },

  Printer: {
    image: '/img/netmap/printer.png',
    shape: 'image'
  },

  'Router C-2010 express': {
    image: '/img/netmap/unknown.png',
    shape: 'image'
  },

  Server: {
    image: '/img/netmap/server.png',
    shape: 'image'
  },

  'Server Lotus': {
    image: '/img/netmap/server.png',
    shape: 'image'
  },

  Shtorport: {
    image: '/img/netmap/unknown.png',
    shape: 'image'
  },

  Skype: {
    image: '/img/netmap/unknown.png',
    shape: 'image'
  },

  Stormport: {
    image: '/img/netmap/unknown.png',
    shape: 'image'
  },

  Subnet: {
    image: '/img/netmap/unknown.png',
    shape: 'image'
  },

  Switch: {
    image: '/img/netmap/switches.png',
    shape: 'image'
  },

  'Switch AT-8124XL': {
    image: '/img/netmap/switches.png',
    shape: 'image'
  },

  'Terminal KM-64': {
    image: '/img/netmap/unknown.png',
    shape: 'image'
  },

  'Video monitoring': {
    image: '/img/netmap/unknown.png',
    shape: 'image'
  },

  'Wi-Fi': {
    image: '/img/netmap/unknown.png',
    shape: 'image'
  },

  Workstation: {
    image: '/img/netmap/workstation.png',
    shape: 'image'
  },

  'ZyXEL IP Express': {
    image: '/img/netmap/modem.png',
    shape: 'image'
  },

  'VPN Server': {
    image: '/img/netmap/server.png',
    shape: 'image'
  }
});

const OPTIONS = ref({
  nodes: {
    scaling: {
      min: 16,
      max: 32
    }
  },
  edges: {
    color: 'rgb(var(--primary-500))',
    smooth: false
  },

  interaction: {
    navigationButtons: true,
    keyboard: true
  },

  physics: {
    barnesHut: {
      gravitationalConstant: -30000
    },
    stabilization: {
      iterations: 2500
    }
  },

  groups: GROUPS.value
});

const onSelectLocation = async id => {
  ipaddreses.value = await NetworkMap.networkMap({ id });

  const nodes = ipaddreses.value.map(item => {
    return { id: item.id, label: item.ipaddress, group: item.unit };
  });

  const edges = ipaddreses.value.map(item => {
    return {
      from: item.id,
      to: ipaddreses.value.find(el => el.ipaddress === item.gateway)?.id || null
    };
  });

  network.setData({ nodes, edges });
};

onMounted(async () => {
  locations.value = await Location.findAll({});

  const container = document.getElementById('netmap');

  network = new Network(container, { nodes: [], edges: [] }, OPTIONS.value);
});
</script>

<template>
  <div class="w-full h-full p-4">
    <div class="flex justify-between flex-wrap mb-2">
      <div class="flex flex-wrap gap-2 items-center">
        <i class="mr-2 block">
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
        <div class="flex flex-col">
          <div class="flex flex-row w-full gap-2">
            <Dropdown
              filter
              autofocus
              v-model="location"
              optionValue="id"
              optionLabel="name"
              :options="locations"
              @change="event => onSelectLocation(event.value)"
              :filterPlaceholder="$t('Search in list')"
              :placeholder="$t('Select location')"
              class="w-80"
            />

            <Button
              outlined
              severity="secondary"
              icon="pi pi-cog text-2xl"
              class="h-12 w-12"
              v-tooltip.bottom="$t('Options')"
            />
          </div>
          <small v-if="ipaddreses?.length" class="text-surface-500">
            {{ $t('Selected units') }}: {{ ipaddreses.length }}
          </small>
        </div>
      </div>
    </div>

    <div class="flex w-full overflow-hidden" style="height: calc(100vh - 13rem)">
      <div id="netmap" class="flex items-center justify-center w-full h-full"></div>
    </div>
  </div>
</template>

<style scoped></style>
