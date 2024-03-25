import { useEffect, useState} from "react";
import io from "socket.io-client";
import axios from "axios";
const socket = io.connect("http://127.0.0.1:3000");


function App() {
  const [todoVal,setTodoVal] =useState("");
  const [todos,setTodos] = useState([]);

  useEffect(() => {
    
    socket.on("receive_message", (data) => {
      axios.get("http://127.0.0.1:3000/todo/data").then((items)=>setTodos(items.data));
      alert(data.message);
    });
  }, [socket]);

  const addTodo= async()=>{
    let copyTodo = [...todos];
    copyTodo.push({id:todos.length+1,name:todoVal});
    await axios.post("http://127.0.0.1:3000/todo/data",{id:todos.length+1,name:todoVal});
    setTodos(copyTodo);
    console.log("Button clicked");
    socket.emit("send_message", { message: "Hello from client" });
  }

  return (
    <div className="App">
      <input value={todoVal} onChange={(e)=>{
          setTodoVal(e.target.value)
          
       }}/>
      <button onClick={addTodo}>Add todo</button>
      <div>
          {todos.map((item)=>{
             return <h1 key={item.id} >{item.name}</h1>
          })}
        </div>
    </div>
  );
}



export default App;