import Father from "./components/Father";
import React from 'react'
import wallpaper from './sources/macos-big-sur-3840x2160-wwdc-2020-4k-22654.jpg'
function App() {
  return (
    <div style={{backgroundImage : `url(${wallpaper})`, backgroundSize : 'cover'}}>
      <Father/>
    </div>
  );
}

export default App;
