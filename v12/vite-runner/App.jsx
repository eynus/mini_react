import React from '../core/React.js'


// function是一个箱子，其实就是一个：开箱的过程
let countFoo = 1
function Foo() {
    console.log('foo rerun');
    const update = React.update()
 
    // update
    function handleClick() {
        countFoo++
        
        update()
    }
    
    return (
        <div >
            <h1>foo</h1>
            {countFoo}
            <button onClick={handleClick}>click</button>
            
        </div>
    )
}
let countBar = 1
function Bar() {
    console.log('bar rerun');
    const update = React.update()
 
    // update
    function handleClick() {
        countBar++
        
        update()
    }
    
    return (
        <div >
            <h1>Bar</h1>
            {countBar}
            <button onClick={handleClick}>click</button>
            
        </div>
    )
}



function App() {
    return (
    <div>
        Hi mini React!@!!
        <Foo ></Foo>
        <Bar ></Bar>
    </div>
    )
 
}
export default App
