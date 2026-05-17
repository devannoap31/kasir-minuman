<script setup>
import { useAuthStore } from '~/stores/auth';
import { onMounted, ref, computed } from 'vue';

const config = useRuntimeConfig();
const authStore = useAuthStore();

// 1 BARIS SAKTI: Mengambil data dan polling dari composable
const { listProduk, pending } = useProdukData();
const { searchQuery, dataTampil: listProdukTampil } = useSearch(listProduk, 'nama_produk', 1000);

const isDesktop = ref(true);

onMounted(() => {
  isDesktop.value = window.innerWidth >= 768;
  window.addEventListener('resize', () => { isDesktop.value = window.innerWidth >= 768; });
});

// Logika Drag Layout (Sama persis)
const cartWidth = ref(400); 
const isDragging = ref(false);

const startDrag = () => {
  isDragging.value = true;
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
  document.body.style.cursor = 'col-resize'; 
  document.body.style.userSelect = 'none'; 
};

const handleDrag = (e) => {
  if (!isDragging.value) return;
  let newWidth = window.innerWidth - e.clientX;
  if (newWidth < 300) newWidth = 300;
  if (newWidth > 600) newWidth = 600;
  cartWidth.value = newWidth;
};

const stopDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.body.style.cursor = '';
  document.body.style.userSelect = '';
};

// Logika Keranjang (Sama persis)
const keranjang = ref([]);
const showModalBayar = ref(false);
const showMobileCart = ref(false);
const uangBayar = ref('');
const statusTransaksi = ref('');

const totalHarga = computed(() => keranjang.value.reduce((acc, item) => acc + (item.harga * item.jumlah), 0));
const kembalian = computed(() => (uangBayar.value || 0) - totalHarga.value);
const totalItemKeranjang = computed(() => keranjang.value.reduce((acc, item) => acc + item.jumlah, 0));

const tambahKeKeranjang = (produk) => {
  if (!produk.ketersediaan) return; 
  const itemAda = keranjang.value.find(item => item._id === produk._id);
  if (itemAda) itemAda.jumlah++; else keranjang.value.push({ ...produk, jumlah: 1 });
};

const kurangiItem = (produkId) => {
  const index = keranjang.value.findIndex(item => item._id === produkId);
  if (index !== -1) {
    if (keranjang.value[index].jumlah > 1) keranjang.value[index].jumlah--;
    else {
      keranjang.value.splice(index, 1);
      if (keranjang.value.length === 0) showMobileCart.value = false;
    }
  }
};

const prosesPembayaran = async () => {
  if (uangBayar.value < totalHarga.value) return alert("Uang pembayaran kurang!");
  const dataTransaksi = {
    nama_kasir: authStore.user?.nama || "Kasir Tidak Dikenal",
    pesanan: keranjang.value.map(item => ({
      nama_produk: item.nama_produk, harga: item.harga,
      jumlah: item.jumlah, subtotal: item.harga * item.jumlah
    })),
    total_harga: totalHarga.value, uang_bayar: uangBayar.value, kembalian: kembalian.value
  };

  try {
    await $fetch(`${config.public.apiBase}/transaksi`, { method: 'POST', body: dataTransaksi });
    statusTransaksi.value = '✅ Transaksi Berhasil!';
    setTimeout(() => {
      statusTransaksi.value = ''; keranjang.value = []; uangBayar.value = '';
      showModalBayar.value = false; showMobileCart.value = false;
    }, 2000);
  } catch (error) { alert("Terjadi kesalahan."); }
};
</script>

