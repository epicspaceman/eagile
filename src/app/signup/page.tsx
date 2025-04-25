import SignupForm from '@/app/components/signUpForm/signupForm';
import Navbar from '../components/navbar/navbar';

const SignUp = () => {
    return (
        <main className='flex flex-col h-screen w-full'>
            <Navbar />
            <div className='content-center justify-items-center w-full h-full'>
                <SignupForm />
            </div>
        </main>
    )
}

export default SignUp