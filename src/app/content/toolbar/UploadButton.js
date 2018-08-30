import React from 'react';

class UploadButton extends React.Component
{
  constructor(props)
  {
    super(props);

    this.onUploadFileChange = this.onUploadFileChange.bind(this);
  }

  onUploadFileChange(e)
  {
    const file = e.target.files[0];
    this.props.graphController.getUploader().uploadFileGraph(file);
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
        accept={this.props.graphController.getUploader().getValidFileTypes().join(",")}/>
      <label htmlFor={inputID}>
        {this.props.children}
      </label>
    </button>;
  }
}

export default UploadButton;
