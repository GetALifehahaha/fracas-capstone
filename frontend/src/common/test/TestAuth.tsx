import { useAuth } from '@/features/auth/context/useAuth'
import { Button } from '@/common/ui/button';


const TestAuth = () => {

  const { logout } = useAuth();

  return (
    <div>
      <div>
        <h5>Positive Login</h5>
        <Button>
          Login
        </Button>
      </div>
      <div>
        <h5>Logout</h5>
        <button className='bg-black text-white p-1'
         onClick={() => logout()}>Logout</button>
      </div>
    </div>
  )
}

export default TestAuth