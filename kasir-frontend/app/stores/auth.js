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
      // Simpan ke localStorage agar kalau di-refresh tidak logout
      localStorage.setItem('auth-token', token);
      localStorage.setItem('auth-user', JSON.stringify(userData));
    },
    logout() {
      this.user = null;
      this.token = null;
      localStorage.clear();
      navigateTo('/login');
    }
  }
});