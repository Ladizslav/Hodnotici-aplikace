import React, { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validace hesel
    if (password !== confirmPassword) {
      alert('Hesla se neshodují!');
      return;
    }

    // Zde byste přidali logiku pro registraci
    console.log('Registrace:', { email, password });

    // Vyčištění formuláře po odeslání
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  return (
    <div className="register">
      <h2>Registrace</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <div>
          <label>Znovu heslo:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Registrovat</button>
      </form>
    </div>
  );
};

export default Register;