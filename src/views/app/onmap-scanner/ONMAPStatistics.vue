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
        <h3 class="text-2xl">
          {{ $t($route?.meta?.title) }}
        </h3>
        <p class="text-base text-surface-500">
          {{ $t($route?.meta?.description) }}
        </p>
      </div>
    </div>

    <div class="flex flex-wrap"></div>
  </div>
</template>
