
const TIMEPERSAVE = 3000 //unit is ms

//check if browser support local storage
export function supportLocalStorage(){
    return typeof(Storage)!== 'undefined';
}

export function autosave(){
  var workspace = document.getElementById("workspace-content");
  try{
    setInterval(function(){
      localStorage.setItem('workspace', workspace.value);
    },TIMEPERSAVE);

  } catch(e){
    if(localStorage.getItem('workspace'));
    workspace.value = localStorage.getItem('workspace');
  }
}

export function restoreWorkspace(){
  var workspace = document.getElementById("workspace-content");
  workspace.value = localStorage.getItem('workspace');
}
