import React from 'react';
import { useParams } from 'react-router-dom';
function AlgorithmTest() {
    let { id } = useParams();
    console.log(id);

    return (
        <div>AlgorithmTest</div>
    );
}
export default AlgorithmTest;