<template>
  <div class="flex flex-col md:flex-row h-full bg-slate-100 overflow-hidden relative">
    
    <div class="flex-1 w-full flex flex-col h-full overflow-hidden">
      <div class="p-4 md:p-6 pb-4 bg-slate-100 shrink-0 z-10 border-b border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
        <h2 class="text-xl md:text-2xl font-bold text-slate-800 w-full sm:w-auto">Menu Minuman</h2>
        <SearchBar v-model="searchQuery" placeholder="Cari menu..." />
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
        <div v-if="pending" class="text-center py-10">Memuat menu...</div>
        <div v-else-if="listProdukTampil.length === 0" class="text-center bg-white p-10 rounded-xl border-dashed border-2 border-slate-300 text-slate-500">
          {{ searchQuery ? 'Menu tidak ditemukan.' : 'Belum ada menu.' }}
        </div>

        <div v-else class="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
          <CardMenu 
            v-for="item in listProdukTampil" 
            :key="item._id" 
            :item="item" 
            :isInteractive="true" 
            @click="tambahKeKeranjang(item)" 
          />
        </div>
      </div>
    </div>

    <div class="hidden md:flex w-2 bg-slate-200 hover:bg-amber-400 cursor-col-resize justify-center items-center z-20 group relative transition-colors" @mousedown="startDrag">
      <div class="flex flex-col gap-1 opacity-50 group-hover:opacity-100">
        <div class="w-1 h-1 rounded-full bg-slate-500 group-hover:bg-white"></div>
        <div class="w-1 h-1 rounded-full bg-slate-500 group-hover:bg-white"></div>
        <div class="w-1 h-1 rounded-full bg-slate-500 group-hover:bg-white"></div>
      </div>
    </div>

    <div :class="[
      'bg-white flex flex-col shadow-2xl z-40 transition-transform duration-300 ease-in-out',
      'md:relative md:flex md:h-full border-l border-slate-200 shrink-0', 
      showMobileCart ? 'fixed inset-0 h-full' : 'hidden md:flex'
    ]"
    :style="isDesktop ? { width: cartWidth + 'px' } : {}"
    >
      <div class="p-4 md:p-6 border-b border-slate-100 shrink-0 flex justify-between items-center bg-white">
        <h2 class="text-xl md:text-2xl font-bold text-slate-800">Pesanan Saat Ini</h2>
        <button @click="showMobileCart = false" class="md:hidden text-slate-500 hover:text-rose-500 p-2 font-bold text-lg">✕</button>
      </div>
      
      <div class="p-4 md:p-6 flex-1 overflow-y-auto space-y-3 bg-slate-50">
        <p v-if="keranjang.length === 0" class="text-slate-500 text-center italic mt-10">Belum ada pesanan</p>
        <div v-for="(item, index) in keranjang" :key="index" class="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
          <div class="flex-1 pr-2">
            <p class="font-semibold text-slate-700 text-sm leading-tight mb-1">{{ item.nama_produk }}</p>
            <p class="text-xs text-slate-500">Rp {{ item.harga.toLocaleString('id-ID') }}</p>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <button @click="kurangiItem(item._id)" class="w-8 h-8 flex items-center justify-center bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 font-bold transition text-sm shadow-sm">-</button>
            <span class="font-bold text-slate-700 w-5 text-center text-sm">{{ item.jumlah }}</span>
            <button @click="tambahKeKeranjang(item)" class="w-8 h-8 flex items-center justify-center bg-amber-100 rounded-full text-amber-700 hover:bg-amber-200 font-bold transition text-sm shadow-sm">+</button>
          </div>
        </div>
      </div>

      <div class="p-4 md:p-6 bg-white border-t border-slate-200 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-semibold text-slate-600">Total Tagihan</span>
          <span class="text-2xl font-black text-amber-700">Rp {{ totalHarga.toLocaleString('id-ID') }}</span>
        </div>
        <button @click="showModalBayar = true" :disabled="keranjang.length === 0" class="w-full bg-amber-600 text-white font-bold py-4 rounded-xl hover:bg-amber-700 transition disabled:bg-slate-300 disabled:cursor-not-allowed shadow-lg text-lg">
          Bayar Sekarang
        </button>
      </div>
    </div>

    <div v-if="!showMobileCart && keranjang.length > 0" class="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-10px_20px_rgba(0,0,0,0.1)] p-4 border-t border-slate-200 flex justify-between items-center z-30">
      <div>
        <p class="text-xs font-semibold text-slate-500 mb-0.5">{{ totalItemKeranjang }} Item Pesanan</p>
        <p class="font-black text-amber-700 text-lg leading-none">Rp {{ totalHarga.toLocaleString('id-ID') }}</p>
      </div>
      <button @click="showMobileCart = true" class="bg-slate-800 text-white px-6 py-2.5 rounded-xl font-bold shadow-md flex items-center gap-2 active:scale-95 transition-transform">
        <span>Lihat Keranjang</span>
        <span class="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">{{ totalItemKeranjang }}</span>
      </button>
    </div>

    <div v-if="showModalBayar" class="fixed inset-0 bg-slate-900/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm">
        <h2 class="text-xl font-bold text-slate-800 mb-4">Proses Pembayaran</h2>
        <div class="mb-4 bg-amber-50 p-4 rounded-xl">
          <p class="text-slate-500 text-sm mb-1">Total Tagihan:</p>
          <p class="text-3xl font-black text-amber-700">Rp {{ totalHarga.toLocaleString('id-ID') }}</p>
        </div>
        <div class="mb-4">
          <label class="block text-slate-700 font-bold mb-2">Uang Diterima (Rp)</label>
          <input v-model="uangBayar" type="number" class="w-full border-2 border-slate-300 rounded-xl p-3 focus:border-amber-500 focus:ring-0 outline-none text-xl font-bold transition">
        </div>
        <div class="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-100">
          <p class="text-slate-500 text-sm mb-1">Kembalian:</p>
          <p class="text-2xl font-bold" :class="kembalian < 0 ? 'text-rose-500' : 'text-emerald-600'">
            Rp {{ kembalian.toLocaleString('id-ID') }}
          </p>
        </div>
        <p v-if="statusTransaksi" class="text-center font-bold text-emerald-600 mb-4">{{ statusTransaksi }}</p>
        <div class="flex gap-3">
          <button @click="showModalBayar = false" class="flex-1 bg-slate-200 text-slate-700 font-bold py-3 rounded-xl hover:bg-slate-300 transition">Batal</button>
          <button @click="prosesPembayaran" class="flex-1 bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition shadow-md">Selesai</button>
        </div>
      </div>
    </div>

  </div>
</template>