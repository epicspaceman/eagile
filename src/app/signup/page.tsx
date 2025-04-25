import SignupForm from '@/app/components/signUpForm/signupForm';
import Navbar from '../components/navbar/navbar';

const SignUp = () => {
    return (
        <main className='flex flex-col border-red-500 border-4 border-dotted h-screen w-full'>
            <Navbar />
            <div className='content-center justify-items-center border-red-500 border-4 border-dotted w-full h-full'>
                <SignupForm />
            </div>
        </main>
    )
}

export default SignUp