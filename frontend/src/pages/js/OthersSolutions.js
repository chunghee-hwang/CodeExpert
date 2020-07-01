import React, { useEffect, useState } from 'react';
import languages from 'constants/Languages';
import { useParams, NavLink } from 'react-router-dom';
import { AiOutlineLike } from 'react-icons/ai';
import { initAceEditor } from 'utils/AceEditor';
import Moment from 'react-moment';
import 'moment-timezone';
import 'pages/css/OthersSolutions.css';
import { Pagination, FormControl, Button, InputGroup } from 'react-bootstrap';
import { paths } from 'constants/Paths';
function OthersSolution() {
    const { problem_id } = useParams()
    const [page, setPage] = useState(1);
    const [language, setLanguage] = useState(languages.java.name);
    let problem = {
        title: '오름차순으로 정렬하기'
    }

    let solutions = [
        {
            user: {
                id: 1,
                name: '사용자1'
            },
            code: "int[] solution(String param1, String param2)\n{\n\treturn new int[]{1, 2};\n}",
            like_count: 100,
            language: languages.java,
            comments: [
                {
                    user: {
                        id: 2,
                        name: '사용자2',
                    },
                    timestamp: new Date(),
                    content: '정말 간단하네요!'
                },
                {
                    user: {
                        id: 3,
                        name: '사용자3',
                    },
                    timestamp: new Date(),
                    content: 'map 함수가 뭔지 찾아봐야겠네요.'
                },
                {
                    user: {
                        id: 3,
                        name: '사용자3',
                    },
                    timestamp: new Date(),
                    content: 'sort와 sorted 함수의 차이가 뭔가요?'
                },
            ]
        },
        {
            user: {
                id: 2,
                name: '사용자2'
            },

            code: "int[] solution(String param1, String param2)\n{\n\treturn new int[]{50, 10}\n"
            ,
            like_count: 50,
            language: languages.java,
            comments: [
                {
                    user: {
                        id: 1,
                        name: '사용자1',
                    },
                    timestamp: new Date(),
                    content: '코드 잘 보고 갑니다!'
                }
            ]
        },

    ]

    // 끝 페이지
    let end_page_number = 20;
    let pagination_items = [];
    for (let number = 1; number <= end_page_number; number++) {
        pagination_items.push(
            <Pagination.Item key={number} active={page === number} onClick={e => { setPage(number); }}>{number}</Pagination.Item>
        );
    }


    const getComments = (comments) => {
        return comments.reduce((accumulator, comment, idx) => {
            accumulator.push(
                <tr key={idx}>
                    <td className="others-solution-comment-username font-weight-bold">{comment.user.name}</td>
                    <td className="others-solution-comment-timestamp"><Moment date={comment.timestamp} format="YYYY-MM-DD HH:mm" /></td>
                    <td className="others-solution-comment-content">{comment.content}</td>
                </tr>
            );
            return accumulator;
        }, []);
    }

    const getSolutionsAndComments = () => {
        return solutions.reduce((accumulator, solution, idx) => {
            accumulator.push(
                <div key={idx} className="others-solution">
                    <h5 className="font-weight-bold">{solution.user.name}</h5>
                    <div id={`code-viewer${idx}`} className="code-viewer" data-solution_idx={idx}>
                    </div>
                    <div className="others-solution-like">
                        <AiOutlineLike size="30px" /><span>{solution.like_count}</span>
                    </div>
                    <h6 className="font-weight-bold mt-3">댓글</h6>
                    <div className="others-solution-comments">
                        <table>
                            <tbody>
                                {getComments(solution.comments)}
                            </tbody>
                        </table>
                    </div>
                    <InputGroup className="mb-3 others-solution-comment-input">
                        <FormControl
                            placeholder="댓글을 입력하세요."
                            aria-label="댓글 남기기"
                            aria-describedby="basic-addon2"
                        />
                        <InputGroup.Append>
                            <Button variant="outline-secondary">등록</Button>
                        </InputGroup.Append>
                    </InputGroup>
                </div>

            )
            return accumulator;
        }, []);
    }

    useEffect(() => {
        fetch(`/solutions/${problem_id}?language=${language}?page=${page}`);

        const code_viewers = document.querySelectorAll('.code-viewer');
        code_viewers.forEach(code_viewer => {
            const solution = solutions[code_viewer.dataset.solution_idx];
            initAceEditor(solution.code, solution.language.ace_name, code_viewer, true);
        })
    });

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
                    // console.log(e.target.options[e.target.selectedIndex].dataset);
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

export default OthersSolution;