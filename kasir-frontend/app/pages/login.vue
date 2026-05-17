<script setup>
definePageMeta({ layout: false }); // Mematikan sidebar untuk halaman ini
import { useAuthStore } from '~/stores/auth'; // Mengambil fungsi dari Pinia

const config = useRuntimeConfig();
const authStore = useAuthStore();

// Wadah form login
const form = ref({
  nama: '',
  password: ''
});

const pesanError = ref('');

// Mengambil daftar user dari backend untuk dropdown
const { data: listUser, pending } = await useFetch(`${config.public.apiBase}/auth/users`);

// Fungsi saat tombol login ditekan
const prosesLogin = async () => {
  pesanError.value = ''; // Reset pesan error
  
  if (!form.value.nama) {
    pesanError.value = 'Silakan pilih nama kasir/admin terlebih dahulu!';
    return;
  }

  try {
    const response = await $fetch(`${config.public.apiBase}/auth/login`, {
      method: 'POST',
      body: form.value
    });
    
    // Jika berhasil, simpan token dan data user ke Pinia Store
    authStore.setUser(response.user, response.token);
    
    // Pindah ke halaman utama (nanti kita ubah ke /dashboard)
    navigateTo('/');
  } catch (error) {
    // Tangkap pesan error dari backend (misal: password salah)
    pesanError.value = error.data?.message || 'Terjadi kesalahan saat login';
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-200 flex justify-center items-center p-4">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm border-t-4 border-amber-600">
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-extrabold text-amber-800">Kasir Pintar</h1>
        <p class="text-slate-500 mt-1">Silakan masuk untuk memulai</p>
      </div>

      <form @submit.prevent="prosesLogin" class="space-y-5">
        
        <div>
          <label class="block text-slate-700 font-bold mb-2">Nama Pengguna</label>
          <div v-if="pending" class="text-sm text-slate-500 italic">Memuat daftar nama...</div>
          <select 
            v-else
            v-model="form.nama" 
            class="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 outline-none bg-slate-50"
          >
            <option value="" disabled>-- Pilih Nama Anda --</option>
            <option v-for="user in listUser" :key="user._id" :value="user.nama">
              {{ user.nama }} ({{ user.role }})
            </option>
          </select>
        </div>

        <div>
          <label class="block text-slate-700 font-bold mb-2">Kata Sandi</label>
          <input 
            v-model="form.password" 
            type="password" 
            required 
            class="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-amber-500 outline-none bg-slate-50" 
            placeholder="Masukkan kata sandi..."
          >
        </div>

        <p v-if="pesanError" class="text-red-500 text-sm font-semibold text-center bg-red-50 p-2 rounded-lg">
          ❌ {{ pesanError }}
        </p>

        <button type="submit" class="w-full bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition transform hover:scale-[1.02] shadow-md mt-4">
          Masuk Sekarang
        </button>

      </form>
      
    </div>
  </div>
</template>