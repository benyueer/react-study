import React, { useState } from 'react';

function App() {
  debugger
  const [count, setCount] = useState(0);
  return (
    <div>
      hello <span>world</span>
      <p onClick={() => {
        debugger;
        setCount(count + 1)
      }
      }>{count}</p>
    </div>
  );
}

export default App;
