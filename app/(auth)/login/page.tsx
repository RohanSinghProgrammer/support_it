"use client"

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";
import HomeNav from "@/components/home-nav";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const handleSendOtp = () => {
        if (!email) return;
        // TODO: integrate API
        setOtpSent(true);
    };

    const handleLogin = () => {
        // TODO: verify OTP API
        console.log({ email, otp });
    };

    const handleGoogleLogin = () => {
        // TODO: Google OAuth
        console.log("Google login");
    };

    return (
        <section>
            <HomeNav />
            <div className="min-h-screen flex items-center justify-center">
                <Card className="w-full max-w-md shadow-xl rounded-2xl">
                    <CardContent className="p-6 space-y-6">
                        <div className="text-center space-y-1">
                            <h1 className="text-2xl font-semibold">Welcome Back</h1>
                            <p className="text-sm text-muted-foreground">
                                Login to continue
                            </p>
                        </div>

                        {/* Email + OTP */}
                        <div className="space-y-4">
                            <div className="flex gap-2">
                                <div className="relative w-full">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>

                                <Button
                                    variant="secondary"
                                    onClick={handleSendOtp}
                                    disabled={!email}
                                >
                                    Verify
                                </Button>
                            </div>

                            {otpSent && (
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="pl-9"
                                    />
                                </div>
                            )}

                            {otpSent && (
                                <Button className="w-full" onClick={handleLogin}>
                                    Login with OTP
                                </Button>
                            )}
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-2">
                            <div className="h-px bg-gray-200 flex-1" />
                            <span className="text-xs text-gray-400">OR</span>
                            <div className="h-px bg-gray-200 flex-1" />
                        </div>

                        {/* Google Login */}
                        <Button
                            variant="outline"
                            className="w-full flex items-center gap-2 justify-center"
                            onClick={handleGoogleLogin}
                        >
                            <img
                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                alt="google"
                                className="h-4 w-4"
                            />
                            Continue with Google
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </section>
    );
};

export default LoginPage;