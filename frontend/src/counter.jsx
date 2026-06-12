import { useState } from 'react';

function Counter({ label }) {
    const [count, setCount] = useState(0)

    return (
        <div>
            <p>Your {label} so far is {count}</p>
            <button onClick={() => setCount(count => count + 1)}>
                Increment
            </button>
            <button onClick={() => setCount(count => Math.max(0, count - 1))}>
                Decrement
            </button>
        </div>
    );
}

export default Counter;