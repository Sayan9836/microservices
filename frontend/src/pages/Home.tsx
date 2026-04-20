import { useNavigate } from "react-router-dom"
import Todo from "../components/Todo/Todo.tsx"

const Home = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="border-b border-neutral-900 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">FocusFlow</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-medium text-white">{user.name || 'User'}</span>
              <span className="text-xs text-neutral-500">{user.email}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 hover:border-neutral-700 transition-all text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">My Tasks</h1>
          <p className="text-neutral-500">Plan your day and stay productive.</p>
        </header>

        <section className="bg-neutral-900/30 border border-neutral-900 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl backdrop-blur-3xl">
          <Todo />
        </section>
      </main>

      {/* Footer Decoration */}
      <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-indigo-950/20 to-transparent pointer-events-none -z-10"></div>
    </div>
  )
}

export default Home

