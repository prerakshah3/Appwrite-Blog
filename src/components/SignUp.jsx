import React, {useState} from 'react'
import authService from '../appwrite/auth'
import {Link ,useNavigate} from 'react-router-dom'
import {Button, Input} from './index.js'
import {useForm} from 'react-hook-form'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const [loading, setLoading] = useState(false)
    const {register, handleSubmit, formState: {errors}} = useForm()

    const create = async(data) => {
        setError("")
        setSuccess(false)
        setLoading(true)
        console.log('📝 SignUp: Attempting to create account with data:', {email: data.email, name: data.name})
        
        try {
            const userAccount = await authService.createAccount(data)
            console.log('✅ SignUp: Account created successfully:', userAccount)
            
            if (userAccount) {
                // Show success message and navigate to login page
                setSuccess(true)
                setTimeout(() => {
                    navigate("/login")
                }, 1500)
            } else {
                setError("Failed to create account. Please try again.")
            }
        } catch (error) {
            console.error('❌ SignUp: Error creating account:', error)
            console.error('Error details:', {
                message: error.message,
                type: error.type,
                code: error.code,
                response: error.response
            })
            
            // Provide more user-friendly error messages
            let errorMessage = error.message || "Failed to create account. Please try again."
            
            if (error.type === 'user_already_exists') {
                errorMessage = "An account with this email already exists. Please login instead."
            } else if (error.type === 'invalid_argument') {
                errorMessage = "Invalid input. Please check your email and password."
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
                <h2 className="text-center text-3xl font-bold leading-tight text-gray-800 mb-2">Sign up to create account</h2>
                <p className="mt-2 text-center text-base text-gray-600">
                    Already have an account?&nbsp;
                    <Link
                        to="/login"
                        className="font-medium text-purple-600 transition-all duration-200 hover:text-purple-700 hover:underline"
                    >
                        Sign In
                    </Link>
                </p>
                {error && (
                    <div className="mt-6 text-center bg-red-50 p-3 rounded-lg border border-red-200">
                        <p className="text-red-700 font-medium">{error}</p>
                    </div>
                )}
                {success && (
                    <div className="mt-6 text-center bg-green-50 p-3 rounded-lg border border-green-200">
                        <p className="text-green-700 font-medium">Account created successfully!</p>
                        <p className="text-green-600 text-sm mt-1">Redirecting to login page...</p>
                    </div>
                )}
                {(errors.email || errors.name || errors.password) && (
                    <div className="mt-4 space-y-2">
                        {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
                        {errors.name && <p className="text-red-600 text-sm">{errors.name.message}</p>}
                        {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
                    </div>
                )}

                <form onSubmit={handleSubmit(create)} className='mt-8'>
                    <div className='space-y-6'>
                        <Input
                        label="Full Name: "
                        placeholder="Enter your full name"
                        {...register("name", {
                            required: "Full name is required",
                            minLength: {
                                value: 2,
                                message: "Name must be at least 2 characters"
                            }
                        })}
                        />
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
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters"
                            }
                        })}
                        />
                        <Button 
                        type="submit" 
                        disabled={loading}
                        bgColor={loading ? "bg-gray-400 cursor-not-allowed" : "bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:via-pink-700 hover:to-indigo-700"}
                        className="w-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:transform-none"
                        >
                            {loading ? "Creating Account..." : "Create Account"}
                        </Button>
                    </div>
                </form>
            </div>

    </div>
  )
}

export default Signup