export async function fetchThreadJSONTree(){
   
    const response = await fetch('/query/2');
    const ThreadJSONTree = await response.json();
    console.log(ThreadJSONTree);
    return ThreadJSONTree;
}
export async function uploadPDF(url){  
    const response = await fetch("/load?pdf="+url);
    
}
uploadPDF("https://web.stanford.edu/~jurafsky/slp3/2.pdf")