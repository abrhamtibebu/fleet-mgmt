<template>
  <v-container
    fluid
    class="login-page d-flex align-center justify-center"
  >
    <v-card
      elevation="10"
      max-width="420"
      class="pa-6"
      rounded="lg"
    >
      <v-card-title class="text-h5 font-weight-bold text-center mb-2">
        WS Fleet Manager
      </v-card-title>
      <v-card-subtitle class="text-center mb-4 text-medium-emphasis">
        Secure access to your vehicle operations
      </v-card-subtitle>

      <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="handleLogin">
        <v-text-field
          v-model="email"
          :rules="emailRules"
          label="Email"
          prepend-inner-icon="mdi-account"
          type="email"
          variant="outlined"
          density="comfortable"
          color="primary"
          class="mb-4"
          required
        />

        <v-text-field
          v-model="password"
          :rules="passwordRules"
          label="Password"
          prepend-inner-icon="mdi-lock"
          type="password"
          variant="outlined"
          density="comfortable"
          color="primary"
          class="mb-2"
          required
        />

        <v-btn
          type="submit"
          color="primary"
          block
          size="large"
          class="mt-4"
          :disabled="!valid"
        >
          Login
        </v-btn>
      </v-form>
    </v-card>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const {login} = useAuth()

const router = useRouter()
const email = ref('')
const password = ref('')
const valid = ref(false)
const form = ref()

definePageMeta({
  layout: 'empty'
})

const emailRules = [
  (v: string) => !!v || 'Email is required',
  (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid',
]

const passwordRules = [
  (v: string) => !!v || 'Password is required',
  (v: string) => v.length >= 6 || 'Minimum 6 characters',
]

const handleLogin = async () => {
  if (!form.value?.validate()) return
  // Replace with real API auth
    await login(email.value, password.value)
    router.push('/')
  }
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(to right, #ffffff, #fdf8e2); /* Optional soft gradient */
  padding: 2rem;
}
</style>
