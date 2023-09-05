/*import * as React from 'react';
import { useState } from 'react';
import { useLogin, useNotify, Notification } from 'react-admin';

const LoginPage = ({ theme }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const login = useLogin();
  const notify = useNotify();

  const handleSubmit = e => {
    e.preventDefault();
    login({ email, password }).catch(() =>
      notify('Invalid email or password')
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Usuario</h3>
      <input
        name="email"
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <h3>Pin</h3>
      <input
        name="password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
    </form>
  );
};

export default LoginPage;*/

import { Login } from 'react-admin';

const MyLoginPage = () => (
    <Login
        // A random image that changes everyday
        backgroundImage="/ycp-bahia-background.jpg"
    />
);

export default MyLoginPage;
