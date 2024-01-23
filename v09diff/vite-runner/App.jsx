import React from '../core/React.js'


// function是一个箱子，其实就是一个：开箱的过程
let showBar = false
let count = 10
let props = {
    id:'111111111'
}
function Counter({ num }) {
    // const foo = <div>foo</div>
    function foo(params) {
        return <div>foo</div>
        
    }
    const bar = <p>bar</p>
    // update
    function handleClick() {
        showBar=!showBar
        // console.log('click');
        // count++
        // props={}
        React.update()
    }

    return (
        <div {...props}>Counter1:{count}
        <button onClick={handleClick}>remove</button>
            <div>{showBar?bar:foo}</div>
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
