import { appRouter } from './router/app.router'
import { RouterProvider } from 'react-router/dom'
import { AuthProvider } from './auth/context/AuthContext'

function App() {

  return (
    <AuthProvider>
      <RouterProvider router={appRouter} />
    </AuthProvider>
  )
}

export default App
