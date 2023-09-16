<script setup>
import { dateToStr } from '@/service/DataFilters';

defineProps({
  record: {
    type: Object,
    default: {},
    required: true
  },
  internet: {
    type: Boolean,
    default: true
  },
  email: {
    type: Boolean,
    default: true
  }
});
</script>

<template>
  <table>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Location') }} :</td>
      <td>{{ record?.location?.name || '-' }}</td>
    </tr>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Unit') }} :</td>
      <td>{{ record?.unit?.name || '-' }}</td>
    </tr>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('IP Address') }} :</td>
      <td>{{ record?.ipaddress || '-' }}</td>
    </tr>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Mask') }} :</td>
      <td>{{ record?.mask || '-' }}</td>
    </tr>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Gateway') }} :</td>
      <td>{{ record?.gateway || '-' }}</td>
    </tr>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Incoming letter number') }} :</td>
      <td>{{ record?.mail || '-' }}</td>
    </tr>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Company') }} :</td>
      <td>{{ record?.company?.name || '-' }}</td>
    </tr>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Branch') }} :</td>
      <td>{{ record?.branch?.name || '-' }}</td>
    </tr>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Enterprise') }} :</td>
      <td>{{ record?.enterprise?.name || '-' }}</td>
    </tr>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Department') }} :</td>
      <td>{{ record?.department?.name || '-' }}</td>
    </tr>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Fullname') }} :</td>
      <td>{{ record?.fullname || '-' }}</td>
    </tr>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Position') }} :</td>
      <td>{{ record?.position?.name || '-' }}</td>
    </tr>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Phone') }} :</td>
      <td>{{ record?.phone || '-' }}</td>
    </tr>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Autoanswer') }} :</td>
      <td>{{ record?.autoanswer || '-' }}</td>
    </tr>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Date open') }} :</td>
      <td>{{ dateToStr(record?.date) || '-' }}</td>
    </tr>
    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Comment') }} :</td>
      <td>{{ record?.comment }}</td>
    </tr>

    <tr>
      <td class="font-weight-bold" width="50%">{{ $t('Internet') }} :</td>
      <td>
        <i
          :class="record?.status?.internet ? 'pi pi-check font-bold text-green-500' : 'pi pi-ban'"
        />
      </td>
    </tr>
  </table>

  <div
    v-if="
      internet &&
      (record?.internet?.mail ||
        record?.internet?.dateOpen ||
        record?.internet?.dateClose ||
        record?.internet?.comment)
    "
  >
    <h5>{{ $t('Internet') }}</h5>
    <table>
      <tr>
        <td class="font-weight-bold" width="40%">{{ $t('№ Mail') }} :</td>
        <td>{{ record?.internet?.mail || '-' }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold" width="40%">{{ $t('Date open') }} :</td>
        <td>{{ dateToStr(record?.internet?.dateOpen) || '-' }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold" width="40%">{{ $t('Date close') }} :</td>
        <td>{{ dateToStr(record?.internet?.dateClose) || '-' }}</td>
      </tr>
      <tr>
        <td class="font-weight-bold" width="40%">{{ $t('Comment') }} :</td>
        <td>{{ record?.internet?.comment }}</td>
      </tr>
    </table>
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border: 15px solid transparent;
  border-top: 5px solid transparent;
  border-collapse: collapse;
}

td,
th {
  font-size: 14px;
  border-bottom: 1px solid var(--surface-border);
}

th {
  font-weight: bold;
  text-align: left;
  background: transparent;
  text-transform: uppercase;
  padding: 5px;
}

td {
  padding: 3px;
}
</style>
