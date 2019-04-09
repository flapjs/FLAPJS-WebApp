import React from 'react';
import Notifications from 'deprecated/system/notification/Notifications.js';

class UploadButton extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onUploadFileChange = this.onUploadFileChange.bind(this);
  }

  onUploadFileChange(e)
  {
    const files = e.target.files;
    if (files.length > 0)
    {
      this.props.app.getCurrentModule().getGraphController().getGraphImporter().importFile(files[0], this.props.app.getCurrentModule())
        .catch((e) => {
          Notifications.addErrorMessage("ERROR: Unable to load invalid JSON file.", "errorUpload");
          console.error(e);
        });

      //Makes sure you can upload the same file again.
      e.target.value = "";
    }
  }

  render()
  {
    const inputID = this.props.id + "-input";
    return <button
      className={"icon-button button-upload " + this.props.className}
      id={this.props.id}
      title={this.props.title}
      style={this.props.style}
      disabled={this.props.disabled}
      onClick={this.props.onClick}>
      <input id={inputID} type="file" name="import"
        style={{display:"none"}}
        onChange={this.onUploadFileChange}
        accept={this.props.app.getCurrentModule().getGraphController().getGraphImporter().getImportFileTypes().join(",")}/>
      <label htmlFor={inputID}>
        {this.props.children}
      </label>
    </button>;
  }
}

export default UploadButton;
