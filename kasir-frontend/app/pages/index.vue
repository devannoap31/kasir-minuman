<script setup>
import { onMounted, ref, computed } from 'vue';

const config = useRuntimeConfig();

// State penyimpanan data transaksi dari backend
const listTransaksi = ref([]);
const pending = ref(true);

// Fungsi mengambil data transaksi
const ambilDataTransaksi = async () => {
  pending.value = true;
  try {
    listTransaksi.value = await $fetch(`${config.public.apiBase}/transaksi`);
  } catch (error) {
    console.error("Gagal mengambil data transaksi:", error);
  } finally {
    pending.value = false;
  }
};

onMounted(() => {
  ambilDataTransaksi();
});

// --- LOGIKA HITUNG STATISTIK (COMPUTED) ---

// 1. Total Seluruh Pendapatan
const totalPendapatan = computed(() => {
  return listTransaksi.value.reduce((acc, item) => acc + item.total_harga, 0);
});

// 2. Total Jumlah Transaksi
const jumlahTransaksi = computed(() => listTransaksi.value.length);

// 3. Rata-rata Nilai Transaksi per Pelanggan
const rataRataTransaksi = computed(() => {
  if (jumlahTransaksi.value === 0) return 0;
  return totalPendapatan.value / jumlahTransaksi.value;
});

// 4. Ambil 5 Transaksi Terakhir untuk Tabel
const transaksiTerbaru = computed(() => {
  return listTransaksi.value.slice(0, 5);
});

// 5. Logika Grafik: Mengelompokkan omzet berdasarkan tanggal (7 Data Terakhir)
const dataGrafik = computed(() => {
  const kelompok = {};
  
  // Ambil data dan kelompokkan berdasarkan tanggal singkat (DD/MM)
  listTransaksi.value.forEach(t => {
    const tanggal = new Date(t.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    kelompok[tanggal] = (kelompok[tanggal] || 0) + t.total_harga;
  });

  // Ubah ke bentuk Array dan ambil maksimal 7 hari terakhir, lalu balik urutannya agar kronologis
  const arrayData = Object.keys(kelompok).map(tgl => ({
    tanggal: tgl,
    total: kelompok[tgl]
  }));
  
  return arrayData.slice(-7);
});

// Mencari nilai tertinggi di grafik untuk menentukan skala tinggi batang CSS
const omzetTertinggi = computed(() => {
  if (dataGrafik.value.length === 0) return 1;
  return Math.max(...dataGrafik.value.map(d => d.total));
});
</script>

<template>
  <div class="p-4 md:p-8 bg-slate-50 min-h-screen">
    
    <div class="mb-8 text-center md:text-left">
      <h1 class="text-3xl font-black text-slate-800 tracking-tight">Ringkasan Bisnis</h1>
      <p class="text-slate-500 mt-1">Pantau perkembangan penjualan tokomu secara real-time.</p>
    </div>

    <div v-if="pending" class="text-center py-20 text-slate-500 font-medium animate-pulse">
      ⏳ Menghitung statistik tokomu...
    </div>

    <div v-else class="space-y-8">
      
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-5 transition hover:shadow-md">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-2xl shrink-0">💰</div>
          <div class="min-w-0">
            <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Pendapatan</p>
            <p class="text-xl md:text-2xl font-black text-slate-800 truncate">Rp {{ totalPendapatan.toLocaleString('id-ID') }}</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-5 transition hover:shadow-md">
          <div class="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-2xl shrink-0">📄</div>
          <div class="min-w-0">
            <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Transaksi</p>
            <p class="text-xl md:text-2xl font-black text-slate-800 truncate">{{ jumlahTransaksi }} Nota</p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200/80 flex items-center gap-5 transition hover:shadow-md">
          <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-2xl shrink-0">📊</div>
          <div class="min-w-0">
            <p class="text-sm font-bold text-slate-400 uppercase tracking-wider mb-0.5">Rata-rata Belanja</p>
            <p class="text-xl md:text-2xl font-black text-slate-800 truncate">Rp {{ Math.round(rataRataTransaksi).toLocaleString('id-ID') }}</p>
          </div>
        </div>

      </div>

      <div class="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <h2 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">📈 Tren Omzet Penjualan Harian</h2>
        
        <div v-if="dataGrafik.length === 0" class="text-center py-10 text-slate-400 italic">Belum ada data grafik harian.</div>
        
        <div v-else class="flex justify-between h-48 md:h-64 pt-6 px-2 md:px-10 border-b border-slate-200 gap-2">
          
          <div v-for="(data, idx) in dataGrafik" :key="idx" class="flex flex-col items-center justify-end flex-1 h-full group relative pb-1">
            
            <div class="absolute -top-6 md:-top-8 scale-0 group-hover:scale-100 bg-slate-800 text-white text-[10px] md:text-xs font-bold py-1 px-2 rounded shadow-md transition-all z-20 whitespace-nowrap">
              Rp {{ data.total.toLocaleString('id-ID') }}
            </div>
            
            <div class="w-full flex items-end justify-center flex-1">
              <div 
                class="w-full sm:w-12 bg-amber-500 rounded-t-lg transition-all duration-500 group-hover:bg-amber-600 shadow-sm"
                :style="{ height: `${(data.total / omzetTertinggi) * 100}%` }"
              ></div>
            </div>
            
            <span class="text-[10px] md:text-xs font-semibold text-slate-400 mt-2 whitespace-nowrap">{{ data.tanggal }}</span>
          </div>

        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">⏱️ 5 Transaksi Terakhir</h2>
          <NuxtLink to="/rekap" class="text-sm font-bold text-amber-600 hover:text-amber-700 hover:underline">Lihat Semua ➔</NuxtLink>
        </div>

        <div v-if="transaksiTerbaru.length === 0" class="p-8 text-center text-slate-400 italic">Belum ada catatan transaksi yang masuk.</div>
        
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-400 text-xs font-bold uppercase border-b border-slate-200">
                <th class="p-4">Waktu Transaksi</th>
                <th class="p-4">Nama Kasir</th>
                <th class="p-4">Detail Belanja</th>
                <th class="p-4 text-right">Total Bayar</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100 text-sm">
              <tr v-for="t in transaksiTerbaru" :key="t._id" class="hover:bg-slate-50/50 transition">
                <td class="p-4 font-medium text-slate-600">
                  {{ new Date(t.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) }}
                </td>
                <td class="p-4">
                  <span class="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-200/50">
                    👤 {{ t.nama_kasir }}
                  </span>
                </td>
                <td class="p-4 text-slate-500 max-w-xs truncate">
                  {{ t.pesanan.map(p => `${p.nama_produk} (${p.jumlah}x)`).join(', ') }}
                </td>
                <td class="p-4 text-right font-black text-slate-700 text-base">
                  Rp {{ t.total_harga.toLocaleString('id-ID') }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>