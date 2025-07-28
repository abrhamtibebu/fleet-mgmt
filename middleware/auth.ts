import { AuthState } from '~/types/auth'
import { useAuthState } from '~/composables/auth/useAuthState'

export default defineNuxtRouteMiddleware((to, from) => {
  // Skip middleware on server-side rendering
  if (process.server) return

  const { status, session } = useAuthState()
  
  // If auth state is still loading, don't redirect yet
  if (status.value === AuthState.loading) {
    return
  }
  
  // Check if user has a valid token
  const hasValidToken = session.value?.access_token && session.value.access_token.length > 0
  
  // Check if user is authenticated
  const isAuthenticated = status.value === AuthState.authenticated && hasValidToken

  // If user is not authenticated and trying to access protected routes
  if (!isAuthenticated && to.path !== '/login') {
    // Clear any invalid tokens
    if (process.client) {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
    
    // Update auth state
    status.value = AuthState.unauthenticated
    session.value = undefined
    
    return navigateTo('/login', { replace: true })
  }

  // If user is authenticated and trying to access login page
  if (isAuthenticated && to.path === '/login') {
    // Check if user is a teacher and redirect to /batches instead of /
    const { currentUser } = useAuthState()
    if (currentUser.value?.admin_type === 'teacher') {
      return navigateTo('/batches', { replace: true })
    }
    return navigateTo('/batches', { replace: true })
  }
}) 