
import "./Comment.css"
export default function Comment({username,text,pfpURL}){
    return <>
         <div class="comment"> 
                <div class="comment-left">
                    <div class="comment-pfp">
                        
                    </div>
                </div>
                <div class="comment-right">
                    <div class="comment-name">
                        {username}
                    </div>
                    <div class="comment-text">
                   {text}
                    </div>
                    <div class="comment-interaction">
                        <span>like</span>
                        <span>comment</span>
                        <span>share</span>
                    </div>
                </div>

            </div>
    </>

}