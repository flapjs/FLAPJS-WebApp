import React from 'react';

class UploadIcon extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z"/>
    </svg>;
  }
}

export default UploadIcon;
