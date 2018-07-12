import * as Config from 'config.js';

class LabelEditor
{
  constructor()
  {
    this.element = document.getElementById("label-editor");
    this.inputElement = document.getElementById("label-editor-input");
    this.inputElement.addEventListener('keyup', (e) => {
      if (e.keyCode == Config.SUBMIT_KEY)
      {
        this.close(true);
      }
      else if (e.keyCode == Config.CLEAR_KEY)
      {
        this.close(false);
      }
    });

    this.inputElement.addEventListener('blur', (e) => {
      this.close(false);
    })

    this.target = null;
  }

  open(edge, placeholder=null)
  {
    if (this.target != edge)
    {
      this.target = edge;
      this.element.style.left = (this.target.x - this.element.offsetWidth / 2) + 'px';
      this.element.style.top = (this.target.y - this.element.offsetHeight / 2) + 'px';
      this.inputElement.value = placeholder || this.target.label;

      this.element.style.visibility = "visible";
      this.inputElement.focus();
      this.inputElement.select();
      return true;
    }

    return false;
  }

  close(saveOnExit=false)
  {
    if (this.target != null)
    {
      if (saveOnExit) this.target.label = this.inputElement.value;
      this.target = null;

      this.element.style.visibility = "hidden";
      return true;
    }

    return false;
  }

  isOpen()
  {
    return this.target != null;
  }

  isEditting(edge)
  {
    return this.target == edge;
  }
}

export default LabelEditor;
