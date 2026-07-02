import { Card, CardTitle } from '@/common/ui/card'
import UserInformationCard from './components/UserInformationCard'
import { Separator } from '@/common/ui/separator'
import ProfileDetailsCard from './components/ProfileDetailsCard'
import { Button } from '@/common/ui/button'
import { useAuth } from '@/features/auth/context/useAuth'

const AccountPage = () => {

	// role comes from the session (JWT claim); the rest is placeholder until the
	// account API (djoser `/users/me/`) is wired in Phase 4.
	const { role } = useAuth()

	const account = {
		first_name: "Ahlan-nour",
		last_name: "Sencio",
		is_active: true,

		email: "sencioahlannour@gmail.com",
		phone_number: "+639 123 456 7890",
	}

	return (
		<div className='flex p-2 h-full'>
			<Card className='w-1/3 flex flex-col p-2 bg-olive-50'>
				<UserInformationCard first_name={account.first_name} last_name={account.last_name} role={role} is_active={account.is_active} />
				<Separator>
				</Separator>

				<ProfileDetailsCard email={account.email} phone_number={account.phone_number} />
				<Separator></Separator>

				<Button size="lg">
					Edit Profile Information
				</Button>
				<Button size="lg" variant="outline">
					Change Password
				</Button>
			</Card>
			<div>
				<CardTitle>Profile Details</CardTitle>
			</div>
		</div>
	)
}

export default AccountPage
