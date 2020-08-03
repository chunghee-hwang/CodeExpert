import React, { useState, useEffect } from 'react';
import 'pages/css/ProblemList.css';
import ProblemItemBox from 'components/ProblemItemBox';
import { Pagination } from 'react-bootstrap';
import { paths } from 'constants/Paths';
import LoadingScreen from 'components/LoadingScreen';
import { moveToPage } from 'utils/PageControl';
import AuthenticateManager from 'utils/AuthenticateManager';
function ProblemList(props) {
    const [page, setPage] = useState(1);
    const { user } = props.account;
    const { data } = props.problem;
    const { problem_actions } = props;
    const [level_filters, setLevelFilters] = useState(new Set());
    const [type_filters, setTypeFilters] = useState(new Set());

    useEffect(() => {
        if (!user || !AuthenticateManager.isUserLoggedIn()) {
            moveToPage(props.history, paths.pages.login_form);
            return;
        }

        //-request problem list and page info using type, level, page
        // fetch(`/problems?type=${type_ids.join(',')}&level=${levels.join(',')}&page=${page}`);
        if (!data.problems_and_max_page) problem_actions.getProblemList({ type_ids: Array.from(type_filters), level_ids: Array.from(level_filters), page });
        if(!data.user_resolved_problem_count) problem_actions.getUserResolvedProblemCount();
    }, [props.history, data.problems_and_max_page, data.user_resolved_problem_count, user, page, level_filters, problem_actions, type_filters]);

    const updateProblemList = () => {
        problem_actions.clearProblemList();
    }

    if (!data.problems_and_max_page) {
        return <LoadingScreen label="문제 목록을 불러오는 중입니다." />;
    }

    // 끝 페이지 (props 대체 예정)
    let end_page_number = data.problems_and_max_page.max_page;
    let pagination_items = [];
    for (let number = 1; number <= end_page_number; number++) {
        pagination_items.push(
            <Pagination.Item key={number} active={page === number} onClick={e => { setPage(number); updateProblemList(); }}>{number}</Pagination.Item>
        );
    }

    let problem_boxes = data.problems_and_max_page.problems.reduce((accumulator, problem) => {
        accumulator.push(
            <ProblemItemBox key={problem.id} problem={problem} />
        );
        return accumulator;
    }, []);

    let problem_type_checkboxes = [];
    let level_checkboxes = [];
    data.problems_and_max_page.problems.forEach((problem, idx) => {
        const problem_type = problem.type;
        let tag_id = `type-checkbox-${problem_type.id}`;
        problem_type_checkboxes.push(
            <div key={problem_type.id}>
                <input type="checkbox" defaultChecked={type_filters.has(problem_type.id)} className="form-check-input type-filter" id={tag_id} data-type_id={problem_type.id} onChange={e => addOrRemoveTypeFilter(e.target)} />
                <label className="form-check-label" htmlFor={tag_id}>{problem_type.name}</label>
            </div>
        );
    });


    let levels = data.problems_and_max_page.problems.reduce((accumulator, problem) => {
        if (accumulator.find(level => problem.level.id === level.id)) return accumulator;
        accumulator.push(problem.level);
        return accumulator;
    }, []);
    levels.sort(
        (level1, level2) => {
            if (level1.name > level2.name) return 1;
            else if (level1.name === level2.name) return 0;
            else return -1;
        });
    if (levels) {
        Array.from(levels.values()).sort().forEach((level) => {
            const tag_id = `level-checkbox-${level.id}`;
            level_checkboxes.push(
                <div key={level.id}>
                    <input type="checkbox" defaultChecked={level_filters.has(level.id)} className="form-check-input level-filter" id={tag_id} data-level_id={level.id} onChange={e => addOrRemoveLevelFilter(e.target)} />
                    <label className="form-check-label" htmlFor={tag_id}>{level.name}</label>
                </div>
            );
        });
    }

    const addOrRemoveLevelFilter = (input) => {
        if (input.checked) {
            setLevelFilters(level_filters => new Set(level_filters).add(Number(input.dataset.level_id)));
        } else {
            setLevelFilters(level_filters => new Set([...level_filters].filter(level_filter => level_filter !== Number(input.dataset.level_id))));
        }
        updateProblemList();
    }
    const addOrRemoveTypeFilter = (input) => {
        if (input.checked) {
            setTypeFilters(type_filters => new Set(type_filters).add(Number(input.dataset.type_id)));
        } else {
            setTypeFilters(type_filters => new Set([...type_filters].filter(type_filter => type_filter !== Number(input.dataset.type_id))));
        }
        updateProblemList();
    }
    return (
        <div className="problem-page align-center">
            <div className="left-panel">
                <div className="user-info">
                    <div className="panel-title">{user ? unescape(user.nickname) : 'N/A'}</div>
                    <h6>해결한 문제 수: {data.user_resolved_problem_count}</h6>
                </div>

                <div className="problem-types">
                    <div className="panel-title">문제 유형</div>
                    <div className="form-check filter">
                        {problem_type_checkboxes}
                    </div>
                </div>
                <div className="problem-levels">
                    <div className="panel-title">난이도</div>
                    <div className="form-check filter">
                        {level_checkboxes}
                    </div>
                </div>

            </div>
            <div className="problems-and-pages">
                <div className="problem-list">
                    {problem_boxes}
                </div>
                <div className="pages horizontal-scroll ">
                    <Pagination className="align-center">
                        <Pagination.Prev onClick={e => {
                            if (page > 1) {
                                setPage(page - 1);
                                updateProblemList();
                            }
                        }} />
                        {pagination_items}
                        <Pagination.Next onClick={e => {
                            if (page < end_page_number) {
                                setPage(page + 1);
                                updateProblemList();
                            }


                        }} />
                    </Pagination>
                </div>
            </div>

        </div>
    );


}


export default ProblemList;