import React from '../core/React.js'


// function是一个箱子，其实就是一个：开箱的过程
function Counter({ num }) {
    function handleClick() {
        console.log('click');
    }
    return (
        <div>Counter1:{num}
        <button onClick={handleClick}>click</button>
        </div>
    )
}
function CounterParent() {
    return <Counter num={10}></Counter>
}

function App() {
    return (
    <div>
        Hi mini React!@!!
        <Counter num={10}></Counter>
        {/* <Counter num={12}></Counter> */}
    </div>
    )
 
}
export default App
