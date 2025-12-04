<template>
    <table class="sponsor-table">
        <thead>
        <tr>
            <th>昵称</th>
            <th>时间</th>
            <th>渠道</th>
            <th>金额</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in data" :key="index">
            <td>{{ item.nickname }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.channel }}</td>
            <td>{{ item.amount }}</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td colspan="3">**总计**</td>
            <td>**{{ total }}**</td>
        </tr>
        </tfoot>
    </table>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    data: {
        type: Array,
        required: true,
        default: () => [],
    },
});

const total = computed(() => {
    return props.data.reduce((sum, item) => sum + (item.amount || 0), 0);
});
</script>