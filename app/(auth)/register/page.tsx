"use client"

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock } from "lucide-react";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = () => {
    if (!email || !name) return;
    // TODO: integrate API
    setOtpSent(true);
  };

  const handleRegister = () => {
    // TODO: verify OTP + register API
    console.log({ name, email, otp });
  };

  const handleGoogleSignup = () => {
    // TODO: Google OAuth
    console.log("Google signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl">
        <CardContent className="p-6 space-y-6">
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-semibold">Create Account</h1>
            <p className="text-sm text-muted-foreground">
              Sign up to get started
            </p>
          </div>

          {/* Name + Email + OTP */}
          <div className="space-y-4">
            {/* Name Field */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Email + Verify */}
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
                disabled={!email || !name}
              >
                Verify
              </Button>
            </div>

            {/* OTP Field (hidden initially) */}
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

            {/* Register Button */}
            {otpSent && (
              <Button className="w-full" onClick={handleRegister}>
                Register with OTP
              </Button>
            )}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-2">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-400">OR</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          {/* Google Signup */}
          <Button
            variant="outline"
            className="w-full flex items-center gap-2 justify-center"
            onClick={handleGoogleSignup}
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
  );
};

export default RegisterPage;