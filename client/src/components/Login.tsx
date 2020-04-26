import React from "react";
import { authenticateUser } from "../lib/auth";
import useLoginForm from "../custom-hooks/useLoginForm";
import { Lock, Person } from "@material-ui/icons";

type ILoginProps = {
  setLoggedIn: (isLoggedIn: boolean) => void;
  setStatus: (status: string) => void;
};

function Login({ setLoggedIn, setStatus }: ILoginProps) {
  const { inputs, handleInputChange, handleSubmit } = useLoginForm(
    authenticateUser,
    setStatus,
    setLoggedIn
  );
  const { username, password } = inputs;

  return (
    <div id="login-container">
      <div className="login-item">
        <form onSubmit={handleSubmit} className="form form-login">
          <div className="form-field">
            <Person />
            <span className="hidden">Username</span>
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
            <button type="submit">Log In</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
