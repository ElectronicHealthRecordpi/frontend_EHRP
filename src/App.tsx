import { useState } from 'react'

import { appRouter } from './router/app.router'
import { RouterProvider } from 'react-router/dom'

function App() {

  return (
    <>
      <RouterProvider router={appRouter} />
    </>

  )
}

export default App
