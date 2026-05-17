<script setup>
import { ref } from 'vue';
const config = useRuntimeConfig();

// 1 BARIS SAKTI: Mengambil data dan polling dari composable
const { listProduk, pending, ambilDataProduk } = useProdukData();

// Memanggil fitur pencarian debounce
const { searchQuery, dataTampil: listProdukTampil } = useSearch(listProduk, 'nama_produk', 1000);

// State Modal (Tetap sama)
const showModalTambah = ref(false);
const statusTambah = ref('');
const formTambah = ref({ nama_produk: '', harga: '', kategori: 'Minuman Dingin', ketersediaan: true });
const fileTambah = ref(null);

const showModalUpdate = ref(false);
const statusUpdate = ref('');
const formUpdate = ref({ _id: '', nama_produk: '', harga: '', kategori: '', ketersediaan: true });
const fileUpdate = ref(null);

const tangkapGambarTambah = (e) => fileTambah.value = e.target.files[0];
const tangkapGambarUpdate = (e) => fileUpdate.value = e.target.files[0];

const simpanProduk = async () => {
  statusTambah.value = '⏳ Menyimpan...';
  const formData = new FormData();
  formData.append('nama_produk', formTambah.value.nama_produk);
  formData.append('harga', formTambah.value.harga);
  formData.append('kategori', formTambah.value.kategori);
  formData.append('ketersediaan', formTambah.value.ketersediaan);
  if (fileTambah.value) formData.append('gambar', fileTambah.value);

  try {
    await $fetch(`${config.public.apiBase}/produk`, { method: 'POST', body: formData });
    statusTambah.value = '✅ Menu berhasil ditambah!';
    formTambah.value.nama_produk = ''; formTambah.value.harga = ''; 
    fileTambah.value = null; document.getElementById('inputGambarTambah').value = '';
    await ambilDataProduk();
    searchQuery.value = ''; 
    setTimeout(() => statusTambah.value = '', 1000);
  } catch (error) { statusTambah.value = '❌ Gagal menyimpan!'; }
};

const bukaModalUpdate = (item) => {
  formUpdate.value = { ...item }; fileUpdate.value = null; statusUpdate.value = ''; showModalUpdate.value = true;
};

const simpanUpdate = async () => {
  statusUpdate.value = '⏳ Mengupdate...';
  const formData = new FormData();
  formData.append('nama_produk', formUpdate.value.nama_produk);
  formData.append('harga', formUpdate.value.harga);
  formData.append('kategori', formUpdate.value.kategori);
  formData.append('ketersediaan', formUpdate.value.ketersediaan);
  if (fileUpdate.value) formData.append('gambar', fileUpdate.value);

  try {
    await $fetch(`${config.public.apiBase}/produk/${formUpdate.value._id}`, { method: 'PUT', body: formData });
    statusUpdate.value = '✅ Update berhasil!';
    await ambilDataProduk();
    searchQuery.value = ''; 
    setTimeout(() => { showModalUpdate.value = false; }, 1000);
  } catch (error) { statusUpdate.value = '❌ Gagal update!'; }
};

const hapusProduk = async (id) => {
  if (!confirm('Hapus menu ini secara permanen?')) return;
  try {
    await $fetch(`${config.public.apiBase}/produk/${id}`, { method: 'DELETE' });
    await ambilDataProduk();
    searchQuery.value = ''; 
  } catch (error) { alert("Gagal menghapus produk!"); }
};
</script>

