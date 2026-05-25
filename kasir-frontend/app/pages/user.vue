<script setup>
import { onMounted, ref } from 'vue';

const config = useRuntimeConfig();

const listUser = ref([]);
const pending = ref(true);

const showModal = ref(false);
const statusTambah = ref('');
// Set default role langsung ke 'Admin'
const formUser = ref({ nama: '', username: '', password: '', role: 'Admin' });

const ambilDataUser = async () => {
  pending.value = true;
  try {
    listUser.value = await $fetch(`${config.public.apiBase}/users`);
  } catch (error) {
    console.error(error);
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  ambilDataUser();
});

const simpanUser = async () => {
  statusTambah.value = '⏳ Menyimpan...';
  try {
    await $fetch(`${config.public.apiBase}/users`, { 
      method: 'POST', 
      body: formUser.value 
    });
    
    statusTambah.value = '✅ Akun Admin berhasil dibuat!';
    formUser.value = { nama: '', username: '', password: '', role: 'Admin' };
    await ambilDataUser(); 
    
    setTimeout(() => { 
      statusTambah.value = ''; 
      showModal.value = false; 
    }, 1000);
  } catch (error) {
    statusTambah.value = '❌ Gagal! Mungkin username sudah dipakai.';
  }
};

const hapusUser = async (id, nama) => {
  if (!confirm(`Yakin ingin menghapus akun Admin ${nama}?`)) return;
  try {
    await $fetch(`${config.public.apiBase}/users/${id}`, { method: 'DELETE' });
    await ambilDataUser();
  } catch (error) {
    alert("Gagal menghapus user!");
  }
};
</script>

<template>
  <div class="p-4 md:p-8 min-h-screen bg-slate-50">
    
    <div class="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Manajemen Akun</h1>
        <p class="text-slate-500 mt-1">Kelola akses pengguna sistem kasir (Semua pengguna adalah Admin).</p>
      </div>
      <button @click="showModal = true" class="bg-indigo-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-indigo-700 transition flex items-center gap-2 shadow-md shrink-0 w-full md:w-auto justify-center">
        <span><Icon name="bi:person-plus-fill" class="mr-2"/> Tambah Akun</span>
      </button>
    </div>

    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div v-if="pending" class="text-center py-20 text-slate-500 animate-pulse">Memuat data pengguna...</div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 text-slate-600 text-sm font-bold uppercase border-b border-slate-200">
              <th class="p-4">Nama Lengkap</th>
              <th class="p-4">Username</th>
              <th class="p-4">Peran (Role)</th>
              <th class="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 text-sm">
            <tr v-for="user in listUser" :key="user._id" class="hover:bg-slate-50 transition">
              <td class="p-4 font-bold text-slate-700 flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-black">
                  {{ user.nama.charAt(0).toUpperCase() }}
                </div>
                {{ user.nama }}
              </td>
              <td class="p-4 text-slate-500">@{{ user.username }}</td>
              <td class="p-4">
                <span class="px-3 py-1 rounded-full text-xs font-bold border bg-indigo-50 text-indigo-700 border-indigo-200">
                  {{ user.role }}
                </span>
              </td>
              <td class="p-4 text-center">
                <button @click="hapusUser(user._id, user.nama)" class="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-1.5 px-3 rounded-lg transition text-xs">
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
        <div class="flex justify-between items-center p-6 border-b border-slate-100 bg-indigo-50">
          <h2 class="text-xl font-bold text-indigo-900">Tambah Akun Admin</h2>
          <button @click="showModal = false" class="text-slate-400 hover:text-rose-500 font-bold text-xl">✕</button>
        </div>
        
        <div class="p-6">
          <form @submit.prevent="simpanUser" class="space-y-4">
            <div>
              <label class="block text-slate-700 font-semibold mb-1 text-sm">Nama Lengkap</label>
              <input v-model="formUser.nama" type="text" required placeholder="Contoh: Budi Santoso" class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
            <div>
              <label class="block text-slate-700 font-semibold mb-1 text-sm">Username</label>
              <input v-model="formUser.username" type="text" required placeholder="Gunakan huruf kecil tanpa spasi" class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
            <div>
              <label class="block text-slate-700 font-semibold mb-1 text-sm">Password</label>
              <input v-model="formUser.password" type="password" required placeholder="Minimal 6 karakter" class="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
            
            <button type="submit" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition mt-6 shadow-md">
              Buat Akun
            </button>
            <p v-if="statusTambah" class="text-center font-bold mt-3 text-sm" :class="statusTambah.includes('❌') ? 'text-rose-500' : 'text-emerald-600'">
              {{ statusTambah }}
            </p>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>