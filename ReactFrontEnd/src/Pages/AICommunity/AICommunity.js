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



export default function Upload({threads}) {

    const selfRef = useRef();

    let navigate = useNavigate();
    const [url, setUrl] = useState();
    useEffect(() => {
        console.log("AI COMMUNITY ")
        //gsap.fromTo(selfRef.current, {scale:0.7, opacity:0}, { duration: 0.4, ease: "back.out(1)", scale:1, opacity:1});
    }, [threads]);
    function uploadByUrl(url) {

    }




    return <>
        {threads.map((thread) => {
            return <ThreadDisplay onClick={() => {

            }} title={thread.title} username={thread.username} text={thread.text}></ThreadDisplay>})}

    </>

}