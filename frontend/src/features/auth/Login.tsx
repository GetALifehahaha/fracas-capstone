import { useActionState, useEffect } from 'react'
import { AxiosError } from 'axios'
import { Map, Megaphone, History, Waves } from 'lucide-react'
import { LoginSchema } from './schemas/LoginSchema'
import { Field, FieldSet, FieldLabel, FieldGroup, FieldDescription } from '@/common/ui/field'
import { Input } from '@/common/ui/input'
import { Button } from '@/common/ui/button'
import { Stagger, StaggerItem } from '@/common/motion'
import { useAuth } from './context/useAuth'
import type { LoginState } from './types/authTypes'
import { useNavigate } from 'react-router-dom'

/** Turn a failed sign-in into one plain-language line for the operator. */
const humanizeLoginError = (err: unknown): string => {
	if (err instanceof AxiosError) {
		if (err.response?.status === 401) return 'Incorrect username or password.'
		if (!err.response) return "We couldn't reach the server. Check your connection and try again."
	}
	return 'Something went wrong signing you in. Please try again.'
}

const FEATURES = [
	{ icon: Map, title: 'Live risk map', desc: 'Barangay flood hazard, refreshed every 15 minutes.' },
	{ icon: Megaphone, title: 'Instant advisories', desc: 'Broadcast alerts to subscribers the moment risk turns critical.' },
	{ icon: History, title: 'Flood history', desc: 'A searchable record of past events that validates the model.' },
]

const Login = () => {

	const { isAuthenticated, login } = useAuth();
	const navigate = useNavigate();

	const initialState: LoginState = {errors: {}};

	const loginAction = async (_: LoginState, formData: FormData): Promise<LoginState> => {

		const parsed = LoginSchema.safeParse(Object.fromEntries(formData));

		if (!parsed.success) {
			const fieldErrors = parsed.error.flatten().fieldErrors;

			return {
				errors: {
					username: fieldErrors.username?.[0],
					password: fieldErrors.password?.[0],
				}
			};
		};

		try {
			await login({
				username: parsed.data.username,
				password: parsed.data.password
			});

			return initialState;
		} catch (err) {
			return { errors: {}, formError: humanizeLoginError(err) };
		}
	}

	const [state, formAction, isPending] = useActionState(loginAction, initialState);

	useEffect(() => {
        if (isAuthenticated) navigate('/', { replace: true });
    }, [isAuthenticated, navigate])

	return (
		<div className='bg-blue-950 w-full h-screen flex p-2'>
			<div className='hidden basis-2/5 items-center justify-center p-10 md:flex'>
				<Stagger className='flex max-w-sm flex-col gap-8 text-white'>
					<StaggerItem className='flex items-center gap-3'>
						<span className='flex size-11 items-center justify-center rounded-xl bg-white/10'>
							<Waves className='size-6 text-blue-200' />
						</span>
						<div>
							<p className='text-2xl font-bold tracking-tight'>FRACAS</p>
							<p className='text-sm text-blue-200/80'>Flood-risk early-warning for Zamboanga City</p>
						</div>
					</StaggerItem>
					<div className='flex flex-col gap-5'>
						{FEATURES.map(({ icon: Icon, title, desc }) => (
							<StaggerItem key={title} className='flex gap-3'>
								<Icon className='mt-0.5 size-5 shrink-0 text-blue-300' />
								<div>
									<p className='text-sm font-semibold'>{title}</p>
									<p className='text-sm text-blue-200/70'>{desc}</p>
								</div>
							</StaggerItem>
						))}
					</div>
				</Stagger>
			</div>

			<form className='flex-1 bg-white rounded-2xl flex items-center justify-center flex-col' action={formAction}>
				<FieldSet className='w-1/3'>
					<h1>Welcome to FRACAS</h1>
					<FieldDescription>Login to your FRACAS account</FieldDescription>
						<FieldGroup>
							<Field>
								<FieldLabel htmlFor='username'>Username</FieldLabel>
								<Input id='username' name='username' />
								{state.errors.username &&
									<FieldDescription className='text-red-400'>{state.errors.username}</FieldDescription>
								}
							</Field>
							<Field>
								<FieldLabel htmlFor='password'>Password</FieldLabel>
								<Input id='password' type='password' name='password'  />
								{state.errors.password &&
									<FieldDescription className='text-red-400'>{state.errors.password}</FieldDescription>
								}
							</Field>
						</FieldGroup>
						{state.formError &&
							<FieldDescription className='text-destructive'>{state.formError}</FieldDescription>
						}
						<Button size="lg" type='submit' disabled={isPending} className="cursor-pointer">Log In</Button>
						<Button type='button' className="ml-auto" variant="link">Forgot Password?</Button>
				</FieldSet>
			</form>
		</div>
	)
}

export default Login
