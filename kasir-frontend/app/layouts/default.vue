<script setup>
import { useAuthStore } from '~/stores/auth';
import { onMounted, ref } from 'vue';

const authStore = useAuthStore();
// State untuk mengatur buka/tutup sidebar
const isSidebarOpen = ref(false); 

onMounted(() => {
  // Jika dibuka di layar laptop/desktop, otomatis tampilkan sidebar
  if (window.innerWidth >= 768) {
    isSidebarOpen.value = true;
  }

  const token = localStorage.getItem('auth-token');
  const user = localStorage.getItem('auth-user');
  
  if (token && user) {
    authStore.user = JSON.parse(user);
    authStore.token = token;
  } else {
    navigateTo('/login');
  }
});

onMounted(() => {
  // Setiap kali pindah menu atau refresh web, periksa apakah akun masih ada di Database!
  authStore.periksaKeamanan()
})

// Fungsi untuk tombol hamburger
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const prosesLogout = () => {
  authStore.logout();
};

// Catatan: Fungsi editProfil (alert) sudah saya hapus karena kita menggunakan NuxtLink
</script>

<template>
  <div class="h-screen bg-slate-100 flex overflow-hidden">
    
    <div 
      v-if="isSidebarOpen" 
      @click="isSidebarOpen = false" 
      class="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
    ></div>

    <aside 
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col shadow-2xl transition-transform duration-300 ease-in-out',
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      ]"
    >
      <div class="p-6 flex items-center gap-3">
        <button @click="isSidebarOpen = false" class="text-slate-400 hover:text-white focus:outline-none transition transform hover:rotate-90">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
        <h2 class="text-xl font-black text-amber-500 tracking-wide mt-1">KASIR PINTAR</h2>
      </div>
      
      <nav class="space-y-2 flex flex-col px-6">
        <NuxtLink @click="window.innerWidth < 768 ? isSidebarOpen = false : null" to="/" class="px-4 py-3 rounded-lg hover:bg-slate-800 transition font-medium" active-class="bg-amber-600 hover:bg-amber-600 text-white shadow-md">
          📊 Dashboard
        </NuxtLink>
        <NuxtLink @click="window.innerWidth < 768 ? isSidebarOpen = false : null" to="/transaksi" class="px-4 py-3 rounded-lg hover:bg-slate-800 transition font-medium" active-class="bg-amber-600 hover:bg-amber-600 text-white shadow-md">
          🛒 Transaksi
        </NuxtLink>
        <NuxtLink @click="window.innerWidth < 768 ? isSidebarOpen = false : null" to="/produk" class="px-4 py-3 rounded-lg hover:bg-slate-800 transition font-medium" active-class="bg-amber-600 hover:bg-amber-600 text-white shadow-md">
          📦 Produk
        </NuxtLink>
        <NuxtLink @click="window.innerWidth < 768 ? isSidebarOpen = false : null" to="/rekap" class="px-4 py-3 rounded-lg hover:bg-slate-800 transition font-medium" active-class="bg-amber-600 hover:bg-amber-600 text-white shadow-md">
          📈 Rekap
        </NuxtLink>
        <NuxtLink @click="window.innerWidth < 768 ? isSidebarOpen = false : null" to="/user" class="px-4 py-3 rounded-lg hover:bg-slate-800 transition font-medium" active-class="bg-amber-600 hover:bg-amber-600 text-white shadow-md">
          👥 User
        </NuxtLink>
      </nav>
      
      <div class="p-6 border-t border-slate-800 mt-auto bg-slate-950/50">
        <div class="mb-4">
          <p class="text-xs text-slate-400 mb-1">Masuk sebagai:</p>
          <p class="font-bold text-lg text-emerald-400 truncate">{{ authStore.user?.nama }}</p>
          
          <NuxtLink @click="window.innerWidth < 768 ? isSidebarOpen = false : null" to="/profil" class="text-xs text-slate-300 hover:text-white hover:underline mt-1 flex items-center gap-1 transition focus:outline-none">
            ✏️ Edit Profil & Sandi
          </NuxtLink>
          
        </div>
        <button @click="prosesLogout" class="w-full bg-rose-600 hover:bg-rose-700 text-white py-3 rounded-xl font-bold transition shadow-lg focus:outline-none mt-2">
          🚪 Keluar
        </button>
      </div>
    </aside>

    <div 
      class="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out"
      :class="isSidebarOpen ? 'md:ml-64' : 'ml-0'"
    >
      <header class="bg-white shadow-sm border-b border-slate-200 p-4 flex items-center gap-4 sticky top-0 z-30 min-h-[70px]">
        <button v-if="!isSidebarOpen" @click="toggleSidebar" class="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition focus:outline-none">
          <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h1 v-if="!isSidebarOpen" class="font-bold text-slate-700">KASIR PINTAR</h1>
      </header>

      <main class="flex-1 overflow-y-auto">
        <slot />
      </main>
    </div>

  </div>
</template>