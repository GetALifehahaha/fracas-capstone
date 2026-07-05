import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/common/components/Header.tsx'
import { PageTransition } from '@/common/motion'

const Layout = () => {
  const { pathname } = useLocation()
  return (
    <div className='w-full h-screen min-h-screen flex flex-col'>
        <Header />
        <div className='flex-1 p-2 relative'>
          <PageTransition key={pathname} className='h-full'>
            <Outlet />
          </PageTransition>
        </div>
    </div>
  )
}

export default Layout