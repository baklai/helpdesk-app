<script setup>
import { ref } from 'vue';

const props = defineProps(['prescript']);
</script>

<template>
  <div v-if="prescript">
    <a name="prescript"></a>
    <h2>Pre-Scan Script Output</h2>
    <table>
      <tr class="head">
        <td>Script Name</td>
        <td>Output</td>
      </tr>
      <tr v-for="script in prescript" :key="script.id">
        <td>{{ script.id }}</td>
        <td>
          <pre>{{ script.output }}</pre>
        </td>
      </tr>
    </table>
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
  background-color: #ffffff;
  width: 75%;
  text-align: left;
}

#container p {
  font-size: 8pt;
  color: #000000;
  background-color: #ffffff;
  width: 75%;
  text-align: left;
}

#container p i {
  font-size: 8pt;
  color: #000000;
  background-color: #cccccc;
}

#container ul {
  font-size: 8pt;
  color: #000000;
  background-color: #ffffff;
  width: 75%;
  text-align: left;
}

#container a {
  text-decoration: none;
  font-size: 8pt;
  color: #000000;
  font-weight: bold;
  background-color: #ffffff;
  color: #000000;
}

#container li a {
  text-decoration: none;
  font-size: 10pt;
  color: #000000;
  font-weight: bold;
  background-color: #ffffff;
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
  background-color: #ffffff;
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

#container #menu li {
  display: inline;
  margin: 0;
  padding: 0;
  list-style-type: none;
}

#container #menubox {
  position: fixed;
  bottom: 0px;
  right: 0px;
  width: 120px;
}

#container .up {
  color: #000000;
  background-color: #ccffcc;
}

#container .down {
  color: #626262;
  background-color: #f2f2f2;
}

#container .print_only {
  display: none;
}

#container .hidden {
  display: none;
}

#container .unhidden {
  display: block;
}
</style>
