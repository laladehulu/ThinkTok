
import "./Thread.css"
import Comment from "../Comment/Comment"
import {useEffect, useState} from "react"
import PostDisplay from "../PostDisplay/PostDisplay";
let sampleComment = {
    username:"",
    pfpURL:"",
    text:"",
}
export default function Thread({comments}){
   
    return <>

        <PostDisplay />
         {

            comments?.map((comment)=>{
                return <Comment username={comment.username}
                pfpURL={comment.pfpURL}
                text={comment.text}

                ></Comment>

            })

         }
         <button onClick={()=>{
           // setComments([...comments, {username:"ad",pfpURL:"sss",text:"sass"}])
         }}>

         </button>
    </>

}