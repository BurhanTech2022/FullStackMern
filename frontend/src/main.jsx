import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {QueryClient, QueryClientProvider} from "@tanstack/react-query"
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Toaster } from "@/components/ui/sonner"


// Create a client
const queryClient = new QueryClient({
  defaultOptions :{
    queries :{
      staleTime :60*1000
    }
  }
})


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}> 
      <BrowserRouter>
        {/* <Toaster position={"top-center"} /> */}
        <Toaster position="top-center" />
        <App />
      </BrowserRouter>
       
       </QueryClientProvider>
   
  </StrictMode>,
)
