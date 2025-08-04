<template>
  <div class="login-container">
    <!-- Left Side - Branding -->
    <!-- <div class="branding-section">
      <div class="branding-content">
        
        <h1 class="brand-title">WS Fleet Manager</h1>
        <p class="brand-subtitle">Streamline your fleet operations with intelligent management</p>
        <div class="feature-list">
          <div class="feature-item">
            <v-icon color="primary" class="feature-icon">mdi-car-multiple</v-icon>
            <span>Vehicle Tracking</span>
          </div>
          <div class="feature-item">
            <v-icon color="primary" class="feature-icon">mdi-chart-line</v-icon>
            <span>Analytics & Reports</span>
          </div>
          <div class="feature-item">
            <v-icon color="primary" class="feature-icon">mdi-fuel</v-icon>
            <span>Fuel Management</span>
          </div>
        </div>
      </div>
    </div> -->

    <!-- Right Side - Login Form -->
    <div class="login-section">
      <div class="login-card">
        <div class="login-header">
            <img 
              src="/WS yellow logo-16.png" 
              alt="WS Fleet Manager" 
              class="logo"
              style="width: 100px; height: 100px; max-width: none; max-height: none;"
            />

          <h2 class="login-title">Welcome Back</h2>
          <p class="login-subtitle">Sign in to your account to continue</p>
        </div>

        <v-form ref="form" v-model="valid" lazy-validation @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <v-text-field
              v-model="email"
              :rules="emailRules"
              placeholder="Enter your email"
              prepend-inner-icon="mdi-email-outline"
              type="email"
              variant="outlined"
              density="comfortable"
              color="primary"
              class="custom-input"
              hide-details="auto"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Password</label>
            <v-text-field
              v-model="password"
              :rules="passwordRules"
              placeholder="Enter your password"
              prepend-inner-icon="mdi-lock-outline"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              :type="showPassword ? 'text' : 'password'"
              variant="outlined"
              density="comfortable"
              color="primary"
              class="custom-input"
              hide-details="auto"
              required
            />
          </div>

          <!-- <div class="form-options">
            <v-checkbox
              v-model="rememberMe"
              label="Remember me"
              color="primary"
              hide-details
              density="compact"
            />
            <a href="#" class="forgot-link">Forgot password?</a>
          </div> -->

          <v-btn
            type="submit"
            color="primary"
            block
            size="large"
            class="login-btn"
            :disabled="!valid || loading"
            :loading="loading"
          >
            <v-icon left>mdi-login</v-icon>
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </v-btn>
        </v-form>

        <!-- <div class="login-footer">
          <p class="footer-text">
            Don't have an account? 
            <a href="#" class="signup-link">Contact your administrator</a>
          </p>
        </div> -->
      </div>
    </div>
  </div>
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
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)

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
  
  loading.value = true
  try {
    await login(email.value, password.value)
    router.push('/')
  } catch (error) {
    console.error('Login failed:', error)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.branding-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.9) 0%, rgba(118, 75, 162, 0.9) 100%);
  position: relative;
  overflow: hidden;
}

.branding-content {
  text-align: center;
  color: white;
  z-index: 1;
  position: relative;
  max-width: 400px;
  padding: 2rem;
}

.logo-container {
  margin-bottom: 2rem;
}

.logo {
  width: 80px;
  height: 80px;
  object-fit: contain;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.brand-subtitle {
  font-size: 1.1rem;
  margin-bottom: 3rem;
  opacity: 0.9;
  line-height: 1.6;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1rem;
  opacity: 0.9;
}

.feature-icon {
  font-size: 1.5rem;
}

.login-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  padding: 2rem;
}

.login-card {
  width: 100%;
  max-width: 400px;
}

.login-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #666;
  font-size: 1rem;
}

.login-form {
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.custom-input :deep(.v-field) {
  border-radius: 12px;
  background: #f8f9fa;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.custom-input :deep(.v-field:hover) {
  border-color: #e0e0e0;
}

.custom-input :deep(.v-field--focused) {
  border-color: rgb(var(--v-theme-primary));
  background: white;
  box-shadow: 0 0 0 3px rgba(var(--v-theme-primary), 0.1);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.forgot-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.forgot-link:hover {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}

.login-btn {
  border-radius: 12px;
  height: 48px;
  font-weight: 600;
  font-size: 1rem;
  text-transform: none;
  box-shadow: 0 4px 12px rgba(var(--v-theme-primary), 0.3);
  transition: all 0.3s ease;
}

.login-btn:hover {
  box-shadow: 0 6px 16px rgba(var(--v-theme-primary), 0.4);
  transform: translateY(-1px);
}

.login-footer {
  text-align: center;
  margin-top: 2rem;
}

.footer-text {
  color: #666;
  font-size: 0.9rem;
}

.signup-link {
  color: rgb(var(--v-theme-primary));
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.signup-link:hover {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}

@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
  }
  
  .branding-section {
    min-height: 40vh;
    padding: 2rem 1rem;
  }
  
  .brand-title {
    font-size: 2rem;
  }
  
  .login-section {
    padding: 1rem;
  }
  
  .login-card {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .branding-content {
    padding: 1rem;
  }
  
  .brand-title {
    font-size: 1.8rem;
  }
  
  .feature-list {
    gap: 1rem;
  }
  
  .feature-item {
    font-size: 0.9rem;
  }
}
</style>
