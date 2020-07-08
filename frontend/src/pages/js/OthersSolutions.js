import React, { useEffect, useState } from 'react';
import languages from 'constants/Languages';
import { useParams, NavLink } from 'react-router-dom';
import { initAceEditor } from 'utils/AceEditor';

import 'pages/css/OthersSolutions.css';
import { Pagination } from 'react-bootstrap';
import { paths } from 'constants/Paths';
import LikeBtn from 'components/LikeBtn';
import Comments from 'components/Comments';
import { getIntegerPathParameter } from 'utils/PageControl';
function OthersSolutions(props) {
    const problem_id = getIntegerPathParameter(useParams, 'problem_id');
    const [page, setPage] = useState(1);
    const [language, setLanguage] = useState(languages.java.id);
    const { user } = props;
    let problem = {
        title: '오름차순으로 정렬하기'
    }

    // props로 변경 예정
    const solutions = [
        {
            id: 1,
            user: {
                id: 1,
                name: '사용자1'
            },
            code: "int[] solution(String param1, String param2)\n{\n\treturn new int[]{1, 2};\n}",
            language: languages.java,
        },
        {
            id: 2,
            user: {
                id: 2,
                name: '사용자2'
            },
            code: "int[] solution(String param1, String param2)\n{\n\treturn new int[]{50, 10}\n}",
            language: languages.java,
        },

    ];

    // 끝 페이지
    let end_page_number = 20;
    let pagination_items = [];
    for (let number = 1; number <= end_page_number; number++) {
        pagination_items.push(
            <Pagination.Item key={number} active={page === number} onClick={e => { setPage(number); }}>{number}</Pagination.Item>
        );
    }

    const getSolutionsAndComments = () => {
        return solutions.reduce((accumulator, solution, idx) => {
            accumulator.push(
                <div key={idx} className="others-solution">
                    <h5 className="font-weight-bold">{solution.user.name}</h5>
                    <div id={`code-viewer${idx}`} className="code-viewer" data-solution_idx={idx}>
                    </div>
                    <div className="others-solution-like">
                        <LikeBtn solution_id={solution.id} />
                    </div>
                    <h6 className="font-weight-bold mt-3">댓글</h6>
                    <div className="others-solution-comments">
                        <Comments solution_id={solution.id} user={user} />
                    </div>
                </div>

            )
            return accumulator;
        }, []);
    }


    useEffect(() => {
        if (!user) {
            props.history.push(paths.pages.login_form);
            return;
        }
        // request others solutions using problem_id, language_id, page

        fetch(`/solutions/${problem_id}?language=${language}?page=${page}`);

        const code_viewers = document.querySelectorAll('.code-viewer');
        code_viewers.forEach(code_viewer => {
            const solution = solutions[code_viewer.dataset.solution_idx];
            initAceEditor(solution.code, solution.language.ace_name, code_viewer, true);
        })
    }, [user, props.history, language, page, problem_id, solutions]);

    return (
        <div className="others-solutions">
            <div className="others-solutions-title-bar">
                <div className="others-solution-title">
                    <h3 className="font-weight-bold">다른 사람의 풀이</h3>
                    <NavLink className="to-problem-link ellipsis-text" to={`${paths.pages.algorithm_test.prefix}/${problem_id}`}>
                        {problem.title}
                    </NavLink>
                </div>

                <select className="custom-select others-solution-language-select" onChange={e => {
                    setLanguage(e.target.options[e.target.selectedIndex].dataset.language_name)
                    setPage(1);
                }}>
                    <option data-language_name={languages.java.name}>{languages.java.name}</option>
                    <option data-language_name={languages.python3.name}>{languages.python3.name}</option>
                    <option data-language_name={languages.cpp.name}>{languages.cpp.name}</option>
                </select>
            </div>
            {getSolutionsAndComments()}
            <div className="pages horizontal-scroll">
                <Pagination className="align-center">
                    <Pagination.Prev onClick={e => {
                        if (page > 1) setPage(page - 1);
                    }} />
                    {pagination_items}
                    <Pagination.Next onClick={e => {
                        if (page < end_page_number) setPage(page + 1);
                    }} />
                </Pagination>
            </div>

        </div>


    );
}

export default OthersSolutions;