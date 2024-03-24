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
    color: 'var(--text-color);',
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
  <div class="w-full h-full">
    <div class="flex align-content-center mb-6">
      <div class="flex items-center justify-center mr-2">
        <AppIcons :name="$route?.name" :size="42" />
      </div>
      <div>
        <h5 class="text-sm text-color-secondary m-0">
          {{ $t($route?.meta?.title) }}
        </h5>
        <h3 class="m-0">{{ $t($route?.meta?.description) }}</h3>
      </div>
    </div>

    <div class="flex overflow-hidden" style="height: calc(100vh - 12rem)">
      <div class="flex-none p-2 w-21rem">
        <div class="">
          <label for="location">{{ $t('Location name') }}</label>
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
            class="w-full"
          />
          <small v-if="ipaddreses?.length">
            {{ $t('Selected units') }}: {{ ipaddreses.length }}
          </small>
        </div>
      </div>

      <div id="netmap" class="flex-grow-1 flex items-center justify-center"></div>
    </div>
  </div>
</template>

<style scoped></style>
