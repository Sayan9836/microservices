import { fetchData, type TodoItem } from "../../utils/util"

const Item = ({todo, setTodos}: {todo: TodoItem; setTodos: React.Dispatch<React.SetStateAction<TodoItem[]>>}) => {

  const handleDelete = async(id: string) => {
    const {data, success, error} = await fetchData<TodoItem>({
      url: `http://localhost:8000/api/v1/todos/${id}`,
      method: 'DELETE'
    });

    if (success && data) {
    //   // Fetch updated todos list
    //   const { data: todosData, success: todosSuccess } = await fetchData<TodoItem[]>({
    //     url: 'http://localhost:8000/api/v1/todos',
    //     method: 'GET'
    //   });

    //   if (todosSuccess && todosData) {
    //     setTodos(todosData);
    //   } else {
    //     // Fallback: filter locally if fetch fails
    //   }

      setTodos(prev => prev.filter(t => t._id !== id));

    } else if (error) {
      alert(`Delete failed: ${error}`);
    }
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      minWidth: '400px',
      padding: '10px',
      borderBottom: '1px solid #eee'
    }}>
      <span style={{flex: 1}}>{todo.name}</span>
      <button
        onClick={() => handleDelete(todo._id)}
        style={{
          backgroundColor: '#ff4444',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          padding: '4px 8px',
          cursor: 'pointer',
          marginLeft: '10px'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#cc0000'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ff4444'}
      >
        Delete
      </button>
    </div>
  );
}

export default Item;
