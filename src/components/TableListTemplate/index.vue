<template>
    <div class="form">
        <div class="form_operate">
            <n-space justify="end">
                <slot name="operate"></slot>
            </n-space>
        </div>
        <!-- <n-divider style="margin: 10px 0" /> -->
        <div class="form_search">
            <slot name="search"></slot>
        </div>
        <div class="form_table">
            <slot name="table"></slot>
        </div>
        <div class="form_page">
            <slot name="page"></slot>
        </div>
        <div>
            <slot name="modal"></slot>
        </div>
    </div>
</template>
<script setup lang="ts">
</script>
<style lang="scss" scoped>
.form {
    padding: 10px;
    .form_operate {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding: 5px 0;
    }
    .form_table {
        height: 100%;
    }
    .form_page {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 10px;
        margin-bottom: 10px;
    }
}
</style>
