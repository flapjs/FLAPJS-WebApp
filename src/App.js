import React from 'react';
import { hot } from 'react-hot-loader';

import Homepage from './Components/Homepage';
class App extends React.Component
{
  render()
  {
    return(

        <div className = "homepage-container">

            < Homepage/>

        </div>

    );
  }
}

//For hotloading this class
export default hot(module)(App);
