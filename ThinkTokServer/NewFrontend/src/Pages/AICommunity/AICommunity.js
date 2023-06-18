import ThreadDisplay from "../../Components/ThreadDisplay/ThreadDisplay"
import "./AICommunity.css"

import Dropzone from 'react-dropzone'

import { useRef, useState, useEffect, useLayoutEffect } from "react"
import gsap, { } from "gsap"

import { useNavigate } from "react-router-dom"

let sampleComment = {
    username: "",
    pfpURL: "",
    text: "",
}



export default function Upload({threads, setCurrentThread}) {

    const selfRef = useRef();

    let navigate = useNavigate();
    const inputOverlayRef = useRef();
    const [url, setUrl] = useState();
    const [title,setTitle] = useState("title");
    const [text,setText] = useState("ask a question, or just say hi!");
    useEffect(() => {
        console.log("AI COMMUNITY THREAD UPDATE", threads)
        //gsap.fromTo(selfRef.current, {scale:0.7, opacity:0}, { duration: 0.4, ease: "back.out(1)", scale:1, opacity:1});
    }, [threads]);
    function uploadByUrl(url) {

    }
    function startInput(){
        gsap.fromTo(inputOverlayRef.current,{y:250, }, {y:0})
    }
    function finishInput(event){

        gsap.fromTo(inputOverlayRef.current,{y:0, }, {y:250})
        alert("submitted " + title + ": " + event.target.value)
    }

    useEffect(() => {
        gsap.fromTo(inputOverlayRef.current,{y:0, }, {y:250})
        document.getElementById("usermsg").addEventListener("keydown", submitOnEnter);
    }, []);

    function submitOnEnter(event) {
        if (event.which === 13 && !event.shiftKey) {
            if (!event.repeat) {
                finishInput(event);
            }

            event.preventDefault(); // Prevents the addition of a new line in the text field
            event.target.value = "";
        }
    }


    return <>
        {threads?.map((thread) => {
            return <ThreadDisplay onClick={() => {
                alert("set current thread"+ thread.title)
                setCurrentThread(thread);
            }} title={thread.title} username={thread.username} text={thread.text}></ThreadDisplay>})}
        <button className="make-post btn btn-primary" onClick={startInput}> New</button>
        <div className="make-post-overlay " ref={inputOverlayRef}>
            <div className="shadow-sm rounded border p-3">
                <div className="px-3">
                    <p className="flex-column w-100 postTitle">Post title:</p>
                    <input id="usermsgtitle" type="text" className="comment-text inputRemoveBorder border-bottom" onChange={e=>setTitle(e.target.value)}>

                    </input>
                </div>
                <br></br>
                <div className="px-3">
                    <p className="flex-column w-100 postTitle">Body:</p>
                    <textarea id="usermsg" type="text" className="comment-text inputRemoveBorder border-bottom" onChange={e=>setText(e.target.value)}>

                    </textarea>
                </div>
            </div>
        </div>
    </>

}