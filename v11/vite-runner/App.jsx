import React from '../core/React.js'


// function是一个箱子，其实就是一个：开箱的过程
let showBar = false

function Counter() {
  
    const bar = <div>bar</div>
    // update
    function handleClick() {
        showBar=!showBar
       
        React.update()
    }

    return (
        <div >
            counter
            <button onClick={handleClick}>showBar</button>
            <div>{showBar&&bar}</div>
        </div>
    )
}


function App() {
    return (
    <div>
        Hi mini React!@!!
        <Counter ></Counter>
    </div>
    )
 
}
export default App
