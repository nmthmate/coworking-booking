import { useAuth } from './hooks/useAuth';
import { Login } from './features/auth/Login';
import { RoomList } from './features/rooms/RoomList';
import { signOut } from 'firebase/auth';
import { auth } from './lib/firebase';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-20 text-gray-900">Betöltés...</p>;
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex justify-between items-center">
          <p>Be vagy jelentkezve: {user.email}</p>
          <button
            onClick={() => signOut(auth)}
            className="border border-gray-300 rounded px-3 py-2 bg-white text-gray-900"
          >
            Kijelentkezés
          </button>
        </div>
        <RoomList />
      </div>
    </div>
  );
}

export default App;