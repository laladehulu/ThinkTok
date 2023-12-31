
import "./PostDisplay.css"
import Comment from "../Comment/Comment"
import {useRef, useState, useEffect,useLayoutEffect } from "react"
import FeatherIcon from 'feather-icons-react';

import gsap, {  } from "gsap"
let sampleComment = {
    username: "",
    pfpURL: "",
    text: "",
}
export default function PostDisplay() {
    const [comments, setComments] = useState([]);
    const selfRef = useRef();
    var voteNumber = -99;
    var voted = 0;
    // 0: not voted
    // 1: upvoted
    // 2: downvoted

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {

          gsap.fromTo(selfRef.current, {scale:0.7, opacity:0}, { duration: 0.4, ease: "back.out(1)", scale:1, opacity:1});

        }, selfRef);

        return () => ctx.revert();
      }, []);
    function trimText(text){
        return text.length>350? (text.slice(0,350)+"........."): text
    }

    useEffect(() => {
        voteNumber = document.getElementById("voteNumber") ? document.getElementById("voteNumber").innerHTML : 0;
    },);

    function decrementVote(){
        let temp = document.getElementById("voteNumber");
        if (temp.innerHTML > 0 && voted != 2) {
            temp.innerHTML = parseInt(voteNumber)-1;
            voted = 2;
        }
    }

    function incrementVote(){
        let temp = document.getElementById("voteNumber");
        if (voted != 1) {
            temp.innerHTML = parseInt(voteNumber)+1;
            voted = 1;
        }
    }


    return <>
        <div className="thread-display w-auto row text-left border rounded flex" style={{ width: "50vw"}} ref ={selfRef} >
            <div className="col-sm-1 col-2 d-flex flex-column justify-content-center text-dark">
                <a type="button" onClickCapture={incrementVote} className="acolor py-3 voteButton"><FeatherIcon icon="arrow-up" /></a>
                <p id="voteNumber" className="justify-content-center">5</p>
                <a type="button" onClickCapture={decrementVote} className="acolor py-3 voteButton"><FeatherIcon icon="arrow-down" /></a>
            </div>
            <div className="col-sm-11 col-10 d-flex text-dark position-relative contentpadding py-4 border-left">
                <div className="text-left" style={{textAlign:"left"}}>
                    <div className="font-weight-bold threadTitle" style={{fontSize:"1.8rem"}}>Hello Title</div>
                    <div style={{ fontSize: "0.8rem", fontWeight: "300"}}>
                        FlyingDomingo
                    </div>
                    <div className="mt-3" >
                          {("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")}
                    </div>
                    <div className="position-relative " >
                    </div>
                </div>
            </div>
        </div>



    </>

}