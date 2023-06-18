import logo from './logo.svg';
import './App.css';
import Comment from './Components/Comment/Comment'
import Thread from "./Components/Thread/Thread"
import {useState} from "react"
import ThreadDisplay from './Components/ThreadDisplay/ThreadDisplay';
import Header from './Components/Header/Header';
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";


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
    <>
    <div className="Header sticky-top shadow-sm">
      {threads.map(() => {
        return <Header>
        </Header>;
      })}
    </div>


    <div className="App">

      <header className="App-header">

        <div className='display-flex flex-column responsiveSize justify-content-center' style={{ height: "80vh" }}>
          <Router>
            <Routes>
              <Route path="/" element= {threads.map((thread)=>{
                return <ThreadDisplay  title = {thread.title}  username = {thread.username} text = {thread.text} />})} />
              <Route path="/thread" element={<Thread makeThread={makeThread} />}></Route>
            </Routes>
          </Router>
        </div>



      </header>
    </div>

    </>
  );
}

export default App;
