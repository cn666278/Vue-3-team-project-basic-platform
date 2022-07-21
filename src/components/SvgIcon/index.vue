<template>
    <n-icon :size="props.size">
        <svg aria-hidden="true" class="svg-icon">
            <use :xlink:href="symbolId" rel="external nofollow"></use>
        </svg>
    </n-icon>
</template>
<script setup lang="ts">
import { computed } from "vue";
interface Props {
    name: String;
    size?: string | number | undefined;
}
const props = defineProps<Props>();
const symbolId = computed(() => `#icon-${props.name}`);
</script>
<style lang="scss"></style>
