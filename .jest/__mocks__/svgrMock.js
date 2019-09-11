// This is a mock for imported SVG files.
import React from 'react';
const SvgrMock = React.forwardRef((props, ref) => <span ref={ref} {...props}/>);
export default SvgrMock;