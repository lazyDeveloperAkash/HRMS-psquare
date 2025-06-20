"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import "./Auth.css";
import Input from "../Tags/input/Input";
import PasswordInput from "../Tags/input/PasswordInput";
import Button from "../Tags/button/Button";
import Logo from "../Logo";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../../redux/slices/authSlice";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const dispatch = useDispatch();

  const password = watch("password");

  // Reset form when switching between login/signup
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    reset();
  };

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (isLogin) {
      dispatch(loginUser(data));
    } else {
      dispatch(registerUser(data));
    }
  };

  return (
    <div className="auth-container">
      <Logo />

      <div className="auth-content">
        <div className="auth-left">
          <div className="dashboard-preview">
            <img src="/signup.jpg" alt="Dashboard Preview" />
          </div>
          <div className="auth-description">
            <h2>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod
            </h2>
            <p>
              tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
              minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat.
            </p>
          </div>
          <div className="pagination-dots">
            <span className="dot active"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form">
            <h1>Welcome to Dashboard</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Full Name field - only show for signup */}
              {!isLogin && (
                <div className="form-group">
                  <Controller
                    name="name"
                    control={control}
                    rules={{
                      required: "Full name is required",
                      minLength: {
                        value: 2,
                        message: "Full name must be at least 2 characters",
                      },
                    }}
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Full name"
                        error={!!errors.name}
                        required
                      />
                    )}
                  />
                  {errors.name && (
                    <span className="error-message">
                      {errors.name.message}
                    </span>
                  )}
                </div>
              )}

              {/* Email field */}
              <div className="form-group">
                <Controller
                  name="email"
                  control={control}
                  rules={{
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="email"
                      placeholder="Email Address"
                      error={!!errors.email}
                      required
                    />
                  )}
                />
                {errors.email && (
                  <span className="error-message">{errors.email.message}</span>
                )}
              </div>

              {/* Password field */}
              <div className="form-group">
                <Controller
                  name="password"
                  control={control}
                  rules={{
                    required: "Password is required",
                    minLength: {
                      value: 5,
                      message: `Password must be at least 5 characters`,
                    },
                  }}
                  render={({ field }) => (
                    <PasswordInput
                      {...field}
                      placeholder="Password"
                      error={!!errors.password}
                      required
                    />
                  )}
                />
                {errors.password && (
                  <span className="error-message">
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Confirm Password field - only show for signup */}
              {!isLogin && (
                <div className="form-group">
                  <Controller
                    name="confirmPassword"
                    control={control}
                    rules={{
                      required: "Please confirm your password",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    }}
                    render={({ field }) => (
                      <PasswordInput
                        {...field}
                        placeholder="Confirm Password"
                        error={!!errors.confirmPassword}
                        required
                      />
                    )}
                  />
                  {errors.confirmPassword && (
                    <span className="error-message">
                      {errors.confirmPassword.message}
                    </span>
                  )}
                </div>
              )}

              {/* Forgot password link - only show for login */}
              {isLogin && (
                <div className="forgot-password">
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      alert("Forgot password functionality would go here");
                    }}
                  >
                    Forgot password?
                  </a>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={isSubmitting}
                className="auth-submit-button"
              >
                {isLogin ? "Login" : "Register"}
              </Button>
            </form>

            <div className="auth-footer">
              <span>
                {isLogin
                  ? "Don't have an account? "
                  : "Already have an account? "}
              </span>
              <a className="a" onClick={toggleAuthMode}>
                {isLogin ? "Register" : "Login"}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
