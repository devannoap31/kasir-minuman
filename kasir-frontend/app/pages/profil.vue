<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '~/stores/auth';

const config = useRuntimeConfig();
const authStore = useAuthStore();

// --- STATE UNTUK FORM PROFIL ---
const formProfil = ref({ nama: '', username: '' });
const statusProfil = ref('');
const isProfilLoading = ref(false);

// --- STATE UNTUK FORM PASSWORD ---
const formPassword = ref({ passwordLama: '', passwordBaru: '', konfirmasiPassword: '' });
const statusPassword = ref('');
const isPasswordLoading = ref(false);

// Isi nilai awal form profil dengan data user saat ini
onMounted(() => {
  formProfil.value.nama = authStore.user?.nama || '';
  formProfil.value.username = authStore.user?.username || '';
});

// --- FUNGSI UPDATE PROFIL ---
const simpanProfil = async () => {
  isProfilLoading.value = true;
  statusProfil.value = '⏳ Menyimpan...';

  try {
    const response = await $fetch(`${config.public.apiBase}/users/update-profil`, {
      method: 'PUT',
      body: {
        usernameLama: authStore.user.username, // Untuk mencari data di database
        namaBaru: formProfil.value.nama,
        usernameBaru: formProfil.value.username
      }
    });

    statusProfil.value = '✅ Profil berhasil diperbarui!';
    
    // Keajaibannya di sini: Perbarui data user di Pinia & Local Storage
    // Agar nama di Sidebar langsung berubah tanpa perlu login ulang!
    authStore.setUser(response.user, authStore.token);

    setTimeout(() => statusProfil.value = '', 3000);
  } catch (error) {
    statusProfil.value = `❌ Gagal: ${error.data?.message || 'Terjadi kesalahan'}`;
  } finally {
    isProfilLoading.value = false;
  }
};

// --- FUNGSI UPDATE PASSWORD ---
const gantiPassword = async () => {
  if (formPassword.value.passwordBaru !== formPassword.value.konfirmasiPassword) {
    statusPassword.value = '❌ Konfirmasi password baru tidak cocok!';
    return;
  }
  if (formPassword.value.passwordBaru.length < 6) {
    statusPassword.value = '❌ Password baru minimal 6 karakter!';
    return;
  }

  isPasswordLoading.value = true;
  statusPassword.value = '⏳ Memverifikasi & Menyimpan...';

  try {
    await $fetch(`${config.public.apiBase}/users/ubah-password`, {
      method: 'PUT',
      body: {
        username: authStore.user.username, 
        passwordLama: formPassword.value.passwordLama,
        passwordBaru: formPassword.value.passwordBaru
      }
    });

    statusPassword.value = '✅ Keamanan Ditingkatkan! Password berhasil diubah.';
    formPassword.value = { passwordLama: '', passwordBaru: '', konfirmasiPassword: '' };
    setTimeout(() => statusPassword.value = '', 3000);
  } catch (error) {
    statusPassword.value = `❌ Gagal: ${error.data?.message || 'Terjadi kesalahan'}`;
  } finally {
    isPasswordLoading.value = false;
  }
};
</script>

<template>
  <div class="p-4 md:p-8 min-h-screen bg-slate-50 flex flex-col items-center">
    
    <div class="w-full max-w-5xl bg-slate-900 rounded-2xl shadow-lg p-8 flex items-center gap-6 mb-8 mt-2">
      <div class="w-20 h-20 rounded-full bg-amber-500 flex items-center justify-center text-4xl shadow-lg border-4 border-slate-800 shrink-0">👤</div>
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-white tracking-wide">{{ authStore.user?.nama }}</h1>
        <p class="text-slate-400 font-medium mt-1 md:text-lg">@{{ authStore.user?.username }} &nbsp;•&nbsp; <span class="bg-indigo-500/20 text-indigo-300 px-2.5 py-1 rounded-md text-xs border border-indigo-500/30 uppercase font-bold">{{ authStore.user?.role }}</span></p>
      </div>
    </div>

    <div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-fit">
        <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">📝 Informasi Dasar</h2>
        
        <form @submit.prevent="simpanProfil" class="space-y-5">
          <div>
            <label class="block text-slate-700 font-semibold mb-1.5 text-sm">Nama Lengkap</label>
            <input v-model="formProfil.nama" type="text" required class="w-full border border-slate-300 rounded-xl p-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition">
          </div>
          <div>
            <label class="block text-slate-700 font-semibold mb-1.5 text-sm">Username</label>
            <input v-model="formProfil.username" type="text" required class="w-full border border-slate-300 rounded-xl p-3 focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-none transition text-slate-500">
            <p class="text-xs text-slate-400 mt-2">*Username digunakan untuk masuk ke dalam sistem.</p>
          </div>

          <button type="submit" :disabled="isProfilLoading" class="w-full bg-amber-600 text-white font-bold py-3.5 rounded-xl hover:bg-amber-700 transition shadow-md mt-2 disabled:bg-slate-300 disabled:cursor-not-allowed">
            {{ isProfilLoading ? 'Memproses...' : 'Simpan Perubahan Profil' }}
          </button>
          
          <div v-if="statusProfil" class="mt-4 p-3 rounded-xl text-sm font-bold text-center border" :class="statusProfil.includes('❌') ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'">
            {{ statusProfil }}
          </div>
        </form>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 h-fit">
        <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">🔒 Keamanan Akun</h2>
        
        <form @submit.prevent="gantiPassword" class="space-y-5">
          <div>
            <label class="block text-slate-700 font-semibold mb-1.5 text-sm">Password Lama</label>
            <input v-model="formPassword.passwordLama" type="password" required placeholder="Masukkan password saat ini..." class="w-full border border-slate-300 rounded-xl p-3 focus:border-slate-800 focus:ring-2 focus:ring-slate-200 outline-none transition">
          </div>
          <div>
            <label class="block text-slate-700 font-semibold mb-1.5 text-sm">Password Baru</label>
            <input v-model="formPassword.passwordBaru" type="password" required placeholder="Minimal 6 karakter..." class="w-full border border-slate-300 rounded-xl p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition">
          </div>
          <div>
            <label class="block text-slate-700 font-semibold mb-1.5 text-sm">Konfirmasi Password Baru</label>
            <input v-model="formPassword.konfirmasiPassword" type="password" required placeholder="Ketik ulang password baru..." class="w-full border border-slate-300 rounded-xl p-3 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition">
          </div>

          <button type="submit" :disabled="isPasswordLoading" class="w-full bg-slate-800 text-white font-bold py-3.5 rounded-xl hover:bg-slate-900 transition shadow-md mt-2 disabled:bg-slate-300 disabled:cursor-not-allowed">
            {{ isPasswordLoading ? 'Memproses...' : 'Perbarui Kata Sandi' }}
          </button>
          
          <div v-if="statusPassword" class="mt-4 p-3 rounded-xl text-sm font-bold text-center border" :class="statusPassword.includes('❌') ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-emerald-50 text-emerald-600 border-emerald-200'">
            {{ statusPassword }}
          </div>
        </form>
      </div>

    </div>
  </div>
</template>