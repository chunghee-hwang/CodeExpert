import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import 'pages/css/AlgorithmTest.css';
import Split from 'react-split';
import ProblemInfoSection from 'components/ProblemInfoSection';
import ProblemSolutionSection from 'components/ProblemSolutionSection';
import { Button } from 'react-bootstrap';
import Media from 'react-media';
import { paths } from 'constants/Paths';
import { Link } from 'react-router-dom';
import languages from 'constants/Languages';
import { data_types } from 'constants/DataTypes';
function AlgorithmTest() {

    let problem =
    {
        id: 1,
        title: "오름차순으로 정렬하기",
        type: {
            id: 1,
            name: "정렬"
        },
        explain: '파라미터로 int형 배열이 넘어오면,<div>오름차순으로 정렬 후, 문자열의 형태로 출력하는 프로그램을 작성하세요.</div><div><img src="https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg" class="attached_pic"><br></div><div>결과는 위 사진처럼 나오면 됩니다.</div>',
        limit_explain: "array의 원소 x: 1<=x<=<1000 인 자연수",
        time_limit: 500,
        memory_limit: 256,
        level: 1,
        input_output: {
            params: [
                { name: 'array', data_type: data_types.integer_array },
            ],
            return: {
                data_type: data_types.string
            },
            testcases: [
                {
                    params: ['[1, 9, 7, 6]'],
                    return: '"1-6-7-9"'
                },
                {
                    params: ['[2, 6, 3, 7]'],
                    return: '"2-3-6-7"'
                }
            ]
        }
    }
    let codes = [
        {
            language: languages.java,
            init_code: "String solution(int[] array)\n{\n\treturn \"\";\n}",
        },
        {
            language: languages.python3,
            init_code: "def solution(array):\n\treturn ''",
            prev_code: "def solution(array):\n\treturn '-'.join(map(str, sorted(array)))"

        },
        {

            language: languages.cpp,
            init_code: "#include <vector>\n#include <string>\nusing namespace std;\nstring solution(vector<int> array)\n{\n\treturn \"\";\n}"
        }
    ]
    const { problem_id } = useParams();
    const [code, setCode] = useState(codes[0]);
    const [code_results, setCodeResults] = useState(null);

    const problem_info_section = <ProblemInfoSection problem={problem} />;
    const problem_solution_section = <ProblemSolutionSection codes={codes} code={code} onChangeLanguage={langauge_id => changeLangauge(langauge_id)} code_results={code_results} />;

    return (
        <div>

            <Media query={{ minWidth: 1025 }}>
                {matches =>
                    matches ? (
                        /* computer screen */
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
                            {problem_info_section}
                            {problem_solution_section}
                        </Split>
                    ) : (
                            /* smart device screen */
                            <div className="algorithm-test">
                                <ProblemInfoSection problem={problem} />
                                <ProblemSolutionSection codes={codes} code={code} onChangeLanguage={langauge_id => changeLangauge(langauge_id)} code_results={code_results} />
                            </div>
                        )
                }
            </Media>


            <div id="answer-btn-bar">
                <Link to={`${paths.pages.others_solutions.prefix}/${problem_id}`}>
                    <Button variant="dark mr-3">다른 사람의 풀이</Button>
                </Link>

                <Button variant="dark align-right" onClick={e => resetCode()}>초기화</Button>
                <Button variant="primary ml-3" onClick={e => submitCode()}>코드 채점</Button>
            </div>
        </div>


    );


    function changeLangauge(language_id) {
        language_id = Number(language_id);
        let language_coressponding_code = codes.find(code => language_id === code.language.id);
        if (language_coressponding_code) {
            setCode(language_coressponding_code);
        }
    }

    function resetCode() {
        let editor = window.ace.edit('code-editor');
        editor.setValue(code.init_code);
        editor.gotoLine(1);
        setCodeResults(null);
    }

    function submitCode() {
        const submitted_code = window.ace.edit('code-editor').getValue();
        const language_id = code.language.id;

        console.log({ submitted_code, language_id });
        /**
         * Request Marking the code
         */
        const results = [
            {
                success: true,
                interval_time: 5.75,
                used_memory: 50.9
            },
            {
                success: true,
                interval_time: 31.20,
                used_memory: 100.5
            },
            {
                success: true,
                interval_time: 1.57,
                used_memory: 12.9
            },
        ];


        /**
         * Send the result to ProblemSolutionSection
         */
        setCodeResults(results);
    }
}

export default AlgorithmTest;