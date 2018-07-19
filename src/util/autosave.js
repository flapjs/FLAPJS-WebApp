
const TIMEPERSAVE = 10000 //unit is ms

//check if browser support local storage
export function supportLocalStorage(){
    return typeof(Storage)!== 'undefined';
}

export function autosave(){

  var workspace = document.getElementById("workspace-content");
  try{
    setInterval(function(){
      localStorage.setItem("workspace", workspace.innerHTML);
    },TIMEPERSAVE);
  }
  catch(e){

    if(localStorage.getItem('workspace')){
      workspace.innerHTML = localStorage.getItem('workspace');
    }
  }
}

export function restoreWorkspace(){

  var workspace = document.getElementById("workspace-content");
  workspace.innerHTML = localStorage.getItem('workspace');
}
