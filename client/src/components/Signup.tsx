import React from "react";
import { signupUser } from "../lib/auth";
import useSignupForm from "../custom-hooks/useSignupForm";
import { Lock, Person } from "@material-ui/icons";

type ISignupProps = {
  setLoggedIn: (isLoggedIn: boolean) => void;
  setStatus: (status: string) => void;
  setShowSignup: (signup: boolean) => void;
};

function Signup({ setLoggedIn, setStatus, setShowSignup }: ISignupProps) {
  const { inputs, handleInputChange, handleSubmit } = useSignupForm(
    signupUser,
    setStatus,
    setLoggedIn,
    setShowSignup
  );
  const { username, name, password } = inputs;

  return (
    <div id="signup-container">
      <div className="login-item">
        <form onSubmit={handleSubmit} className="form form-login">
          <div className="form-field">
            <Person />
            <span className="hidden">Email</span>
            <input
              id="login-username"
              type="text"
              name="username"
              className="form-input"
              placeholder="Email"
              required
              value={username}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-field">
            <Person />
            <span className="hidden">Name</span>
            <input
              id="login-username"
              type="text"
              name="name"
              className="form-input"
              placeholder="Full name"
              required
              value={name}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-field">
            <Lock />
            <span className="hidden">Password</span>
            <input
              id="login-password"
              name="password"
              type="password"
              className="form-input"
              placeholder="Password"
              required
              value={password}
              onChange={handleInputChange}
            />
          </div>

          <div className="form-field">
            <button type="submit">Sign up</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
