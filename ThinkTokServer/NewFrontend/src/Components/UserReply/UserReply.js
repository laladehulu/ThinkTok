import { useEffect } from "react";
import "./UserReply.css"
import FeatherIcon from 'feather-icons-react';
import {makeComment} from "../../APICalls"

export default function Comment(){

    function submitOnEnter(event) {
        if (event.which === 13 && !event.shiftKey) {
            if (!event.repeat) {
                submitReply(event);
            }

            event.preventDefault(); // Prevents the addition of a new line in the text field
            event.target.value = "";

        }
    }

    function submitReply(event) {
        console.log("Submitted" + event.target.value);
        makeComment(event.target.value);
    }

    useEffect(() => {
        document.getElementById("usermsg").addEventListener("keydown", submitOnEnter);
    }, []);

    return <>
    <div class="shadow-sm comment p-3 border rounded">
        <div class="comment-right">
            <div class="comment-name">
                Your Reply:
            </div>
            <div class="comment-text">
                <textarea id="usermsg" class="comment-text"></textarea>
            </div>
        </div>

    </div>

    </>

}