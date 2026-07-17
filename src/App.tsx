import { useAuth } from './hooks/useAuth';
import { Login } from './features/auth/Login';
import { signOut } from 'firebase/auth';
import { auth } from './lib/firebase';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-20">Betöltés...</p>;
  if (!user) return <Login />;

  return (
    <div className="p-6">
      <p>Be vagy jelentkezve: {user.email}</p>
      <button
        onClick={() => signOut(auth)}
        className="mt-3 border rounded px-3 py-2"
      >
        Kijelentkezés
      </button>
    </div>
  );
}

export default App;