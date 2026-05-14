import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchData, type Category } from "../utils/util";

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    const { data, success } = await fetchData<Category[]>({
      url: "/tasks/categories",
      method: "GET",
    });
    if (success && data) {
      setCategories(data);
    }
    setLoading(false);
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const { data, success } = await fetchData<Category>({
      url: "/tasks/categories",
      method: "POST",
      data: { name: newCatName },
    });
    if (success && data) {
      setCategories((prev) => [...prev, data]);
      setNewCatName("");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    const { success, data } = await fetchData<Category>({
      url: `/tasks/categories/${id}`,
      method: "PATCH",
      data: { name: editName },
    });
    if (success && data) {
      setCategories((prev) => prev.map((c) => (c.id === id ? data : c)));
      setEditingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure? Tasks in this category will become uncategorized."))
      return;
    const { success } = await fetchData({
      url: `/tasks/categories/${id}`,
      method: "DELETE",
    });
    if (success) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-indigo-500/30">
      {/* Navbar */}
      <nav className="border-b border-neutral-900 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-20 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:border-neutral-700 transition-all">
              <svg className="w-5 h-5 text-neutral-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-lg font-bold tracking-tight">Collections</span>
          </Link>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Manage Collections</h1>
          <p className="text-neutral-500">Organize your tasks into meaningful groups.</p>
        </header>

        {/* Add Category Section */}
        <section className="mb-12">
          <form onSubmit={handleAdd} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center bg-neutral-900 border border-neutral-800 rounded-2xl p-2 shadow-2xl">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Name your new collection..."
                className="flex-1 bg-transparent border-none text-white px-5 py-4 focus:outline-none placeholder:text-neutral-600 text-lg font-medium"
              />
              <button
                type="submit"
                disabled={!newCatName.trim()}
                className="bg-white text-black font-bold px-8 py-4 rounded-xl hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </form>
        </section>

        {/* Categories List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-20 text-neutral-500 animate-pulse">Loading collections...</div>
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <div key={cat.id} className="group bg-neutral-900/50 border border-neutral-900 p-6 rounded-3xl hover:border-neutral-800 transition-all duration-300">
                {editingId === cat.id ? (
                  <div className="flex items-center gap-4">
                    <input
                      autoFocus
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 bg-neutral-950 border border-indigo-500/50 rounded-xl px-4 py-2 text-white focus:outline-none ring-4 ring-indigo-500/10"
                    />
                    <button
                      onClick={() => handleUpdate(cat.id)}
                      className="bg-indigo-600 px-4 py-2 rounded-xl text-sm font-bold hover:bg-indigo-500 transition-all"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="text-neutral-500 text-sm hover:text-white px-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
                        <span className="text-xl font-bold text-indigo-400">{cat.name[0].toUpperCase()}</span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-white">{cat.name}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => {
                          setEditingId(cat.id);
                          setEditName(cat.name);
                        }}
                        className="p-3 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-xl transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="p-3 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-20 border border-dashed border-neutral-900 rounded-[3rem]">
              <p className="text-neutral-500">No collections yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Categories;
