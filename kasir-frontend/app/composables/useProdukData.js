import { ref, onMounted, onUnmounted } from 'vue';

export function useProdukData() {
  const config = useRuntimeConfig();
  const listProduk = ref([]);
  const pending = ref(true);
  let pollingInterval = null;

  const ambilDataProduk = async (isBackground = false) => {
    if (!isBackground) pending.value = true;
    try {
      listProduk.value = await $fetch(`${config.public.apiBase}/produk`);
    } catch (error) {
      console.error(error);
    } finally {
      if (!isBackground) pending.value = false;
    }
  };

  onMounted(() => {
    ambilDataProduk(); // Tarik data pertama kali
    pollingInterval = setInterval(() => {
      ambilDataProduk(true); // Polling diam-diam di background
    }, 5000);
  });

  onUnmounted(() => {
    clearInterval(pollingInterval); // Bersihkan memori saat pindah halaman
  });

  // Mengekspor data dan fungsi agar bisa dipakai di halaman lain
  return { listProduk, pending, ambilDataProduk };
}