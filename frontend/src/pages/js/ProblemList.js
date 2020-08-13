import LoadingScreen from 'components/LoadingScreen';
import ProblemItemBox from 'components/ProblemItemBox';
import { paths } from 'constants/Paths';
import 'pages/css/ProblemList.css';
import React, { useEffect, useState } from 'react';
import { Pagination } from 'react-bootstrap';
import AuthenticateManager from 'utils/AuthenticateManager';
import { moveToPage } from 'utils/PageControl';
function ProblemList(props) {
    const [page, setPage] = useState(1);
    const { user } = props.account;
    const { data, isProgressing, which, isSuccess } = props.problem;
    const { problemActions } = props;
    const [levelFilters, setLevelFilters] = useState(new Set());
    const [typeFilters, setTypeFilters] = useState(new Set());

    useEffect(() => {
        if (!user || !AuthenticateManager.isUserLoggedIn()) {
            moveToPage(props.history, paths.pages.loginForm);
            return;
        }
        if (!isProgressing) {
            //-request problem list and page info using type, level, page
            if (!data.problemMetaData) {
                if (which === 'problemMetaData' && !isSuccess) return;
                problemActions.getProblemMetaData();
            }
            else if (!data.problemsAndMaxPage) {
                if (which === 'problemList' && !isSuccess) return;
                problemActions.getProblemList({ typeIds: Array.from(typeFilters), levelIds: Array.from(levelFilters), page });
            }
            else if (data.userResolvedProblemCount ===null || data.userResolvedProblemCount == undefined ) {
                if (which === 'userResolvedProblemCount' && !isSuccess) return;
                problemActions.getUserResolvedProblemCount();
            }
        }
    }, [props.history, data.problemMetaData, data.problemsAndMaxPage, data.userResolvedProblemCount, user, page, levelFilters, problemActions, typeFilters, data.failCause, isSuccess, which, isProgressing]);

    const updateProblemList = () => {
        problemActions.clearProblemList();
    }

    const getPaginationItems = () => {
        // 끝 페이지 (props 대체 예정)
        let endPageNumber = data.problemsAndMaxPage.maxPage;
        let paginationItems = [];
        for (let number = 1; number <= endPageNumber; number++) {
            paginationItems.push(
                <Pagination.Item key={number} active={page === number} onClick={e => { setPage(number); updateProblemList(); }}>{number}</Pagination.Item>
            );
        }
        return paginationItems;
    }

    const getProblemBoxes = () => {
        return data.problemsAndMaxPage.problems.reduce((accumulator, problem) => {
            accumulator.push(
                <ProblemItemBox key={problem.id} problem={problem} />
            );
            return accumulator;
        }, []);
    }

    let problemTypeCheckboxes = [];
    let levelCheckboxes = [];

    if (data.problemMetaData) {
        const problemTypes = data.problemMetaData.problemTypes;
        const problemLevels = data.problemMetaData.problemLevels;
        if (problemTypes) {
            problemTypes.forEach((problemType) => {
                let tagId = `type-checkbox-${problemType.id}`;
                problemTypeCheckboxes.push(
                    <div key={problemType.id}>
                        <input type="checkbox" defaultChecked={typeFilters.has(problemType.id)} className="form-check-input type-filter" id={tagId} data-typeid={problemType.id} onChange={e => addOrRemoveTypeFilter(e.target)} />
                        <label className="form-check-label" htmlFor={tagId}>{problemType.name}</label>
                    </div>
                );
            });
        }
        if (problemLevels) {
            problemLevels.forEach((problemLevel) => {
                const tagId = `level-checkbox-${problemLevel.id}`;
                levelCheckboxes.push(
                    <div key={problemLevel.id}>
                        <input type="checkbox" defaultChecked={levelFilters.has(problemLevel.id)} className="form-check-input level-filter" id={tagId} data-levelid={problemLevel.id} onChange={e => addOrRemoveLevelFilter(e.target)} />
                        <label className="form-check-label" htmlFor={tagId}>{problemLevel.name}</label>
                    </div>
                );
            });
        }

    }

    const addOrRemoveLevelFilter = (input) => {
        if (input.checked) {
            setLevelFilters(levelFilters => new Set(levelFilters).add(Number(input.dataset.levelid)));
        } else {
            setLevelFilters(levelFilters => new Set([...levelFilters].filter(levelFilter => levelFilter !== Number(input.dataset.levelid))));
        }
        setPage(1);
        updateProblemList();
    }
    const addOrRemoveTypeFilter = (input) => {
        if (input.checked) {
            setTypeFilters(typeFilters => new Set(typeFilters).add(Number(input.dataset.typeid)));
        } else {
            setTypeFilters(typeFilters => new Set([...typeFilters].filter(typeFilter => typeFilter !== Number(input.dataset.typeid))));
        }
        setPage(1);
        updateProblemList();
    }
    debugger;
    return (
        <div className="problem-page align-center">
            <div className="left-panel">
                <div className="user-info">
                    <div className="panel-title">{user ? decodeURI(user.nickname) : 'N/A'}</div>
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
                    {data.problemsAndMaxPage && getProblemBoxes()}
                </div>
                {data.problemsAndMaxPage && data.problemsAndMaxPage.maxPage > 0 ?
                    <div className="pages horizontal-scroll ">
                        <Pagination className="align-center">
                            <Pagination.Prev onClick={e => {
                                if (page > 1) {
                                    setPage(page - 1);
                                    updateProblemList();
                                }
                            }} />
                            {getPaginationItems()}
                            <Pagination.Next onClick={e => {
                                if (page < data.problemsAndMaxPage.maxPage) {
                                    setPage(page + 1);
                                    updateProblemList();
                                }
                            }
                            } />
                        </Pagination>
                    </div>
                    :
                    <div className="text-center">{isProgressing ? <LoadingScreen label="문제 목록을 불러오는 중입니다." /> : <>문제 목록이 비어있습니다.</>}</div>
                }

            </div>

        </div>
    );


}


export default ProblemList;