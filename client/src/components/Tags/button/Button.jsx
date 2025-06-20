import { forwardRef } from "react";
import "./Button.css";

const Button = forwardRef(
  (
    {
      children,
      disabled = false,
      loading = false,
      className = "",
      type = "button",
      ...props
    },
    ref
  ) => {
    const buttonClasses = [
      "custom-button",
      "button-primary",
      disabled && "button-disabled",
      loading && "button-loading",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        ref={ref}
        type={type}
        className={buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? <div className="button-spinner" /> : children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
