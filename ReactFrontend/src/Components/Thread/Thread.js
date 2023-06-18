
import "./Thread.css"
import Comment from "../Comment/Comment"
import {useState} from "react"
let sampleComment = {
    username:"",
    pfpURL:"",
    text:"",
}
export default function Thread(){
    const [comments, setComments] = useState([]);
    
    return <>
         {
            
            comments.map((comment)=>{
                return <Comment username={comment.username}
                pfpURL={comment.pfpURL}
                text={comment.text}
                
                ></Comment>

            })

         }
         <button onClick={()=>{
            setComments([...comments, {username:"ad",pfpURL:"sss",text:"sass"}])
         }}>

         </button>
    </>

}