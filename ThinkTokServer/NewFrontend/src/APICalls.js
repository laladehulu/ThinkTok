export async function initialFetchThreadJSONTree(pdfName){
   
    const response = await fetch('/query/'+pdfName);
    const ThreadJSONTree = await response.json();
    console.log(ThreadJSONTree);
    
    return ThreadJSONTree;
}
export async function uploadPDF(url){  
    const response = await fetch("/load?pdf="+url);
    
}
export async function makePost(title, text){
    const response = await fetch("/newThread",{method:"POST",headers:{
        title,text, user:"Devin Han"

    }});
    let json = await response.json()
    updateThreadJSON(json);
}
export async function makeComment(text){
    const response = await fetch("/newComment",{method:"POST",headers:{
        text, user:"Devin"
    }});
    let json = await response.json();
    updateThreadJSON(json);
}
export async function updateThreadJSON(newThread){
    setThreads(newThread.threads)
}
var setThreads;
export async function setUpdate(fn){
    setThreads = fn;
}
uploadPDF("https://web.stanford.edu/~jurafsky/slp3/2.pdf")