import React, { useEffect, useState } from 'react';
import languages from 'constants/Languages';
import { useParams } from 'react-router-dom';
import { initAceEditor } from 'utils/AceEditor';

import 'pages/css/OthersSolutions.css';
import { Pagination, Nav, ProgressBar } from 'react-bootstrap';
import { paths } from 'constants/Paths';
import LikeBtn from 'components/LikeBtn';
import Comments from 'components/Comments';
import { getIntegerPathParameter, moveToPage } from 'utils/PageControl';
import LoadingScreen from 'components/LoadingScreen';
function OthersSolutions(props) {
    const problem_id = getIntegerPathParameter(useParams, 'problem_id');
    const [page, setPage] = useState(1);
    const [language_id, setLanguageId] = useState(languages.java.id);
    const { user } = props.account;
    const { solution_actions } = props;
    const { data, which, is_progressing, is_success } = props.solution;

    const getPaginationItems = () => {
        let pagination_items = [];
        for (let number = 1; number <= data.others_solutions.max_page_number; number++) {
            pagination_items.push(
                <Pagination.Item key={number} active={page === number} onClick={e => { setPage(number); updateOthersSolutions(); }}>{number}</Pagination.Item>
            );
        }
        return pagination_items;
    }

    const getSolutionsAndComments = () => {
        return data.others_solutions.solutions.reduce((accumulator, solution, idx) => {
            accumulator.push(
                <div key={idx} className="others-solution">
                    <h5 className="font-weight-bold">{solution.user.name}</h5>
                    <div id={`code-viewer${idx}`} className="code-viewer" data-solution_idx={idx}>
                    </div>
                    <div className="others-solution-like">
                        <LikeBtn solution_id={solution.id} likes={solution.likes} which={which} is_success={is_success} is_progressing={is_progressing} solution_actions={solution_actions} />
                    </div>
                    <h6 className="font-weight-bold mt-3">댓글</h6>
                    <div className="others-solution-comments">
                        <Comments solution_id={solution.id} user={user} comments={solution.comments} which={which} is_success={is_success} is_progressing={is_progressing} solution_actions={solution_actions} />
                    </div>
                </div>

            )
            return accumulator;
        }, []);
    }


    useEffect(() => {
        if (!user || !problem_id) {
            moveToPage(props.history, paths.pages.login_form);
            return;
        }
        // request others solutions using problem_id, language_id, page
        if (!data.others_solutions) solution_actions.getOthersSolutions({ problem_id, page, language_id });
        else {
            const language_select = document.querySelector('#others-solution-language-select');
            const language_select_idx = Array.from(language_select.children).findIndex(option => Number(option.dataset.language_id) === language_id);
            if (language_select_idx !== -1) language_select.selectedIndex = language_select_idx;

            const code_viewers = document.querySelectorAll('.code-viewer');
            code_viewers.forEach(code_viewer => {
                const solution = data.others_solutions.solutions[code_viewer.dataset.solution_idx];
                initAceEditor(solution.code, solution.language.ace_name, code_viewer, true);
            });

        }

    }, [user, props.history, language_id, page, problem_id, data.others_solutions, solution_actions]);
    const updateOthersSolutions = () => {
        solution_actions.clearOthersSolutions();
    }
    return (
        <div className="others-solutions">
            {!data.others_solutions ? <LoadingScreen label='다른 사람의 풀이를 불러오는 중입니다' /> :
                <>

                    <div className="others-solutions-title-bar">
                        <div className="others-solution-title">
                            <h3 className="font-weight-bold">다른 사람의 풀이</h3>
                            <Nav.Link className="to-problem-link ellipsis-text" href={`${paths.pages.algorithm_test.prefix}/${problem_id}`}>
                                {data.others_solutions.problem.title}
                            </Nav.Link>
                        </div>

                        <select id="others-solution-language-select" className="custom-select" onChange={e => {
                            setLanguageId(Number(e.target.options[e.target.selectedIndex].dataset.language_id));
                            setPage(1);
                            updateOthersSolutions();
                        }}>
                            <option data-language_id={languages.java.id}>{languages.java.name}</option>
                            <option data-language_id={languages.python3.id}>{languages.python3.name}</option>
                            <option data-language_id={languages.cpp.id}>{languages.cpp.name}</option>
                        </select>
                    </div>
                    {is_progressing ? <ProgressBar animated now={100} /> : null}
                    {getSolutionsAndComments()}
                    <div className="pages horizontal-scroll">

                        <Pagination className="align-center">
                            <Pagination.Prev onClick={e => {
                                if (page > 1) {
                                    setPage(page - 1);
                                    updateOthersSolutions();
                                }
                            }} />
                            {getPaginationItems()}
                            <Pagination.Next onClick={e => {
                                if (page < data.others_solutions.max_page_number) {
                                    setPage(page + 1);
                                    updateOthersSolutions();
                                }

                            }} />
                        </Pagination>

                    </div>

                </>
            }

        </div>


    );
}

export default OthersSolutions;