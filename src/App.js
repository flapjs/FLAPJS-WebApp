import React from 'react';
import { hot } from 'react-hot-loader';

class App extends React.Component
{
  render()
  {
    return <h1>Hello CSE105!</h1>;
  }
}

//For hotloading this class
export default hot(module)(App);
