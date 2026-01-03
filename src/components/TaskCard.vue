<template>
  <div class="bg-white p-3 mb-2 rounded shadow cursor-move">
    <div class="flex justify-between items-start">
      <div>
        <h4 class="font-bold text-sm mb-1">{{ task.title }}</h4>
        <p class="text-xs text-gray-600 mb-1" v-if="task.description">{{ task.description }}</p>
        <p class="text-xs text-gray-400" v-if="task.dueDate">🗓 {{ task.dueDate }}</p>
      </div>
      <button @click="$emit('deleteTask', task.id)" class="text-red-500 text-sm hover:text-red-700">&times;</button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  task: Object
})
</script>
