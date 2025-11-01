import React, {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { login as authLogin } from '../store/authSlice'
import {Button, Input} from "./index"
import {useDispatch} from "react-redux"
import authService from "../appwrite/auth"
import {useForm} from "react-hook-form"

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit, formState: {errors}} = useForm()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const login = async(data) => {
        setError("")
        setLoading(true)
        console.log('🔐 Login: Attempting to login with email:', data.email)
        
        try {
            const session = await authService.login(data)
            console.log('✅ Login: Session created successfully:', session)
            
            if (session) {
                const userData = await authService.getCurrentUser()
                console.log('✅ Login: User data fetched:', userData)
                
                if(userData) {
                    dispatch(authLogin(userData));
                    console.log('✅ Login: User logged in, navigating to /all-posts')
                    // Navigate to all posts page after successful login
                    navigate("/all-posts")
                } else {
                    setError("Failed to get user data. Please try again.")
                }
            } else {
                setError("Failed to create session. Please try again.")
            }
        } catch (error) {
            console.error('❌ Login: Error logging in:', error)
            console.error('Error details:', {
                message: error.message,
                type: error.type,
                code: error.code,
                response: error.response
            })
            
            // Provide more user-friendly error messages
            let errorMessage = error.message || "Failed to login. Please try again."
            
            if (error.type === 'user_invalid_credentials') {
                errorMessage = "Invalid email or password. Please try again."
            } else if (error.type === 'user_not_found') {
                errorMessage = "No account found with this email. Please sign up first."
            } else if (error.type === 'general_unauthorized_scope') {
                errorMessage = "Unauthorized. Please check your Appwrite configuration."
            }
            
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

  return (
    <div className="flex items-center justify-center min-h-[70vh] py-12 px-4 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50">
    <div className={`mx-auto w-full max-w-lg bg-white/90 backdrop-blur-sm rounded-2xl p-10 shadow-2xl border border-purple-100 animate-fade-in`}>
    <div className="mb-6 flex flex-col items-center">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                        Blog
                    </h1>
                    <div className="w-16 h-1 bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 rounded-full"></div>
        </div>
        <h2 className="text-center text-3xl font-bold leading-tight text-gray-800 mb-2">Sign in to your account</h2>
        <p className="mt-2 text-center text-base text-gray-600">
                    Don&apos;t have any account?&nbsp;
                    <Link
                        to="/signup"
                        className="font-medium text-purple-600 transition-all duration-200 hover:text-purple-700 hover:underline"
                    >
                        Sign Up
                    </Link>
        </p>
        {error && (
            <div className="mt-6 text-center bg-red-50 p-3 rounded-lg border border-red-200">
                <p className="text-red-700 font-medium">{error}</p>
            </div>
        )}
        {(errors.email || errors.password) && (
            <div className="mt-4 space-y-2">
                {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
            </div>
        )}
        <form onSubmit={handleSubmit(login)} className='mt-8'>
            <div className='space-y-6'>
                <Input
                label="Email: "
                placeholder="Enter your email"
                type="email"
                        {...register("email", {
                            required: "Email is required",
                            validate: {
                                matchPattern: (value) => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                                "Email address must be a valid address",
                            }
                        })}
                />
                <Input
                label="Password: "
                type="password"
                placeholder="Enter your password"
                        {...register("password", {
                            required: "Password is required",
                        })}
                />
                <Button
                type="submit"
                disabled={loading}
                bgColor={loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700"}
                className="w-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
                >{loading ? "Signing in..." : "Sign in"}</Button>
            </div>
        </form>
        </div>
    </div>
  )
}

export default Login