import logo from './logo.svg';
import './App.css';
import Comment from './Components/Comment/Comment'
import Thread from "./Components/Thread/Thread"
import Upload from "./Pages/Upload/Upload"
import {useEffect, useState} from "react"
import ThreadDisplay from './Components/ThreadDisplay/ThreadDisplay';

import Header from './Components/Header/Header';
import AICommunity from "./Pages/AICommunity/AICommunity"

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import { initialFetchThreadJSONTree, setUpdate } from './APICalls';


let sampleThread = {
  title: "",
  username :"",
  text :"",

}
function App() {
  let [threads, setThreads] = useState([{title:'Does anyone know about this book?',username:"hack",text:"Hello all! Im a student attending a local reading Competition in Berkeley. Anyone know about this book?", comments:[]}]);
  let [currentThread,setCurrentThread] = useState();
  function makeThread(newThread){
    setThreads([...threads,newThread]);
  }

  function fetchUpdatedThreadJson(){

  }
  useEffect(()=>{
    setUpdate(setThreads)
  },[])
  useEffect( ()=>{

    console.log("thread changed", threads, currentThread);
    setCurrentThread(threads[0]);
   return ()=>{}
  },[threads, currentThread])

  return (
    <>
    <div className="Header sticky-top shadow-sm">
    <Header>
        </Header>;
    </div>


    <div className="App">

      <header className="App-header">

        <div className='display-flex flex-column responsiveSize justify-content-center' style={{ height: "80vh" }}>
          <Router>
            <Routes>
                  
          <Route path="/" element={<Upload setThreads={setThreads} setCurrentThread={setCurrentThread} />}></Route>
              <Route path="/GenerativeCommunity" element= {<AICommunity threads={threads} setCurrentThread={setCurrentThread}></AICommunity>} />
              <Route path="/thread" element={<Thread makeThread={makeThread} currentThread={currentThread}/>}></Route>
             
            </Routes>
          </Router>
        </div>



      </header>
    </div>

    </>
  );
}

export default App;
