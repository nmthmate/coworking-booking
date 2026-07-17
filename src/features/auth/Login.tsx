import { useState } from 'react';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error(err);
      if (err instanceof Error && 'code' in err) {
        const code = (err as { code: string }).code;
        if (code === 'auth/email-already-in-use') {
          setError('Ez az email cím már foglalt.');
        } else if (code === 'auth/weak-password') {
          setError('A jelszó legalább 6 karakter legyen.');
        } else if (code === 'auth/invalid-credential') {
          setError('Hibás email vagy jelszó.');
        } else {
          setError('Váratlan hiba történt. Próbáld újra.');
        }
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error(err);
      setError('Google bejelentkezés sikertelen.');
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-20 p-6 border rounded-lg">
      <h1 className="text-xl font-medium mb-4">
        {isRegister ? 'Regisztráció' : 'Bejelentkezés'}
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        <input
          type="password"
          placeholder="Jelszó"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="bg-black text-white rounded px-3 py-2">
          {isRegister ? 'Regisztráció' : 'Bejelentkezés'}
        </button>
      </form>
      <button
        onClick={handleGoogleLogin}
        className="w-full mt-3 border rounded px-3 py-2"
      >
        Bejelentkezés Google-lel
      </button>
      <p className="text-sm mt-3 text-center">
        <button onClick={() => setIsRegister(!isRegister)} className="underline">
          {isRegister ? 'Már van fiókod? Jelentkezz be' : 'Nincs még fiókod? Regisztrálj'}
        </button>
      </p>
    </div>
  );
}