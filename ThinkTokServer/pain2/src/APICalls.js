


export async function fetchThreadJSONTree(){
   
    const response = await fetch('/query/2');
    const ThreadJSONTree = await response.json();
    console.log(ThreadJSONTree);
    return ThreadJSONTree;
}
export async function uploadPDF(url){  
    const response = await fetch("/load?pdf="+url);
    
}
export async function makeThread(title, comment, username){
    const response = await fetch("/newThread", {method:'POST',headers:{
        titke, comment, username
    }})
}
uploadPDF("https://web.stanford.edu/~jurafsky/slp3/2.pdf")