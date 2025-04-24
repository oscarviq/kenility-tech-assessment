<script setup lang="ts">
import { ref } from 'vue';
import { Form, Field } from 'vee-validate';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();
const loading = ref(false);

type Credentials = {
  email: string;
  password: string;
};

const validationSchema = {
  email: 'required|email',
  password: 'required'
};

const handleLogin = async ({ email, password }: Credentials) => {
  try {
    loading.value = true;
    const { data: { firstName, lastName, accessToken } } = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, { email, password });
    localStorage.setItem('user', JSON.stringify({ firstName, lastName }));
    localStorage.setItem('accessToken', accessToken);
    router.push({ name: 'home' });
  } catch (error) {
    const { data } = error.response || { data: { message: 'Unknown error, please try again.' } };
    alert(data.message);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="flex justify-center">
    <div class="card w-96 bg-base-100 shadow-xl mt-20 mb-20">
      <div class="card-body">
        <h2 class="card-title">
          Login!
        </h2>
        <Form
          v-slot="{ errors }"
          novalidate
          :validation-schema="validationSchema"
          @submit="handleLogin"
        >
          <div class="items-center mt-2">
            <label class="input input-bordered flex items-center gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="w-4 h-4 opacity-70"
              >
                <path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                <path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
              </svg>
              <Field
                name="email"
                type="text"
                class="grow"
                placeholder="Email"
                :validate-on-model-update="true"
              />
            </label>
            <span
              v-if="errors.email"
              class="block text-error text-xs mb-2 -mt-2"
            >{{ errors.email }}</span>
            <label class="input input-bordered flex items-center gap-2 mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                class="w-4 h-4 opacity-70"
              >
                <path
                  fill-rule="evenodd"
                  d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                  clip-rule="evenodd"
                />
              </svg>
              <Field
                name="password"
                type="password"
                class="grow"
                placeholder="Password"
                :validate-on-model-update="true"
              />
            </label>
            <span
              v-if="errors.password"
              class="block text-error text-xs mb-2 -mt-2"
            >{{ errors.password }}</span>
          </div>
          <div class="card-actions justify-end">
            <button
              class="btn btn-primary w-full"
              :disabled="errors.email || errors.password || loading"
            >
              {{ loading ? 'Loading...' : 'Login' }}
            </button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>
