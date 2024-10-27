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
  <div className="h-full w-full">
    <div class="mb-6 flex content-center">
      <div class="mr-2 flex items-center justify-center">
        <AppIcons :name="$route?.name" :size="42" />
      </div>
      <div>
        <h3 class="text-2xl">
          {{ $route?.meta?.title }}
        </h3>
        <p class="text-base text-surface-500">
          {{ $route?.meta?.description }}
        </p>
      </div>
    </div>
    <div class="flex flex-wrap"></div>
  </div>
</template>
