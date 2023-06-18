
import "./ThreadDisplay.css"
import Comment from "../Comment/Comment"
import {useRef, useState, useEffect,useLayoutEffect } from "react"
import gsap, {  } from "gsap"
import { useNavigate } from "react-router-dom"
let sampleComment = {
    username: "",
    pfpURL: "",
    text: "",
}
export default function ThreadDisplay({title,text,username}) {
    const [comments, setComments] = useState([]);
    const selfRef = useRef();
   let navigate =  useNavigate();
    useEffect(() => {
        //gsap.fromTo(selfRef.current, {scale:0.7, opacity:0}, { duration: 0.4, ease: "back.out(1)", scale:1, opacity:1});
      }, []);
    function trimText(text){
        return text?.length>350? (text.slice(0,350)+"........."): text
    }

    function decrementVote(e){
        let voteNumber = document.getElementById("voteNumber") ? document.getElementById("voteNumber") : 0;
        console.log(voteNumber);
        if (voteNumber.innerHTML > 0) {
            voteNumber.innerHTML = parseInt(voteNumber.innerHTML)-1;
        }

        if (!e) var e = window.event;
        e.cancelBubble = true;
        if (e.stopPropagation) e.stopPropagation();
    }


    return <>
        <div onClick={event => {navigate("/thread")}} className="thread-display row text-left border rounded flex" style={{ width: "50vw"}} ref ={selfRef} >
            <div className="col-1 d-flex flex-column justify-content-center text-dark">
                <a type="button" onClickCapture={e => decrementVote(e)} className="py-3 voteButton">△</a>
                <p id="voteNumber" className="justify-content-center">5</p>
                <a type="button" onClickCapture={e => decrementVote(e)} className=" py-3 voteButton">
                ▽
                </a>
            </div>
            <div className="col-11 d-flex text-dark position-relative contentpadding py-4 border-left">
                <div className="text-left" style={{textAlign:"left"}}>
                    <div className="font-weight-bold threadTitle" style={{fontSize:"1.8rem"}}>{title}</div>
                    <div style={{ fontSize: "0.8rem", fontWeight: "300"}}>
                   {username}
                    </div>
                    <div className="mt-3" >
                          {trimText(text)}
                    </div>
                    <div className="position-relative " >
                    </div>
                </div>
            </div>
        </div>



    </>

}