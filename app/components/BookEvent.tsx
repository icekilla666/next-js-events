"use client";

import { useState } from "react";

function BookEvent() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisable(true);
    setTimeout(() => {
      setSubmitted(true);
      setIsDisable(false);
      if (email.length == 0) {
        setHasError(true);
      } else {
        setHasError(false);
      }
    }, 1000);
  };
  return (
    <div id="book-event">
      {submitted && !hasError ? (
        <p className="text-sm">Thank you for signing up!</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email Address</label>
            <input
              className={hasError ? "border border-red-500" : ""}
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
            />
            {hasError && (
              <p className="text-xs text-red-500">
                Please fill in the required field
              </p>
            )}
          </div>

          <button
            type="submit"
            className={
              isDisable
                ? "bg-gray-400 cursor-not-allowed text-gray-200"
                : "button-submit"
            }
            disabled={isDisable}
          >
            {isDisable ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </span>
            ) : (
              "Submit"
            )}
          </button>
        </form>
      )}
    </div>
  );
}

export default BookEvent;
