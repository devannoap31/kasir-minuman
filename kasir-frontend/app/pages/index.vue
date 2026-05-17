<script setup>
import { useAuthStore } from '~/stores/auth';
const authStore = useAuthStore();
</script>

<template>
  <div class="p-8">
    <h1 class="text-3xl font-bold text-slate-800">Dashboard</h1>
    <p class="text-slate-500 mt-2">Selamat datang kembali, <strong>{{ authStore.user?.nama }}</strong>!</p>
    
    <div class="mt-8 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <p class="text-center text-slate-500 italic">Grafik penjualan dan ringkasan hari ini akan muncul di sini.</p>
    </div>
  </div>
</template>