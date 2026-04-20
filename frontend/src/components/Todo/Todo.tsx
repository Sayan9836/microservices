import { useEffect, useState } from 'react'
import { fetchData, type TodoItem } from '../../utils/util'
import Item from './Item';

const Todo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const { data, success } = await fetchData<TodoItem[]>({ url: '/tasks', method: 'GET' })
      if (success && data) {
        setTodos(data);
      }
      setLoading(false);
    })()
  }, [])

  const handleAddTodo = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!text.trim()) return;

    const { data, success } = await fetchData<TodoItem>({
      url: '/tasks',
      method: 'POST',
      data: {
        name: text
      }
    });

    if (success && data) {
      setTodos((prev) => [data, ...prev]);
      setText('');
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Input Area */}
      <form onSubmit={handleAddTodo} className="relative group mb-10">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000 group-focus-within:duration-200"></div>
        <div className="relative flex items-center bg-neutral-900 rounded-2xl p-2 border border-neutral-800 shadow-xl">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1 bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder:text-neutral-500 text-lg"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-neutral-200 transition-colors active:scale-95 disabled:opacity-50 disabled:active:scale-100"
          >
            Add Task
          </button>
        </div>
      </form>

      {/* List Area */}
      <div className="space-y-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <svg className="animate-spin h-8 w-8 text-indigo-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-neutral-500 font-medium">Loading your tasks...</p>
          </div>
        ) : todos.length > 0 ? (
          todos.map((todo) => (
            <Item key={todo.id} todo={todo} setTodos={setTodos} />
          ))
        ) : (
          <div className="text-center py-20 bg-neutral-900/50 rounded-3xl border border-dashed border-neutral-800">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-neutral-800 mb-4">
              <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-white">No tasks yet</h3>
            <p className="text-neutral-500 mt-1">Start by adding one above!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Todo

