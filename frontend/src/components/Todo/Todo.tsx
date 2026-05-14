import { useEffect, useState, useMemo } from 'react'
import { fetchData, type TodoItem, type Category } from '../../utils/util'
import Item from './Item';
import CategoryManager from './CategoryManager';

const Todo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [text, setText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string>(''); // For filtering the list
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [todosRes, categoriesRes] = await Promise.all([
        fetchData<TodoItem[]>({ url: '/tasks', method: 'GET' }),
        fetchData<Category[]>({ url: '/tasks/categories', method: 'GET' })
      ]);

      if (todosRes.success && todosRes.data) {
        setTodos(todosRes.data);
      }
      if (categoriesRes.success && categoriesRes.data) {
        setCategories(categoriesRes.data);
      }
      setLoading(false);
    })()
  }, [])

  const filteredTodos = useMemo(() => {
    if (!activeFilter) return todos;
    return todos.filter(t => t.categoryId === activeFilter);
  }, [todos, activeFilter]);

  const handleAddTodo = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;

    const { data, success } = await fetchData<TodoItem>({
      url: '/tasks',
      method: 'POST',
      data: {
        name: text,
        categoryId: selectedCategory || null
      }
    });

    if (success && data) {
      setTodos((prev) => [data, ...prev]);
      setText('');
      // Keep category selected for "burst" adding, or clear it if you prefer
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Category Manager (Filter & Manage) */}
      <CategoryManager 
        categories={categories} 
        setCategories={setCategories} 
        selectedCategory={activeFilter}
        onSelect={setActiveFilter}
      />

      {/* Input Area */}
      <form onSubmit={handleAddTodo} className="mb-12 group">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-1000"></div>
            <div className="relative flex items-center bg-neutral-900 border border-neutral-800 rounded-2xl p-2 shadow-2xl">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Assign a new task..."
                className="flex-1 bg-transparent border-none text-white px-5 py-4 focus:outline-none placeholder:text-neutral-600 text-lg font-medium"
              />
              <button
                type="submit"
                disabled={!text.trim()}
                className="bg-indigo-600 text-white font-bold px-8 py-4 rounded-xl hover:bg-indigo-500 transition-all active:scale-95 shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:grayscale"
              >
                Create
              </button>
            </div>
          </div>

          {/* Quick Category Assignment for New Task */}
          <div className="flex items-center gap-3 px-2">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Assign to:</span>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 text-neutral-400 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 ring-indigo-500/50 hover:border-neutral-700 transition-all appearance-none cursor-pointer"
            >
              <option value="">No Category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
        </div>
      </form>

      {/* List Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2 mb-2">
          <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
            {activeFilter ? `${categories.find(c => c.id === activeFilter)?.name} Tasks` : 'All Tasks'}
          </h4>
          <span className="text-[10px] bg-neutral-800 text-neutral-400 px-2 py-0.5 rounded-full font-bold">
            {filteredTodos.length}
          </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-8 h-8 border-2 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-neutral-500 text-sm font-medium">Syncing with AWS...</p>
          </div>
        ) : filteredTodos.length > 0 ? (
          filteredTodos.map((todo) => (
            <Item key={todo.id} todo={todo} setTodos={setTodos} />
          ))
        ) : (
          <div className="text-center py-24 bg-neutral-900/20 rounded-[2rem] border border-dashed border-neutral-800/50">
            <h3 className="text-neutral-500 font-medium italic">Empty collection</h3>
          </div>
        )}
      </div>
    </div>
  )
}

export default Todo


