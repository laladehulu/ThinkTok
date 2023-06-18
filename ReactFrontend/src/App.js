import logo from './logo.svg';
import './App.css';
import Comment from './Components/Comment/Comment'
import Thread from "./Components/Thread/Thread"
import {useState} from "react"
import ThreadDisplay from './Components/ThreadDisplay/ThreadDisplay';


let sampleThread = {
  title: "",
  username :"",
  text :"",

}
function App() {
  let [threads, setThreads] = useState([{title:'dixie',username:"hack",text:"hack", comments:[]}]);
  function makeThread(newThread){
    setThreads([...threads,newThread]);
  }

  return (
    
    <div className="App">

      <header className="App-header">

        <div className='mt-2 display-flex flex-column ' style={{height:"80vh"}}>
            {threads.map((thread)=>{
              return <ThreadDisplay  title = {thread.title}  username = {thread.username} text = {thread.text} >
                
              </ThreadDisplay>
            })}
        </div>

      
      
      </header>
    </div>
  );
}

export default App;
