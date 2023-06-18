
import { useEffect } from "react";
import "./Comment.css"
import FeatherIcon from 'feather-icons-react';

export default function Comment({username,text,pfpURL}){

    const generatePfp = () => 'https://source.unsplash.com/random/200x200/?avatar';


    return <>
         <div class="shadow-sm comment p-3 border rounded">
            <div class="comment-left">
                <img class="comment-pfp" />
            </div>
            <div class="comment-right">
                <div class="comment-name">
                    {username}
                </div>
                <div class="comment-text">
                {text}
                </div>
                <div class="comment-interaction d-flex mt-2">
                    <a type="button" class="flex-fill w-75 acolor"><FeatherIcon icon="thumbs-up" /></a>
                    <a type="button" class="flex-fill w-75 acolor"><FeatherIcon icon="message-circle"/></a>
                    <a type="button" class="flex-fill w-75 acolor"><FeatherIcon icon="share-2" /></a>
                </div>
            </div>

        </div>

    </>

}