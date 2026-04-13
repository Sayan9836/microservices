import { useEffect, useState } from 'react'
import { fetchData, type TodoItem } from '../../utils/util'
import Item from './Item';



const Todo = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    (async () => {
      const { data, success} = await fetchData<TodoItem[]>({url: 'http://localhost:8000/api/v1/todos', method: 'GET'})
      if (success && data) {
        setTodos(data);
      }
    })()
  }, [])


  const handleAddTodo = async () => {
    if (!text.trim()) {
      alert('Please enter a todo item');
      return;
    }

    const { data, success } = await fetchData<TodoItem>({
      url: 'http://localhost:8000/api/v1/todos',
      method: 'POST',
      data: {
        name: text 
      }
    });

    if (success && data) {
      setTodos((prev) => [...prev, data]);
      setText('');
    } else {
      alert('Failed to add todo item');
    }
  }


  return (
    <div>
      <div>
        <input type="text" onChange={(e) => setText(e.target.value)}/>
        <button onClick={handleAddTodo}>add</button>
      </div>
      {
        todos?.map((todo) => (
          <Item key={todo._id} todo={todo} setTodos={setTodos}/>
        ))
      }
    </div>
  )
}

export default Todo
