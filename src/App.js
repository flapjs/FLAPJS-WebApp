import React from 'react';
import { hot } from 'react-hot-loader';
import NaviBar from './NaviBar/NaviBar';

class App extends React.Component
{
  render()
  {
    return(<NaviBar/>);
  }
}

//For hotloading this class
export default hot(module)(App);
