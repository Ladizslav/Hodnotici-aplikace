import React, { useState } from 'react';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(''); 

  const handleSubmit = (e) => {
    e.preventDefault();

    const emailPattern = /^[^\s@]+@spsejecna\.cz$/;
    if (!emailPattern.test(email)) {
      setError('E-mail musí končit na @spsejecna.cz');
      return;
    }

    if (password !== confirmPassword) {
      setError('Hesla se neshodují!');
      return;
    }

    console.log('Registrace:', { email, password });

    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(''); 
  };

  return (
    <div className="register">
      <h2>Registrace</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(''); 
            }}
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