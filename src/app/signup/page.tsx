import SignupForm from '@/app/components/signUpForm/signupForm';

const SignUp = () => {
    return (
        <main className='flex border-red-500 border-4 border-dotted h-screen w-full'>
            <div className='content-center justify-items-center border-red-500 border-4 border-dotted w-full'>
                <SignupForm />
            </div>
        </main>
    )
}

export default SignUp