<template>
  <div class="relative p-4 md:p-8 min-h-screen">
    
    <div class="flex flex-col md:flex-row justify-between items-center bg-slate-100/90 backdrop-blur-md sticky top-0 z-20 py-4 mb-6 border-b border-slate-200 gap-4">
      <h1 class="text-2xl md:text-3xl font-bold text-slate-800 w-full md:w-auto text-center md:text-left">Manajemen Produk</h1>
      
      <div class="flex items-center gap-3 w-full md:w-auto">
        <SearchBar v-model="searchQuery" placeholder="Cari menu..." />
        
        <button @click="showModalTambah = true" class="bg-amber-600 text-white font-bold px-4 py-2 rounded-xl shadow-lg hover:bg-amber-700 hover:shadow-xl transition flex items-center justify-center gap-2 flex-shrink-0">
          <span class="text-xl leading-none">+</span> <span class="hidden md:inline">Tambah</span>
        </button>
      </div>
    </div>

    <div v-if="pending" class="text-center text-slate-500 py-10">Memuat data...</div>
    <div v-else-if="listProdukTampil.length === 0" class="text-center bg-white p-10 rounded-xl border-dashed border-2 border-slate-300 text-slate-500">
      {{ searchQuery ? 'Menu tidak ditemukan.' : 'Belum ada menu.' }}
    </div>
    
    <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
      <CardMenu v-for="item in listProdukTampil" :key="item._id" :item="item">
        <div class="mt-auto grid grid-cols-2 gap-1 md:gap-2 pt-3">
          <button @click.stop="bukaModalUpdate(item)" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold py-1.5 md:py-2 rounded-lg transition text-[10px] md:text-sm flex items-center justify-center">
            ✏️ <span class="hidden sm:inline ml-1">Edit</span>
          </button>
          <button @click.stop="hapusProduk(item._id)" class="bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-1.5 md:py-2 rounded-lg transition text-[10px] md:text-sm flex items-center justify-center">
            🗑️ <span class="hidden sm:inline ml-1">Hapus</span>
          </button>
        </div>
      </CardMenu>
    </div>

    <div v-if="showModalTambah" class="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
          <h2 class="text-xl font-bold text-slate-800">Tambah Menu Baru</h2>
          <button @click="showModalTambah = false" class="text-slate-400 hover:text-rose-500 font-bold text-xl">✕</button>
        </div>
        <div class="p-6 overflow-y-auto">
          <form @submit.prevent="simpanProduk" class="space-y-4">
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Nama Menu</label>
              <input v-model="formTambah.nama_produk" type="text" required class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 outline-none">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-700 font-semibold mb-1">Harga (Rp)</label>
                <input v-model="formTambah.harga" type="number" required class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 outline-none">
              </div>
              <div>
                <label class="block text-slate-700 font-semibold mb-1">Ketersediaan</label>
                <select v-model="formTambah.ketersediaan" class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 outline-none">
                  <option :value="true">Tersedia</option>
                  <option :value="false">Habis</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Kategori</label>
              <select v-model="formTambah.kategori" class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 outline-none">
                <option value="Minuman Dingin">Minuman Dingin</option>
                <option value="Minuman Panas">Minuman Panas</option>
                <option value="Makanan">Makanan</option>
                <option value="Topping">Topping</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Foto Menu</label>
              <input id="inputGambarTambah" type="file" accept="image/*" @change="tangkapGambarTambah" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-50 file:text-amber-700 cursor-pointer">
            </div>
            <button type="submit" class="w-full bg-amber-600 text-white font-bold py-3 rounded-lg hover:bg-amber-700 transition mt-4">Simpan Menu</button>
            <p v-if="statusTambah" class="text-center font-bold mt-2" :class="statusTambah.includes('❌') ? 'text-rose-500' : 'text-emerald-600'">{{ statusTambah }}</p>
          </form>
        </div>
      </div>
    </div>

    <div v-if="showModalUpdate" class="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div class="flex justify-between items-center p-6 border-b border-slate-100 bg-indigo-50">
          <h2 class="text-xl font-bold text-indigo-900">Edit Menu</h2>
          <button @click="showModalUpdate = false" class="text-slate-400 hover:text-rose-500 font-bold text-xl">✕</button>
        </div>
        <div class="p-6 overflow-y-auto">
          <form @submit.prevent="simpanUpdate" class="space-y-4">
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Nama Menu</label>
              <input v-model="formUpdate.nama_produk" type="text" required class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-slate-700 font-semibold mb-1">Harga (Rp)</label>
                <input v-model="formUpdate.harga" type="number" required class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none">
              </div>
              <div>
                <label class="block text-slate-700 font-semibold mb-1">Ketersediaan</label>
                <select v-model="formUpdate.ketersediaan" class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option :value="true">Tersedia</option>
                  <option :value="false">Habis</option>
                </select>
              </div>
            </div>
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Kategori</label>
              <select v-model="formUpdate.kategori" class="w-full border border-slate-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none">
                <option value="Minuman Dingin">Minuman Dingin</option>
                <option value="Minuman Panas">Minuman Panas</option>
                <option value="Makanan">Makanan</option>
                <option value="Topping">Topping</option>
              </select>
            </div>
            <div>
              <label class="block text-slate-700 font-semibold mb-1">Ganti Foto Baru (Opsional)</label>
              <input type="file" accept="image/*" @change="tangkapGambarUpdate" class="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 cursor-pointer">
            </div>
            <button type="submit" class="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition mt-4">Simpan Perubahan</button>
            <p v-if="statusUpdate" class="text-center font-bold mt-2" :class="statusUpdate.includes('❌') ? 'text-rose-500' : 'text-emerald-600'">{{ statusUpdate }}</p>
          </form>
        </div>
      </div>
    </div>

  </div>
</template>