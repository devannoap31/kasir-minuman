<script setup>
const props = defineProps({
  item: { type: Object, required: true },
  isInteractive: { type: Boolean, default: false } // Jika true, ada efek hover khusus untuk masuk keranjang
});

const config = useRuntimeConfig();

const getUrlGambar = (namaFile) => {
  if (!namaFile) return 'https://via.placeholder.com/150?text=Tanpa+Gambar';
  const baseUrl = config.public.apiBase.replace('/api', '');
  return `${baseUrl}/uploads/${namaFile}`;
};
</script>

<template>
  <div 
    :class="[
      'bg-white rounded-xl shadow-sm border overflow-hidden flex flex-col transition relative', 
      !item.ketersediaan ? 'cursor-not-allowed opacity-60 border-rose-200' : (isInteractive ? 'cursor-pointer hover:border-amber-500 hover:shadow-md' : 'border-slate-200 hover:border-amber-400')
    ]"
  >
    <div class="h-28 sm:h-36 bg-slate-100 relative">
      <img :src="getUrlGambar(item.gambar)" :class="['w-full h-full object-cover', !item.ketersediaan ? 'grayscale' : '']">
      
      <div :class="['absolute top-2 right-2 px-2 py-0.5 md:px-3 md:py-1 text-[10px] md:text-xs font-bold rounded-full shadow-sm flex items-center gap-1', item.ketersediaan ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-500 text-white']">
        <Icon :name="item.ketersediaan ? 'bi:check-circle-fill' : 'bi:x-circle-fill'" />
        {{ item.ketersediaan ? 'Tersedia' : 'Habis' }}
      </div>

      <div v-if="isInteractive && !item.ketersediaan" class="absolute inset-0 bg-black/40 flex items-center justify-center">
        <span class="bg-rose-600 text-white font-bold px-3 py-1 rounded-full text-sm">STOK KOSONG</span>
      </div>
    </div>
    
    <div class="p-3 sm:p-4 flex flex-col flex-grow">
      <span class="text-[10px] sm:text-xs font-bold text-slate-400 uppercase mb-1 line-clamp-1">{{ item.kategori }}</span>
      <h3 class="font-bold text-slate-700 text-sm sm:text-base leading-tight mb-1 line-clamp-2">{{ item.nama_produk }}</h3>
      <p class="text-amber-600 font-black text-sm sm:text-lg mt-auto pt-2">Rp {{ item.harga.toLocaleString('id-ID') }}</p>
      
      <slot></slot>
    </div>
  </div>
</template>