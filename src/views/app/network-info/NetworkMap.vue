<script setup>
import { ref, onMounted } from 'vue';

import 'vis-network/styles/vis-network.css';
import { Network } from 'vis-network';

import { useNetworkMap } from '@/stores/api/networkmap';

const NetworkMap = useNetworkMap();

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
    image: '/img/netmap/unknown.png',
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
    image: '/img/netmap/unknown.png',
    shape: 'image'
  },

  'HP Switch': {
    image: '/img/netmap/unknown.png',
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

onMounted(async () => {
  const ipaddreses = await NetworkMap.networkMap();

  const nodes = ipaddreses.map(item => {
    return { id: item.id, label: item.ipaddress, group: item.unit.name };
  });

  const edges = ipaddreses.map(item => {
    return {
      from: item.id,
      to: ipaddreses.find(el => el.ipaddress === item.gateway)?.id || null
    };
  });

  const LENGTH_MAIN = 350;
  const LENGTH_SERVER = 150;
  const LENGTH_SUB = 50;
  const WIDTH_SCALE = 2;
  const RED = '#C5000B';
  const GRAY = 'tomato';

  const container = document.getElementById('networkmap');

  new Network(container, { nodes, edges }, OPTIONS.value);

  // function draw() {
  //   nodes = [];

  //   edges = [];

  //   nodes.push({
  //     id: 1,
  //     label: '192.168.0.1',
  //     group: 'switch',
  //     value: 10
  //   });

  //   nodes.push({
  //     id: 2,
  //     label: '192.168.0.2',
  //     group: 'switch',
  //     value: 8
  //   });

  //   nodes.push({
  //     id: 3,
  //     label: '192.168.0.3',
  //     group: 'switch',
  //     value: 6
  //   });

  //   edges.push({
  //     from: 1,
  //     to: 2,
  //     length: LENGTH_MAIN,
  //     width: WIDTH_SCALE * 6,
  //     label: '0.71 mbps'
  //   });

  //   edges.push({
  //     from: 1,
  //     to: 3,
  //     length: LENGTH_MAIN,
  //     width: WIDTH_SCALE * 4,
  //     label: '0.55 mbps'
  //   });

  //   for (var i = 100; i <= 104; i++) {
  //     var value = 1;
  //     var width = WIDTH_SCALE * 2;
  //     var color = GRAY;
  //     var label = null;

  //     if (i === 103) {
  //       value = 5;
  //       width = 3;
  //     }
  //     if (i === 102) {
  //       color = RED;
  //       label = 'error';
  //     }

  //     nodes.push({
  //       id: i,
  //       label: '192.168.0.' + i,
  //       group: 'desktop',
  //       value: value
  //     });
  //     edges.push({
  //       from: 2,
  //       to: i,
  //       length: LENGTH_SUB,
  //       color: color,
  //       fontColor: color,
  //       width: width,
  //       label: label
  //     });
  //   }

  //   nodes.push({
  //     id: 201,
  //     label: '192.168.0.201',
  //     group: 'desktop',
  //     value: 1
  //   });

  //   edges.push({
  //     from: 2,
  //     to: 201,
  //     length: LENGTH_SUB,
  //     color: GRAY,
  //     width: WIDTH_SCALE
  //   });

  //   nodes.push({
  //     id: 202,
  //     label: '192.168.0.202',
  //     group: 'desktop',
  //     value: 4
  //   });

  //   edges.push({
  //     from: 3,
  //     to: 202,
  //     length: LENGTH_SUB,
  //     color: GRAY,
  //     width: WIDTH_SCALE * 2
  //   });

  //   for (var i = 230; i <= 231; i++) {
  //     nodes.push({
  //       id: i,
  //       label: '192.168.0.' + i,
  //       group: 'mobile',
  //       value: 2
  //     });
  //     edges.push({
  //       from: 3,
  //       to: i,
  //       length: LENGTH_SUB,
  //       color: GRAY,
  //       fontColor: 'green',
  //       width: WIDTH_SCALE
  //     });
  //   }

  //   nodes.push({
  //     id: 10,
  //     label: '192.168.0.10',
  //     group: 'server',
  //     value: 10
  //   });

  //   edges.push({
  //     from: 1,
  //     to: 10,
  //     length: LENGTH_SERVER,
  //     color: GRAY,
  //     width: WIDTH_SCALE * 6,
  //     label: '0.92 mbps'
  //   });

  //   nodes.push({
  //     id: 11,
  //     label: '192.168.0.11',
  //     group: 'server',
  //     value: 7
  //   });

  //   edges.push({
  //     from: 1,
  //     to: 11,
  //     length: LENGTH_SERVER,
  //     color: GRAY,
  //     width: WIDTH_SCALE * 3,
  //     label: '0.68 mbps'
  //   });

  //   nodes.push({
  //     id: 12,
  //     label: '192.168.0.12',
  //     group: 'server',
  //     value: 3
  //   });

  //   edges.push({
  //     from: 1,
  //     to: 12,
  //     length: LENGTH_SERVER,
  //     color: GRAY,
  //     width: WIDTH_SCALE,
  //     label: '0.3 mbps'
  //   });

  //   nodes.push({
  //     id: 204,
  //     label: 'Internet',
  //     group: 'internet',
  //     value: 10
  //   });

  //   edges.push({
  //     from: 1,
  //     to: 204,
  //     length: 200,
  //     width: WIDTH_SCALE * 3,
  //     label: '0.63 mbps'
  //   });

  //   var mynetwork = document.getElementById('networkmap');
  //   var x = -mynetwork.clientWidth / 2 + 50;
  //   var y = -mynetwork.clientHeight / 2 + 50;
  //   var step = 70;

  //   nodes.push({
  //     id: 1000,
  //     x: x,
  //     y: y,
  //     label: 'Internet',
  //     group: 'internet',
  //     value: 1,
  //     fixed: true,
  //     physics: false
  //   });

  //   nodes.push({
  //     id: 1001,
  //     x: x,
  //     y: y + step,
  //     label: 'Switch',
  //     group: 'switch',
  //     value: 1,
  //     fixed: true,
  //     physics: false
  //   });

  //   nodes.push({
  //     id: 1002,
  //     x: x,
  //     y: y + 2 * step,
  //     label: 'Server',
  //     group: 'server',
  //     value: 1,
  //     fixed: true,
  //     physics: false
  //   });

  //   nodes.push({
  //     id: 1003,
  //     x: x,
  //     y: y + 3 * step,
  //     label: 'Computer',
  //     group: 'desktop',
  //     value: 1,
  //     fixed: true,
  //     physics: false
  //   });

  //   nodes.push({
  //     id: 1004,
  //     x: x,
  //     y: y + 4 * step,
  //     label: 'Smartphone',
  //     group: 'mobile',
  //     value: 1,
  //     fixed: true,
  //     physics: false
  //   });

  //   var container = document.getElementById('networkmap');

  //   var data = {
  //     nodes: nodes,
  //     edges: edges
  //   };

  //   var options = {
  //     nodes: {
  //       scaling: {
  //         min: 16,
  //         max: 32
  //       }
  //     },
  //     edges: {
  //       color: GRAY,
  //       smooth: false
  //     },

  //     physics: {
  //       barnesHut: {
  //         gravitationalConstant: -30000
  //       },
  //       stabilization: {
  //         iterations: 2500
  //       }
  //     },

  //     groups: GROUPS.value
  //   };

  //   network = new Network(container, data, options);
  // }

  // draw();
});
</script>

<template>
  <div class="w-full h-full">
    <div class="flex align-content-center mb-4">
      <div class="flex align-items-center justify-content-center mr-2">
        <AppIcons :name="$route?.name" :size="42" />
      </div>
      <div>
        <h5 class="text-sm text-color-secondary m-0">
          {{ $t($route?.meta?.title) }}
        </h5>
        <h3 class="m-0">{{ $t($route?.meta?.description) }}</h3>
      </div>
    </div>

    <div id="networkmap" style="height: calc(100vh - 12rem)"></div>
  </div>
</template>

<style scoped></style>
