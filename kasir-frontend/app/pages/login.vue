<script setup>
import { ref } from 'vue';
import { useAuthStore } from '~/stores/auth';

// Nonaktifkan layout default agar sidebar tidak muncul di halaman login
definePageMeta({
  layout: false
});

const config = useRuntimeConfig();
const authStore = useAuthStore();
const router = useRouter();

const formLogin = ref({ username: '', password: '' });
const errorMessage = ref('');
const isLoading = ref(false);

const prosesLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  
  try {
    const response = await $fetch(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: formLogin.value
    });
    
    // Simpan data token dan user ke Pinia & LocalStorage
    authStore.setUser(response.user, response.token);
    
    // Arahkan masuk ke Dashboard
    router.push('/');
  } catch (error) {
    // Tangkap pesan error dari backend (misal: "Password salah")
    errorMessage.value = error.data?.message || 'Terjadi kesalahan pada server!';
  } finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-100 flex items-center justify-center p-4">
    <div class="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
      
      <div class="bg-slate-900 p-8 text-center">
        <h1 class="text-3xl font-black text-amber-500 tracking-wider">KASIR PINTAR</h1>
        <p class="text-slate-400 mt-2 text-sm">Silakan masuk untuk mengelola sistem.</p>
      </div>

      <div class="p-8">
        <form @submit.prevent="prosesLogin" class="space-y-5">
          
          <div>
            <label class="block text-slate-700 font-bold mb-2 text-sm">Username</label>
            <div class="relative">
              <span class="absolute left-3 top-3 text-slate-400">👤</span>
              <input 
                v-model="formLogin.username" 
                type="text" 
                required 
                placeholder="Masukkan username..." 
                class="w-full border-2 border-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:border-amber-500 focus:ring-0 outline-none transition font-medium text-slate-700"
              >
            </div>
          </div>

          <div>
            <label class="block text-slate-700 font-bold mb-2 text-sm">Password</label>
            <div class="relative">
              <span class="absolute left-3 top-3 text-slate-400">🔒</span>
              <input 
                v-model="formLogin.password" 
                type="password" 
                required 
                placeholder="Masukkan kata sandi..." 
                class="w-full border-2 border-slate-200 rounded-xl py-2.5 pl-10 pr-4 focus:border-amber-500 focus:ring-0 outline-none transition font-medium text-slate-700"
              >
            </div>
          </div>

          <div v-if="errorMessage" class="bg-rose-50 border border-rose-200 text-rose-600 text-sm font-bold p-3 rounded-lg text-center">
            {{ errorMessage }}
          </div>

          <button 
            type="submit" 
            :disabled="isLoading"
            class="w-full bg-amber-600 text-white font-bold py-3.5 rounded-xl hover:bg-amber-700 transition shadow-lg mt-4 disabled:bg-slate-300 disabled:cursor-not-allowed"
          >
            {{ isLoading ? '⏳ Memeriksa...' : 'Masuk ke Sistem ➔' }}
          </button>
          
        </form>
      </div>
      
    </div>
  </div>
</template>