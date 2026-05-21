<script setup>
import { onMounted, ref, computed, nextTick } from 'vue';

const config = useRuntimeConfig();

const listTransaksi = ref([]);
const pending = ref(true);
const filterWaktu = ref('semua');
const isGeneratingPDF = ref(false); // State baru untuk efek loading tombol
const showKopSurat = ref(false); // State untuk memunculkan kop surat saat dicapture PDF

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

const transaksiTerfilter = computed(() => {
  if (filterWaktu.value === 'semua') return listTransaksi.value;
  const sekarang = new Date();
  
  return listTransaksi.value.filter(t => {
    const tglTransaksi = new Date(t.createdAt);
    if (filterWaktu.value === 'hari_ini') return tglTransaksi.toDateString() === sekarang.toDateString();
    else if (filterWaktu.value === 'minggu_ini') return ((sekarang - tglTransaksi) / (1000 * 60 * 60 * 24)) <= 7;
    else if (filterWaktu.value === 'bulan_ini') return tglTransaksi.getMonth() === sekarang.getMonth() && tglTransaksi.getFullYear() === sekarang.getFullYear();
    else if (filterWaktu.value === 'tahun_ini') return tglTransaksi.getFullYear() === sekarang.getFullYear();
    return true;
  });
});

const totalPendapatan = computed(() => transaksiTerfilter.value.reduce((acc, item) => acc + item.total_harga, 0));

const labelFilter = computed(() => {
  const labels = { 'semua': 'Semua Waktu', 'hari_ini': 'Hari Ini', 'minggu_ini': '7 Hari Terakhir', 'bulan_ini': 'Bulan Ini', 'tahun_ini': 'Tahun Ini' };
  return labels[filterWaktu.value];
});

// --- FUNGSI DOWNLOAD FILE PDF LANGSUNG ---
const unduhPDF = async () => {
  isGeneratingPDF.value = true;
  showKopSurat.value = true; // Munculkan kop surat ke layar

  // Tunggu Vue merender kop surat ke layar (sangat cepat, tidak terlihat mata)
  await nextTick();

  try {
    // Import library secara dinamis (wajib untuk Nuxt 3 agar tidak error SSR)
    const html2pdf = (await import('html2pdf.js')).default;
    
    // Ambil elemen HTML yang mau dijadikan PDF
    const element = document.getElementById('area-laporan');
    
    // Pengaturan PDF (Ukuran Kertas, Margin, Kualitas Resolusi)
    const opt = {
      margin:       0.4,
      filename:     `Laporan_Kasir_${labelFilter.value.replace(/ /g, '_')}.pdf`,
      image:        { type: 'jpeg', quality: 1 },
      html2canvas:  { scale: 2, useCORS: true }, // Scale 2 agar teksnya tajam (tidak buram)
      jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
    };

    // Eksekusi pembuatan dan download file PDF
    await html2pdf().set(opt).from(element).save();
    
  } catch (error) {
    alert("Gagal membuat PDF!");
    console.error(error);
  } finally {
    showKopSurat.value = false; // Sembunyikan kop surat lagi
    isGeneratingPDF.value = false; // Matikan efek loading
  }
};
</script>

<template>
  <div class="p-4 md:p-8 min-h-screen bg-slate-50 relative">
    
    <div class="mb-8 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
      <div>
        <h1 class="text-2xl md:text-3xl font-black text-slate-800 tracking-tight">Rekapitulasi Penjualan</h1>
        <p class="text-slate-500 mt-1">Saring dan ekspor laporan transaksi tokomu.</p>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <select v-model="filterWaktu" class="flex-1 md:w-48 border-2 border-slate-300 rounded-xl py-2.5 px-4 focus:border-amber-500 focus:ring-0 outline-none text-slate-700 font-medium cursor-pointer">
          <option value="hari_ini">Hari Ini</option>
          <option value="minggu_ini">Minggu Ini (7 Hari)</option>
          <option value="bulan_ini">Bulan Ini</option>
          <option value="tahun_ini">Tahun Ini</option>
          <option value="semua">Semua Waktu</option>
        </select>
        
        <button 
          @click="unduhPDF"
          :disabled="transaksiTerfilter.length === 0 || isGeneratingPDF"
          class="bg-slate-800 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-slate-900 transition flex items-center justify-center gap-2 shadow-md disabled:bg-slate-300 disabled:cursor-not-allowed shrink-0 min-w-[160px]"
        >
          <span v-if="isGeneratingPDF">⏳ Memproses...</span>
          <span v-else>⬇️ Unduh PDF</span>
        </button>
      </div>
    </div>

    <div id="area-laporan" class="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
      
      <div v-show="showKopSurat" class="mb-8 border-b-2 border-slate-800 pb-4">
        <h1 class="text-3xl font-black text-slate-900 uppercase tracking-widest">KASIR PINTAR</h1>
        <h2 class="text-xl font-bold text-slate-700 mt-1">Laporan Rekapitulasi Transaksi</h2>
        <p class="text-slate-500 mt-1 font-medium">Periode: {{ labelFilter }} | Dicetak pada: {{ new Date().toLocaleString('id-ID') }}</p>
      </div>

      <div v-if="pending" class="text-center py-20 text-slate-500 animate-pulse">Memuat data transaksi...</div>
      
      <div v-else-if="transaksiTerfilter.length === 0" class="text-center py-20 text-slate-400 italic border-2 border-dashed border-slate-200 rounded-xl">
        Tidak ada transaksi pada periode ini.
      </div>

      <div v-else>
        <div class="flex flex-col sm:flex-row gap-4 mb-8">
          <div class="flex-1 bg-amber-50 p-4 rounded-xl border border-amber-100">
            <p class="text-amber-700 font-bold text-sm uppercase tracking-wider mb-1">Total Transaksi</p>
            <p class="text-2xl font-black text-amber-900">{{ transaksiTerfilter.length }} Nota</p>
          </div>
          <div class="flex-1 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
            <p class="text-emerald-700 font-bold text-sm uppercase tracking-wider mb-1">Total Omzet</p>
            <p class="text-2xl font-black text-emerald-900">Rp {{ totalPendapatan.toLocaleString('id-ID') }}</p>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-100 text-slate-600 text-sm font-bold uppercase border-y-2 border-slate-300">
                <th class="p-4 whitespace-nowrap">Tanggal & Waktu</th>
                <th class="p-4">Pencatat (Kasir)</th>
                <th class="p-4">Rincian Item</th>
                <th class="p-4 text-right">Total Bayar</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-sm">
              <tr v-for="t in transaksiTerfilter" :key="t._id" class="hover:bg-slate-50 transition">
                <td class="p-4 text-slate-600 whitespace-nowrap">
                  {{ new Date(t.createdAt).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) }}
                </td>
                <td class="p-4">
                  <span class="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg font-semibold border border-slate-200">
                    👤 {{ t.nama_kasir }}
                  </span>
                </td>
                <td class="p-4 text-slate-500 py-3">
                  <ul class="list-disc list-inside">
                    <li v-for="(p, idx) in t.pesanan" :key="idx" class="max-w-[200px] md:max-w-sm break-words">
                      {{ p.nama_produk }} <span class="text-slate-400">({{ p.jumlah }}x)</span>
                    </li>
                  </ul>
                </td>
                <td class="p-4 text-right font-black text-slate-800 text-base whitespace-nowrap">
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