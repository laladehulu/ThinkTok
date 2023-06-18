
import "./Thread.css"
import Comment from "../Comment/Comment"
import {useEffect, useState} from "react"
import PostDisplay from "../PostDisplay/PostDisplay";
import UserReply from "../UserReply/UserReply"
import { useNavigate } from "react-router-dom";
let sampleComment = {
    username:"",
    pfpURL:"",
    text:"",
}
export default function Thread({currentThread}){
    const navigate = useNavigate();
    function onBringUpUserReply(){
        setDisplay(!display);
    }
    const [display,setDisplay] = useState(true);
    console.log("thread name",currentThread?.title)
    return <>
    <button className="back-button btn btn-primary" onClick={()=>{
        navigate("/GenerativeCommunity")
    }}>
        back
    </button>
    <PostDisplay currentThread={currentThread} />
         {

            currentThread?.comments?.map((comment)=>{
                return <Comment username={comment.username}
                pfpURL={comment.pfpURL}
                text={comment.text}
                onBringUpUserReply={
                    onBringUpUserReply
                }
                ></Comment>

            })

         }
         <button onClick={()=>{
           // setComments([...comments, {username:"ad",pfpURL:"sss",text:"sass"}])
         }}>
        {display?      <UserReply></UserReply>:null

         }
    

         </button>
    </>

}