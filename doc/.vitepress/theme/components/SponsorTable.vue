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
            <td>{{ item.name }}</td>
            <td>{{ item.time }}</td>
            <td>{{ item.channel }}</td>
            <td>{{ item.amount.toFixed(2) }}</td>
        </tr>
        </tbody>
        <tfoot>
        <tr>
            <td colspan="3"><strong>总计</strong></td>
            <td><strong>{{ total.toFixed(2) }}</strong></td>
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
    // 确保金额是数字类型，并累加
    return props.data.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
});
</script>

<style scoped>
/* 这是一个基础的表格样式 */
.sponsor-table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
}

.sponsor-table th,
.sponsor-table td {
    padding: 8px 12px;
    border: 1px solid var(--vp-c-divider);
}

/* 【新增修改】针对第三列（渠道）进行居中对齐 */
.sponsor-table th:nth-child(3),
.sponsor-table td:nth-child(3) {
    text-align: center;
}

/* 对最后一列（金额列）进行右对齐，实现小数点对齐 */
.sponsor-table th:last-child,
.sponsor-table td:last-child {
    text-align: right;
    min-width: 80px;
}

/* 美化表尾 */
.sponsor-table tfoot td {
    background-color: var(--vp-c-bg-soft);
    font-weight: bold;
}
</style>