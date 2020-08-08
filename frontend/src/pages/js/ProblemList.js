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
    const { problemActions } = props;
    const [levelFilters, setLevelFilters] = useState(new Set());
    const [typeFilters, setTypeFilters] = useState(new Set());

    useEffect(() => {
        if (!user || !AuthenticateManager.isUserLoggedIn()) {
            moveToPage(props.history, paths.pages.loginForm);
            return;
        }

        //-request problem list and page info using type, level, page
        // fetch(`/problems?type=${typeIds.join(',')}&level=${levels.join(',')}&page=${page}`);
        if (!data.problemsAndMaxPage) problemActions.getProblemList({ typeIds: Array.from(typeFilters), levelIds: Array.from(levelFilters), page });
        if(!data.userResolvedProblemCount) problemActions.getUserResolvedProblemCount();
    }, [props.history, data.problemsAndMaxPage, data.userResolvedProblemCount, user, page, levelFilters, problemActions, typeFilters]);

    const updateProblemList = () => {
        problemActions.clearProblemList();
    }

    if (!data.problemsAndMaxPage) {
        return <LoadingScreen label="문제 목록을 불러오는 중입니다." />;
    }

    // 끝 페이지 (props 대체 예정)
    let endPageNumber = data.problemsAndMaxPage.maxPage;
    let paginationItems = [];
    for (let number = 1; number <= endPageNumber; number++) {
        paginationItems.push(
            <Pagination.Item key={number} active={page === number} onClick={e => { setPage(number); updateProblemList(); }}>{number}</Pagination.Item>
        );
    }

    let problemBoxes = data.problemsAndMaxPage.problems.reduce((accumulator, problem) => {
        accumulator.push(
            <ProblemItemBox key={problem.id} problem={problem} />
        );
        return accumulator;
    }, []);

    let problemTypeCheckboxes = [];
    let levelCheckboxes = [];
    data.problemsAndMaxPage.problems.forEach((problem, idx) => {
        const problemType = problem.type;
        let tagId = `type-checkbox-${problemType.id}`;
        problemTypeCheckboxes.push(
            <div key={problemType.id}>
                <input type="checkbox" defaultChecked={typeFilters.has(problemType.id)} className="form-check-input type-filter" id={tagId} data-typeid={problemType.id} onChange={e => addOrRemoveTypeFilter(e.target)} />
                <label className="form-check-label" htmlFor={tagId}>{problemType.name}</label>
            </div>
        );
    });


    let levels = data.problemsAndMaxPage.problems.reduce((accumulator, problem) => {
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
            const tagId = `level-checkbox-${level.id}`;
            levelCheckboxes.push(
                <div key={level.id}>
                    <input type="checkbox" defaultChecked={levelFilters.has(level.id)} className="form-check-input level-filter" id={tagId} data-levelid={level.id} onChange={e => addOrRemoveLevelFilter(e.target)} />
                    <label className="form-check-label" htmlFor={tagId}>{level.name}</label>
                </div>
            );
        });
    }

    const addOrRemoveLevelFilter = (input) => {
        if (input.checked) {
            setLevelFilters(levelFilters => new Set(levelFilters).add(Number(input.dataset.levelid)));
        } else {
            setLevelFilters(levelFilters => new Set([...levelFilters].filter(levelFilter => levelFilter !== Number(input.dataset.levelid))));
        }
        updateProblemList();
    }
    const addOrRemoveTypeFilter = (input) => {
        if (input.checked) {
            setTypeFilters(typeFilters => new Set(typeFilters).add(Number(input.dataset.typeid)));
        } else {
            setTypeFilters(typeFilters => new Set([...typeFilters].filter(typeFilter => typeFilter !== Number(input.dataset.typeid))));
        }
        updateProblemList();
    }
    return (
        <div className="problem-page align-center">
            <div className="left-panel">
                <div className="user-info">
                    <div className="panel-title">{user ? unescape(user.nickname) : 'N/A'}</div>
                    <h6>해결한 문제 수: {data.userResolvedProblemCount}</h6>
                </div>

                <div className="problem-types">
                    <div className="panel-title">문제 유형</div>
                    <div className="form-check filter">
                        {problemTypeCheckboxes}
                    </div>
                </div>
                <div className="problem-levels">
                    <div className="panel-title">난이도</div>
                    <div className="form-check filter">
                        {levelCheckboxes}
                    </div>
                </div>

            </div>
            <div className="problems-and-pages">
                <div className="problem-list">
                    {problemBoxes}
                </div>
                <div className="pages horizontal-scroll ">
                    <Pagination className="align-center">
                        <Pagination.Prev onClick={e => {
                            if (page > 1) {
                                setPage(page - 1);
                                updateProblemList();
                            }
                        }} />
                        {paginationItems}
                        <Pagination.Next onClick={e => {
                            if (page < endPageNumber) {
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