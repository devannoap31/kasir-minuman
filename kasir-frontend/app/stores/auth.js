import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
  }),
  actions: {
    setUser(userData, token) {
      this.user = userData;
      this.token = token;
      localStorage.setItem('auth-token', token);
      localStorage.setItem('auth-user', JSON.stringify(userData));
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.clear();
      navigateTo('/login');
    },
    // --- FITUR BARU: AUTO-KICK ---
    async periksaKeamanan() {
      const tokenLokal = localStorage.getItem('auth-token');
      if (!tokenLokal) {
        this.logout();
        return;
      }
      
      try {
        const config = useRuntimeConfig();
        // Frontend menelepon Backend untuk verifikasi
        await $fetch(`${config.public.apiBase}/auth/verify`, {
          headers: { Authorization: `Bearer ${tokenLokal}` }
        });
      } catch (error) {
        // Jika Backend merespon error (401), berarti akun dihapus / tiket hangus!
        alert("Sesi Anda telah berakhir atau akun ini telah dihapus. Anda akan dikeluarkan otomatis.");
        this.logout();
      }
    }
  }
});