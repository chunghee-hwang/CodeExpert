import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import 'pages/css/AlgorithmTest.css';
import Split from 'react-split';
import ProblemInfoSection from 'components/js/ProblemInfoSection';
import ProblemSolutionSection from 'components/js/ProblemSolutionSection';
function AlgorithmTest() {
    let { id } = useParams();
    let tests = [
        {
            language: 'Java',
            ace_language: 'java',
            init_code: "int[] solution(String param1, String param2)\n{\n\treturn new int[]{1, 2};\n}"
        },
        {
            language: 'Python',
            ace_language: 'python',
            init_code: "def solution(param1, param2):\n\treturn [1, 2]"
        },
        {
            language: 'C++',
            ace_language: 'c_cpp',
            init_code: "#include <vector>\n#include <string>\nusing namespace std;\nvector<int> solution(string param1, string param2)\n{\n\treturn vector<int>{1, 2};\n}"
        }
    ]
    let language_options = tests.reduce((accumulator, test, idx) => {
        accumulator.push(
            <option key={idx} value={idx}>{test.language}</option>
        );
        return accumulator;
    }, []);
    const [test, setTest] = useState(tests[0]);
    return (
        <div>
            <div>
                <select onChange={e => setTest(tests[e.target.options[e.target.selectedIndex].value])}>
                    {language_options}
                </select>
            </div>
            <Split className="algorithm-test"
                sizes={[50, 50]}
                minSize={0}
                expandToMin={true}
                gutterSize={10}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                direction="horizontal"
                cursor="col-resize"
            >
                <ProblemInfoSection />
                <ProblemSolutionSection test={test} />
            </Split>
        </div>


    );
}

export default AlgorithmTest;