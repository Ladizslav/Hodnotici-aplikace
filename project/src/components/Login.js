import React, { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Zde byste přidali logiku pro přihlášení
    console.log('Přihlášení:', { username, password });

    // Vyčištění formuláře po odeslání
    setUsername('');
    setPassword('');
  };

  return (
    <div className="login">
      <h2>Přihlášení</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Uživatelské jméno:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Heslo:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Přihlásit</button>
      </form>
    </div>
  );
};

export default Login;