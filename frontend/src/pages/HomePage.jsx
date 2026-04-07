import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";

function HomePage() {
  const { authUser, logout } = useAuthStore();

  return (
    <div>
      <Navbar />

      {authUser && <button onClick={logout}>logout user</button>}
    </div>
  );
}

export default HomePage;
