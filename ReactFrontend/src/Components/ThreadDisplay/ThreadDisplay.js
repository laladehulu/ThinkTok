
import "./ThreadDisplay.css"
import Comment from "../Comment/Comment"
import {useRef, useState, useEffect,useLayoutEffect } from "react"
import gsap, {  } from "gsap"
let sampleComment = {
    username: "",
    pfpURL: "",
    text: "",
}
export default function ThreadDisplay() {
    const [comments, setComments] = useState([]);
    const selfRef = useRef();
   
    useLayoutEffect(() => {
        let ctx = gsap.context(() => {

          gsap.fromTo(selfRef.current, {scale:0.7, opacity:0}, { duration: 0.4, ease: "back.out(1)", scale:1, opacity:1});
          
        }, selfRef);
        
        return () => ctx.revert();
      }, []);
    function trimText(text){
        return text.length>350? (text.slice(0,350)+"........."): text
    }   
    
    
    return <>
        <div className="row text-left thread-display" style={{ width: "50vw", cursor:"pointer"}} ref ={selfRef} >
            <div className="col-1 d-flex flex-column justify-content-center">
                <div>△</div>
                <div>
                ▽
                </div>
            </div>
            <div className="col-11  d-flex text-dark position-relative" style={{
                background: "rgb(186, 194, 205)"
            }}>
                <div className="text-left" style={{textAlign:"left"}}>
                    <div className="bold" style={{fontSize:"1.8rem"}}>Hello Title</div>
                    <div style={{ fontSize: "0.8rem", opacity:0.7 }}>
                        FlyingDomingo
                    </div>
                    <div className="mt-3" >
                          {trimText("Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.")}
                    </div>
                    <div className="position-absolute  fade-gradient" >
                      
                    </div>
                </div>
            </div>
        </div>



    </>

}