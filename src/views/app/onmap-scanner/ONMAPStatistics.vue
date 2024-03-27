<script setup>
import { ref, onMounted } from 'vue';

import { useStatistic } from '@/stores/api/statistics';

const Statistic = useStatistic();

const stats = ref({});

onMounted(async () => {
  stats.value = await Statistic.inspector();
});
</script>

<template>
  <div className="flex-shrink-0 p-4 w-full">
    <div class="flex content-center mb-6">
      <div class="flex items-center justify-center mr-2">
        <AppIcons :name="$route?.name" :size="42" />
      </div>
      <div>
        <h5 class="text-sm text-surface-500 m-0">
          {{ $t($route?.meta?.title) }}
        </h5>
        <h3 class="m-0">{{ $t($route?.meta?.description) }}</h3>
      </div>
    </div>

    <div class="flex flex-wrap"></div>
  </div>
</template>
