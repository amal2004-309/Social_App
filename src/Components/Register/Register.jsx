import api, { getApiErrorMessage } from "../../api/axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
    const [isLoading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { handleSubmit, register, watch, formState: { errors, touchedFields } } = useForm({
        mode: "onTouched",
        defaultValues: {
            name: '',
            email: '',
            password: '',
            rePassword: '',
            dateOfBirth: '',
            gender: '',
        }
    });

    async function signUp(values) {
        setLoading(true);
        try {
            const { data } = await api.post('/users/signup', values);
            toast.success(data.message || 'Account created successfully!');
            setLoading(false);
            navigate('/login');
        } catch (error) {
            const errMsg = getApiErrorMessage(error);
            toast.error(errMsg);
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-3.5rem)] bg-fb-bg flex items-center justify-center p-4">
            <div className="bg-fb-surface border border-fb rounded-2xl p-6 sm:p-8 shadow-xl max-w-lg w-full mx-auto space-y-4">
                {/* Header */}
                <div className="text-center pb-2 border-b border-fb">
                    <h1 className="text-2xl sm:text-3xl font-black text-fb-primary">Create a new account</h1>
                    <p className="text-xs sm:text-sm text-fb-secondary mt-1">It's quick and easy.</p>
                </div>

                <form onSubmit={handleSubmit(signUp)} className="space-y-3.5 pt-2">
                    {/* Full Name */}
                    <div>
                        <input
                            id="name"
                            {...register('name', {
                                required: {
                                    value: true,
                                    message: 'Full name is required',
                                }
                            })}
                            type="text"
                            placeholder="Full name"
                            className="w-full bg-fb-bg border border-fb text-fb-primary placeholder:text-fb-secondary text-sm px-4 py-2.5 rounded-xl outline-none focus:border-fb-blue focus:ring-1 focus:ring-fb-blue transition"
                        />
                        {errors?.name && touchedFields?.name && (
                            <p className="text-red-500 text-xs mt-1 pl-1">{errors?.name?.message}</p>
                        )}
                    </div>

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
                            className="w-full bg-fb-bg border border-fb text-fb-primary placeholder:text-fb-secondary text-sm px-4 py-2.5 rounded-xl outline-none focus:border-fb-blue focus:ring-1 focus:ring-fb-blue transition"
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
                                },
                                pattern: {
                                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                                    message: 'Must include uppercase, lowercase, number, and special character'
                                },
                            })}
                            type="password"
                            placeholder="New password"
                            className="w-full bg-fb-bg border border-fb text-fb-primary placeholder:text-fb-secondary text-sm px-4 py-2.5 rounded-xl outline-none focus:border-fb-blue focus:ring-1 focus:ring-fb-blue transition"
                        />
                        {errors?.password && touchedFields?.password && (
                            <p className="text-red-500 text-xs mt-1 pl-1">{errors?.password?.message}</p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <input
                            id="rePassword"
                            {...register('rePassword', {
                                required: {
                                    value: true,
                                    message: 'Please confirm your password',
                                },
                                validate: (value) => value === watch('password') || 'Passwords do not match'
                            })}
                            type="password"
                            placeholder="Confirm password"
                            className="w-full bg-fb-bg border border-fb text-fb-primary placeholder:text-fb-secondary text-sm px-4 py-2.5 rounded-xl outline-none focus:border-fb-blue focus:ring-1 focus:ring-fb-blue transition"
                        />
                        {errors?.rePassword && touchedFields?.rePassword && (
                            <p className="text-red-500 text-xs mt-1 pl-1">{errors?.rePassword?.message}</p>
                        )}
                    </div>

                    {/* Date Of Birth */}
                    <div>
                        <label className="block text-xs font-semibold text-fb-secondary mb-1">Birthday</label>
                        <input
                            id="dateOfBirth"
                            {...register('dateOfBirth', {
                                required: {
                                    value: true,
                                    message: 'Date of birth is required'
                                },
                                validate: (value) => {
                                    const currentYear = new Date().getFullYear();
                                    const userYear = new Date(value).getFullYear();
                                    return currentYear - userYear >= 13 || 'Must be at least 13 years old';
                                }
                            })}
                            type="date"
                            className="w-full bg-fb-bg border border-fb text-fb-primary text-sm px-4 py-2.5 rounded-xl outline-none focus:border-fb-blue focus:ring-1 focus:ring-fb-blue transition"
                        />
                        {errors?.dateOfBirth && touchedFields?.dateOfBirth && (
                            <p className="text-red-500 text-xs mt-1 pl-1">{errors?.dateOfBirth?.message}</p>
                        )}
                    </div>

                    {/* Gender Selection */}
                    <div>
                        <label className="block text-xs font-semibold text-fb-secondary mb-1">Gender</label>
                        <div className="grid grid-cols-2 gap-3">
                            <label className="flex items-center justify-between p-2.5 bg-fb-bg border border-fb rounded-xl cursor-pointer hover:border-fb-blue transition">
                                <span className="text-xs font-medium text-fb-primary">Male</span>
                                <input
                                    type="radio"
                                    value="male"
                                    {...register('gender', { required: 'Please select a gender' })}
                                    className="radio radio-primary radio-xs"
                                />
                            </label>

                            <label className="flex items-center justify-between p-2.5 bg-fb-bg border border-fb rounded-xl cursor-pointer hover:border-fb-blue transition">
                                <span className="text-xs font-medium text-fb-primary">Female</span>
                                <input
                                    type="radio"
                                    value="female"
                                    {...register('gender', { required: 'Please select a gender' })}
                                    className="radio radio-primary radio-xs"
                                />
                            </label>
                        </div>
                        {errors?.gender && touchedFields?.gender && (
                            <p className="text-red-500 text-xs mt-1 pl-1">{errors?.gender?.message}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 bg-[#2D88FF] hover:bg-[#2D88FF] text-white font-bold text-base rounded-xl transition cursor-pointer shadow-sm flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    <span>Creating Account...</span>
                                </>
                            ) : (
                                "Sign Up"
                            )}
                        </button>
                    </div>
                </form>

                <div className="border-t border-fb my-4"></div>

                <div className="text-center pt-1">
                    <Link
                        to="/login"
                        className="text-xs md:text-sm font-semibold text-fb-blue hover:underline cursor-pointer"
                    >
                        Already have an account? Log in
                    </Link>
                </div>
            </div>
        </div>
    );
}
