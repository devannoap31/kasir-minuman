import { ref, watch } from 'vue';

// Fungsi ini menerima data asli, field apa yang mau dicari, dan jeda waktu
export function useSearch(dataAsli, fieldPencarian = 'nama_produk', delay = 1000) {
  const searchQuery = ref('');
  const dataTampil = ref([]);
  let timerPencarian = null;

  // Pantau jika data asli berubah (misal ditarik dari database/polling)
  watch(dataAsli, (newVal) => {
    if (!searchQuery.value) {
      dataTampil.value = newVal;
    }
  }, { deep: true, immediate: true });

  // Pantau ketikan user (Debounce)
  watch(searchQuery, (kataKunciBaru) => {
    clearTimeout(timerPencarian);
    timerPencarian = setTimeout(() => {
      if (!kataKunciBaru) {
        dataTampil.value = dataAsli.value;
      } else {
        dataTampil.value = dataAsli.value.filter(item => 
          item[fieldPencarian].toLowerCase().includes(kataKunciBaru.toLowerCase())
        );
      }
    }, delay);
  });

  return { searchQuery, dataTampil };
}