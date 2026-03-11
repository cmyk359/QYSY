<template>
  <div>
    <BaseCard class="container">
      <h2>项目信息</h2>
      <h4>{{ name }}</h4>
      <h4>{{ desc }}</h4>
    </BaseCard>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()

const name = computed(() => route.query.name)
const desc = computed(() => route.query.desc)
</script>

<style scoped lang="scss"></style>
