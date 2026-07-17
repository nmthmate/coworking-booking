import { useAuth } from './hooks/useAuth';
import { Login } from './features/auth/Login';
import { RoomList } from './features/rooms/RoomList';
import { MyBookings } from './features/rooms/MyBookings';
import { signOut } from 'firebase/auth';
import { auth } from './lib/firebase';

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p className="text-center mt-20 text-gray-900">Betöltés...</p>;
  if (!user) return <Login />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-2xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-lg font-semibold">Coworking Booking</h1>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm font-medium shrink-0">
              {user.email?.[0]?.toUpperCase() ?? '?'}
            </div>
            <span className="text-sm text-gray-700 hidden sm:inline">{user.email}</span>
            <button
              onClick={() => signOut(auth)}
              className="border border-gray-300 rounded px-3 py-2 text-sm bg-white text-gray-900 hover:bg-gray-50"
            >
              Kijelentkezés
            </button>
          </div>
        </div>
      </header>
      <div className="max-w-2xl mx-auto px-6 py-6">
        <MyBookings />
        <RoomList />
      </div>
    </div>
  );
}

export default App;