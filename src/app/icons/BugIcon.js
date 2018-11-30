import React from 'react';

class BugIcon extends React.Component
{
  constructor(props)
  {
    super(props);
  }

  render()
  {
    return <svg className="bug-icon" xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 70 70">
    <path d="M18 2l8.078 13.324M46.039 2l-8.078 13.324M10 62c.75-2.076 3.586-7.583 8.143-8.661M54 62c-.748-2.076-3.582-7.583-8.141-8.661M13.986 40H2m60 0H49.986"
stroke-width="2" stroke-linejoin="round" stroke-linecap="round" stroke="#ffffff"
fill="none" data-name="layer2" ></path>
<ellipse stroke-width="4" stroke-linejoin="round" stroke-linecap="round"
stroke="#ffffff" fill="none" ry="24" rx="18" cy="38" cx="31.986" data-name="layer1"></ellipse>
<path stroke-width="2" stroke-linejoin="round" stroke-linecap="round"
stroke="#ffffff" fill="none" d="M54 16a23.843 23.843 0 0 1-22 14c-10.342 0-18.625-5.994-22-14m22 14v32"
data-name="layer1"></path>
    </svg>;


  }
}

export default BugIcon;
