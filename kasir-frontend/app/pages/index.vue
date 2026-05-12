<template>
  <div class="min-h-screen bg-slate-100 flex flex-col md:flex-row">
    
    <div class="w-full md:w-2/3 p-6">
      <h2 class="text-2xl font-bold text-slate-800 mb-6">Menu Minuman</h2>
      
      <div class="grid grid-cols-2 lg:grid-cols-3 gap-4">
        
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-amber-500 hover:shadow-md transition">
          <h3 class="font-semibold text-lg text-slate-700">Es Coklat Original</h3>
          <p class="text-amber-600 font-bold mt-2">Rp 8.000</p>
        </div>
        
        <div class="bg-white p-4 rounded-xl shadow-sm border border-slate-200 cursor-pointer hover:border-amber-500 hover:shadow-md transition">
          <h3 class="font-semibold text-lg text-slate-700">Roti Bakar</h3>
          <p class="text-amber-600 font-bold mt-2">Rp 5.000</p>
        </div>

      </div>
    </div>

    <div class="w-full md:w-1/3 bg-white p-6 shadow-lg flex flex-col justify-between min-h-[50vh] md:min-h-screen">
      <div>
        <h2 class="text-2xl font-bold text-slate-800 mb-6">Pesanan Saat Ini</h2>
        <p class="text-slate-500 text-center italic mt-10">Belum ada pesanan</p>
      </div>

      <div class="border-t pt-4 mt-4">
        <div class="flex justify-between items-center mb-4">
          <span class="text-lg font-semibold text-slate-600">Total:</span>
          <span class="text-2xl font-bold text-amber-700">Rp 0</span>
        </div>
        <button class="w-full bg-amber-600 text-white font-bold py-3 rounded-xl hover:bg-amber-700 transition">
          Bayar Sekarang
        </button>
      </div>
    </div>

  </div>
</template>