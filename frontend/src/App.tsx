import { AuthProvider } from './features/auth/context/AuthProvider'
import { BrowserRouter } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import Routers from './routers/Routers'
import { queryClient } from './app/queryClient'

const App = () => {
  	return (
    	<QueryClientProvider client={queryClient}>
    		<BrowserRouter>
      			<AuthProvider>
        			<Routers />
      			</AuthProvider>
    		</BrowserRouter>
    	</QueryClientProvider>
  	)
}

export default App