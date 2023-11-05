<script setup>
const props = defineProps(['hosts']);

const hrefHostDots = value => {
  return '#host_' + value.replace(/\./g, '_');
};

const scrollTo = href => {
  const element = document.getElementById(href);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};
</script>

<template>
  <ul id="menu" v-if="hosts">
    <li>
      <a @click.prevent="scrollTo('scansummary')" class="text-primary">
        {{ $t('SCAN SUMMARY') }}
      </a>
    </li>

    <li v-for="(host, index) in hosts" :key="`host${index}`">
      <span class="font-bold"> | </span>
      <a
        v-for="(address, index) in host.address"
        :class="host.status[index].item.state"
        @click.prevent="scrollTo(hrefHostDots(address.item.addr))"
      >
        {{ address.item.addr }}
      </a>
    </li>
  </ul>
</template>

<style scoped>
#menu li {
  display: inline;
  margin: 0;
  padding: 0;
  list-style-type: none;
}

ul {
  font-size: 8pt;
  color: #000000;
  width: 75%;
  text-align: left;
}

li a {
  padding: 0px 4px;
  text-decoration: none;
  font-size: 10pt;
  color: #000000;
  font-weight: bold;
  color: #000000;
  cursor: pointer;
}

a:hover {
  text-decoration: none;
}

a.up {
  color: #006400;
}

.up {
  color: #000000;
  background-color: #ccffcc;
}

.down {
  color: #626262;
  background-color: #f2f2f2;
}
</style>
