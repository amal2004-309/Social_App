import api, { getApiErrorMessage } from "../../api/axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from './../../Context/AuthContext';

export default function Login() {
    const [isLoading, setLoading] = useState(false);
    const { insertUserToken } = useContext(AuthContext);
    const navigate = useNavigate();

    const { handleSubmit, register, formState: { errors, touchedFields } } = useForm({
        mode: "onTouched",
        defaultValues: {
            email: '',
            password: '',
        }
    });

    async function handleSignIn(values) {
        setLoading(true);
        try {
            const { data } = await api.post('/users/signin', values);
            toast.success('Welcome back!');
            setLoading(false);
            insertUserToken(data.data.token, data.data.user);
            navigate('/');
        } catch (error) {
            const errMsg = getApiErrorMessage(error);
            toast.error(errMsg);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-3.5rem)] bg-fb-bg flex items-center justify-center p-4">
            <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Left: Branding */}
                <div className="text-center lg:text-left space-y-3">
                    <h1 className="text-4xl sm:text-5xl font-black text-fb-blue tracking-tight">
                        Social App
                    </h1>
                    <p className="text-lg sm:text-2xl text-fb-primary font-normal leading-snug max-w-md mx-auto lg:mx-0">
                        Connect with friends and the world around you on RoutePosts.
                    </p>
                </div>

                {/* Right: Login Card */}
                <div className="bg-fb-surface border border-fb rounded-2xl p-6 sm:p-8 shadow-xl max-w-md w-full mx-auto space-y-4">
                    <form onSubmit={handleSubmit(handleSignIn)} className="space-y-3.5">
                        {/* Email */}
                        <div>
                            <input
                                id="email"
                                {...register('email', {
                                    required: {
                                        value: true,
                                        message: 'Email is required',
                                    },
                                    pattern: {
                                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                        message: 'Invalid email address'
                                    }
                                })}
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-fb-bg border border-fb text-fb-primary placeholder:text-fb-secondary text-sm px-4 py-3 rounded-xl outline-none focus:border-fb-blue focus:ring-1 focus:ring-fb-blue transition"
                            />
                            {errors?.email && touchedFields?.email && (
                                <p className="text-red-500 text-xs mt-1 pl-1">{errors?.email?.message}</p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <input
                                id="password"
                                {...register('password', {
                                    required: {
                                        value: true,
                                        message: 'Password is required',
                                    }
                                })}
                                type="password"
                                placeholder="Password"
                                className="w-full bg-fb-bg border border-fb text-fb-primary placeholder:text-fb-secondary text-sm px-4 py-3 rounded-xl outline-none focus:border-fb-blue focus:ring-1 focus:ring-fb-blue transition"
                            />
                            {errors?.password && touchedFields?.password && (
                                <p className="text-red-500 text-xs mt-1 pl-1">{errors?.password?.message}</p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-fb-blue hover:bg-blue-600 text-white font-bold text-base rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    <span>Logging In...</span>
                                </>
                            ) : (
                                "Log In"
                            )}
                        </button>
                    </form>

                    <div className="border-t border-fb my-4"></div>

                    {/* Create New Account Button */}
                    <div className="text-center pt-1">
                        <Link
                            to="/register"
                            className="inline-block py-2.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-sm"
                        >
                            Create new account
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
