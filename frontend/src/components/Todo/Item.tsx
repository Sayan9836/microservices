import { fetchData, type TodoItem } from "../../utils/util"

const Item = ({ todo, setTodos }: { todo: TodoItem; setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>> }) => {

  const handleDelete = async (id: string) => {
    const { success } = await fetchData<TodoItem>({
      url: `/tasks/${id}`,
      method: 'DELETE'
    });

    if (success) {
      setTodos(prev => prev.filter(t => t.id !== id));
    }
  }

  const handleToggle = async () => {
    const { success } = await fetchData<TodoItem>({
      url: `/tasks/${todo.id}`,
      method: 'PATCH',
      data: {
        completed: !todo.completed
      }
    });

    if (success) {
      setTodos(prev => prev.map(t => t.id === todo.id ? { ...t, completed: !t.completed } : t));
    }
  }

  return (
    <div className="group flex items-center justify-between bg-neutral-900 border border-neutral-800 p-4 rounded-2xl hover:border-neutral-700 hover:bg-neutral-800/50 transition-all duration-300">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={handleToggle}
          className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
            todo.completed 
              ? 'bg-indigo-500 border-indigo-500 text-white' 
              : 'border-neutral-700 hover:border-neutral-500'
          }`}
        >
          {todo.completed && (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>
        <span className={`text-lg transition-all ${todo.completed ? 'text-neutral-600 line-through' : 'text-neutral-200'}`}>
          {todo.name}
        </span>
      </div>

      <button
        onClick={() => handleDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-neutral-500 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
        title="Delete task"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
}

export default Item;

