<script setup></script>

<template>
  <div className="col-12">
    <div class="flex align-content-center mb-4">
      <div class="flex align-items-center justify-content-center mr-2">
        <AppIcons :name="$route?.name" :size="42" />
      </div>
      <div>
        <h3 class="m-0">{{ $t($route?.meta?.title) }}</h3>
        <h5 class="text-sm text-color-secondary m-0">
          {{ $t($route?.meta?.description) }}
        </h5>
      </div>
    </div>
  </div>
</template>
