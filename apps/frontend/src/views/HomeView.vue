<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const loading = ref(true);
const user = reactive({ firstName: undefined, lastName: undefined });
const stats = reactive({ lastMonthTotal: undefined, highestAmountOrder: undefined })

const fetchData = async (token: string) => {
  const { data: { lastMonthTotal, highestAmountOrder } } = await axios.get(`${import.meta.env.VITE_API_URL}/orders/stats`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });

  stats.lastMonthTotal = lastMonthTotal;
  stats.highestAmountOrder = highestAmountOrder;
  loading.value = false;
};

const handleLogout = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  router.replace({ name: 'login' });
};

onMounted(() => {
  const token = localStorage.getItem('accessToken');
  const { firstName, lastName } = JSON.parse(localStorage.getItem('user'));
  user.firstName = firstName;
  user.lastName = lastName;
  fetchData(token);
});
</script>

<template>
  <div class="flex justify-center h-full min-h-screen py-12">
    <div
      v-if="stats.lastMonthTotal && stats.highestAmountOrder"
      class="px-6 md:p-0 md:w-xl space-y-6"
    >
      <div class="flex flex-col items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-12 stroke-gray-500"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M10.5 6a7.5 7.5 0 1 0 7.5 7.5h-7.5V6Z"
          />
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13.5 10.5H21A7.5 7.5 0 0 0 13.5 3v7.5Z"
          />
        </svg>

        <h1 class="font-bold text-xl text-center text-primary">
          Hello {{ user.firstName }} {{ user.lastName }}!
        </h1>
        <h2 class="font-bold text-sm text-center text-gray-500">
          Welcome to your dashboard.
        </h2>

        <button
          class="btn btn-xs btn-warning mt-2"
          @click="handleLogout"
        >
          Logout
        </button>
      </div>

      <div class="flex flex-col md:flex-row stats shadow overflow-hidden">
        <div class="stat">
          <div class="stat-figure text-primary">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="inline-block h-8 w-8 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
          </div>
          <div class="stat-title font-bold">
            Last Month's Sales
          </div>
          <div class="stat-value text-primary">
            ${{ stats.lastMonthTotal }}
          </div>
          <div class="text-gray-400 text-xs">
            Keep it up!
          </div>
        </div>

        <div class="stat">
          <div class="stat-figure text-success">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="inline-block h-8 w-8 stroke-current"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941"
              />
            </svg>
          </div>
          <div class="stat-title font-bold">
            The Biggest Order
          </div>
          <div class="stat-value text-success">
            ${{ stats.highestAmountOrder.total }}
          </div>
          <div class="text-gray-400 text-xs">
            <p>By {{ stats.highestAmountOrder.clientName }}</p>
            <p>
              {{ stats.highestAmountOrder.products.length }} Products
            </p>
          </div>
        </div>
      </div>

      <div class="flex flex-col items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="size-10 stroke-gray-400"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M13.5 21v-7.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349M3.75 21V9.349m0 0a3.001 3.001 0 0 0 3.75-.615A2.993 2.993 0 0 0 9.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 0 0 2.25 1.016c.896 0 1.7-.393 2.25-1.015a3.001 3.001 0 0 0 3.75.614m-16.5 0a3.004 3.004 0 0 1-.621-4.72l1.189-1.19A1.5 1.5 0 0 1 5.378 3h13.243a1.5 1.5 0 0 1 1.06.44l1.19 1.189a3 3 0 0 1-.621 4.72M6.75 18h3.75a.75.75 0 0 0 .75-.75V13.5a.75.75 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v3.75c0 .414.336.75.75.75Z"
          />
        </svg>


        <h1 class="capitalize font-medium text-center text-gray-400">
          Our biggest shopper bought for these items!
        </h1>
      </div>

      <div class="grid grid-cols-2 gap-6">
        <div
          v-for="product in stats.highestAmountOrder.products"
          class="card bg-base-100 shadow-sm"
        >
          <figure>
            <img
              :src="product.imagePath || 'https://i.imgur.com/icS609a.png'"
              alt="Shoes"
              class="rounded-t-xl"
            >
          </figure>
          <div class="card-body items-center text-center">
            <h2 class="card-title text-sm">
              {{ product.name }}
            </h2>
            <p class="text-xs text-gray-500">
              <strong>SKU</strong>: {{ product.sku }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
