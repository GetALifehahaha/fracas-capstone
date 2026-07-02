import { Hourglass } from 'lucide-react'
import { Card } from '../ui/card'

const LoadingCard = () => {
  return (
    <Card className='items-center py-8'>
        <Hourglass size={24} strokeOpacity={0.5} className='animate-spin' />
        <h5 className='font-semibold text-black/50'>Please wait for a bit</h5>
    </Card>
  )
}

export default LoadingCard