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
import { fetchThreadJSONTree } from './APICalls';


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

  function fetchUpdatedThreadJson(){

  }
  useEffect( ()=>{
   
    console.log("thread changed", threads);
   return ()=>{}
  },[threads])

  return (
    <>
    <div className="Header sticky-top shadow-sm">
    <Header>
        </Header>;
    </div>


    <div className="App">

      <header className="App-header">

        <div className='display-flex flex-column ' style={{ height: "80vh" }}>
          <Router>
            <Routes>
                  
            <Route path="/" element={<Upload setThreads={setThreads} />}></Route>
              <Route path="/GenerativeCommunity" element= {<AICommunity threads={threads}></AICommunity>} />
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
