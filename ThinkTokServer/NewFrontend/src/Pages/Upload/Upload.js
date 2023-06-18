
import "./Upload.css"

import Dropzone from 'react-dropzone'
import { useRef, useState, useEffect, useLayoutEffect } from "react"
import gsap, { } from "gsap"

import { useNavigate } from "react-router-dom"
let sampleComment = {
    username: "",
    pfpURL: "",
    text: "",
}



export default function Upload({setThreads}) {

    const selfRef = useRef();
    
    let navigate = useNavigate();
    const [url, setUrl] = useState("https://web.stanford.edu/~jurafsky/slp3/2.pdf");
    useEffect(() => {
        //gsap.fromTo(selfRef.current, {scale:0.7, opacity:0}, { duration: 0.4, ease: "back.out(1)", scale:1, opacity:1});
    }, []);
    function timeout(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
 
    async function uploadByUrl(url){

        //send url to server, let it create vectorDB
         await fetch("/load?pdf="+url);
         await timeout(2000);
         let filename  = url.split('/').pop().split('.')[0];
         
       let fetchedThreadJSON=  await fetch("/query/"+filename,
            {
                method: "GET", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
                credentials: "same-origin", // include, *same-origin, omit
                headers: {
                  "Content-Type": "application/json",
                  "query":"im so confused on erica",
                  "isReply": "false",
                  "currentReplies": "username: 'PythonWhisperer',tweet: '@questionasker Not to worry! Erica is just a hypothetical example used in the book. It refers back to the concepts and steps explained in earlier chapters.'"
                  // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
              
              }
        );
        let fetchedJSON = await fetchedThreadJSON.json()
        console.log("fetched json", fetchedJSON.threads);
        setThreads(fetchedJSON.threads)
        
        navigate("/GenerativeCommunity");
    }


    

    return <>
    <div className="drop-page">

        <div className="upload-url mb-5">
        <input className="upload-url-input" value={url} placeholder="upload file url" name="myInput" onChange={e=>setUrl(e.target.value)}type="text" />
        <button className="upload-url-submit" onClick={()=>{
            uploadByUrl(url);
        }}>🔍</button>
        </div>
        <div className="mb-5">
            or
        </div>
        <Dropzone onDrop={acceptedFiles => console.log(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
                <section class="dropzone">
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                </section>
            )}
        </Dropzone>
        </div>


    </>

}