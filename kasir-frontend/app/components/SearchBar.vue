<script setup>
// Menerima inputan v-model dari halaman yang memanggilnya
defineProps(['modelValue', 'placeholder']);
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="relative w-full md:w-64">
    <input 
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      type="text" 
      :placeholder="placeholder || 'Cari...'" 
      class="w-full border border-slate-300 rounded-xl py-2 px-4 focus:ring-2 focus:ring-amber-500 outline-none text-sm shadow-sm"
    >
    <span class="absolute right-3 top-2 text-slate-400">🔍</span>
  </div>
</template>