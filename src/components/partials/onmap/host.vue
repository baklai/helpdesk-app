<script setup>
import Address from '@/components/partials/onmap/address.vue';

const props = defineProps(['hosts']);

const idHostDots = value => {
  return 'host_' + value.replace(/\./g, '_');
};
const hostTitle = value => {
  if (value.hostnames) {
    return value.hostnames[0]['hostname']
      ? `${value.address[0].item.addr}\u00A0/\u00A0${value.hostnames[0].hostname[0].item.name}`
      : value.address[0].item.addr;
  } else {
    return value.address[0].item.addr;
  }
};
</script>

<template>
  <div v-if="hosts">
    <div
      v-for="(item, index) in hosts"
      :key="`hostdiv${index}`"
      :id="idHostDots(item.address[0].item.addr)"
    >
      <h2 v-if="item.status[0].item.state === 'up'" :class="item.status[0].item.state">
        {{ hostTitle(item) }}
      </h2>

      <h2 v-else :class="item.status[0].item.state">
        {{ hostTitle(item) }}

        <a
          @click.prevent="hidden = !hidden"
          style="background-color: transparent !important; color: #42a5f5"
        >
          <span>
            <small> (click to expand)</small>
          </span>
        </a>
      </h2>

      <div
        :id="`hostblock_${item.address[0].item.addr}`"
        :class="item.status[0].item.state === 'up' ? 'unhidden' : 'hidden'"
      >
        <Address :address="item.address" />
      </div>
    </div>
  </div>
</template>

<style scoped>
#container {
  text-align: left;
  margin: 10px auto;
  width: 100%;
}

#container h1 {
  font-weight: bold;
  font-size: 14pt;
  color: #ffffff;
  background-color: #2a0d45;
  margin: 10px 0px 0px 0px;
  padding: 5px 4px 5px 4px;
  width: 100%;
  text-align: left;
}

#container h2 {
  font-weight: bold;
  font-size: 11pt;
  color: #000000;
  margin: 30px 0px 0px 0px;
  padding: 4px;
  width: 100%;
  background-color: #f0f8ff;
  text-align: left;
}
#container h2.green {
  color: #000000;
  background-color: #ccffcc;
  border-color: #006400;
}
#container h2.red {
  color: #000000;
  background-color: #ffcccc;
  border-color: #8b0000;
}

#container h3 {
  font-weight: bold;
  font-size: 10pt;
  color: #000000;
  /* background-color: #ffffff; */
  width: 75%;
  text-align: left;
}

#container p {
  font-size: 8pt;
  color: #000000;
  /* background-color: #ffffff; */
  width: 75%;
  text-align: left;
}

#container p i {
  font-size: 8pt;
  color: #000000;
  background-color: #cccccc;
}

#container a {
  text-decoration: none;
  font-size: 8pt;
  color: #000000;
  font-weight: bold;
  /* background-color: #ffffff; */
  color: #000000;
}

#container a:hover {
  text-decoration: underline;
}

#container a.up {
  color: #006400;
}

#container table {
  width: 80%;
  border: 0px;
  color: #000000;
  background-color: #000000;
  margin: 10px;
}

#container tr {
  vertical-align: top;
  font-size: 8pt;
  color: #000000;
  /* background-color: #ffffff; */
}

#container tr.head {
  background-color: #e1e1e1;
  color: #000000;
  font-weight: bold;
}

#container tr.open {
  background-color: #ccffcc;
  color: #000000;
}

#container tr.script {
  background-color: #effff7;
  color: #000000;
}

#container tr.filtered {
  background-color: #f2f2f2;
  color: #000000;
}

#container tr.closed {
  background-color: #f2f2f2;
  color: #000000;
}

#container td {
  padding: 2px;
}

#container .up {
  color: #000000;
  background-color: #ccffcc;
}

#container .down {
  color: #626262;
  background-color: #f2f2f2;
}

#container .hidden {
  display: none;
}

#container .unhidden {
  display: block;
}
</style>
