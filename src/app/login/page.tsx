import LoginForm from '@/app/components/logInForm/loginForm'
import Navbar from '../components/navbar/navbar'

const LogIn = () => {

    return (
        <main className='flex flex-col h-screen w-full'>
            <Navbar />
            <div className='content-center justify-items-center w-full h-full'>
                <LoginForm />
            </div>
        </main>
    )
}

export default LogIn