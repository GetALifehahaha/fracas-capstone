import { Card, CardTitle } from '@/common/ui/card'
import UserInformationCard from './components/UserInformationCard'
import { Separator } from '@/common/ui/separator'
import ProfileDetailsCard from './components/ProfileDetailsCard'
import EditProfileDialog from './components/EditProfileDialog'
import ChangePasswordDialog from './components/ChangePasswordDialog'
import OperatorActivity from './components/OperatorActivity'
import AccountChangeLog from './components/AccountChangeLog'
import ErrorState from '@/common/components/ErrorState'
import { useCurrentUser } from './hooks/useCurrentUser'

const AccountPage = () => {
	const { data: user, isLoading, isError, refetch } = useCurrentUser()

	if (isLoading) {
		return <div className='p-6 text-muted-foreground'>Loading your account…</div>
	}

	if (isError || !user) {
		return (
			<ErrorState
				title='Couldn’t load your account'
				message='We ran into a problem fetching your profile. This is usually a brief connection hiccup — give it another try.'
				onRetry={() => refetch()}
			/>
		)
	}

	return (
		<div className='flex p-2 h-full'>
			<Card className='w-1/3 flex flex-col p-2 bg-olive-50'>
				<UserInformationCard
					first_name={user.first_name || user.username}
					last_name={user.last_name}
					is_active={user.is_active}
				/>
				<Separator />

				<ProfileDetailsCard
					email={user.email || '—'}
					phone_number={user.phone_number || '—'}
					address={user.address}
				/>
				<Separator />

				<EditProfileDialog user={user} />
				<ChangePasswordDialog />
			</Card>
			<div className='ml-2 flex flex-1 flex-col gap-2 overflow-y-auto'>
				<Card className='p-4'>
					<CardTitle>My Activity</CardTitle>
					<Separator />
					<OperatorActivity />
				</Card>
				<Card className='p-4'>
					<CardTitle>Account History</CardTitle>
					<Separator />
					<AccountChangeLog />
				</Card>
			</div>
		</div>
	)
}

export default AccountPage
