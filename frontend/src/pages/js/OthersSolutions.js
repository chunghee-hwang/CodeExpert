import React, { useEffect, useState } from 'react';
import { initAceEditor } from 'utils/AceEditor';

import 'pages/css/OthersSolutions.css';
import { Pagination, Nav, ProgressBar } from 'react-bootstrap';
import { paths } from 'constants/Paths';
import LikeBtn from 'components/LikeBtn';
import Comments from 'components/Comments';
import { getIntegerPathParameter, moveToPage } from 'utils/PageControl';
import LoadingScreen from 'components/LoadingScreen';
import AuthenticateManager from 'utils/AuthenticateManager';
import { useParams } from 'react-router-dom';
function OthersSolutions(props) {
    const problemId = getIntegerPathParameter(useParams()['problemId']);
    const [page, setPage] = useState(1);
    const { user } = props.account;
    const { solutionActions, problemActions } = props;
    const { data: solutionData, which: solutionWhich, isProgressing: isSolutionProgressing, isSuccess: isSolutionSuccess } = props.solution;
    const { data: problemData } = props.problem;
    const [languageId, setLanguageId] = useState(null);
    useEffect(() => {
        if (!user || !problemId || !AuthenticateManager.isUserLoggedIn()) {
            
            moveToPage(props.history, paths.pages.loginForm);
            return;
        }
        if (!problemData.problemMetaData) problemActions.getProblemMetaData();
        else {
            //- request others solutions using problemId, languageId, page
            if (!solutionData.othersSolutions) solutionActions.getOthersSolutions({ problemId, page, languageId });
            else {
                if (!languageId && problemData.problemMetaData.languages) setLanguageId(problemData.problemMetaData.languages[0].id);
                if (languageId) {
                    const languageSelect = document.querySelector('#others-solution-language-select');
                    const languageSelectIdx = Array.from(languageSelect.children).findIndex(option => Number(option.dataset.languageid) === languageId);
                    if (languageSelectIdx !== -1) languageSelect.selectedIndex = languageSelectIdx;

                    const codeViewers = document.querySelectorAll('.code-viewer');
                    codeViewers.forEach(codeViewer => {
                        const solution = solutionData.othersSolutions.solutions[codeViewer.dataset.solutionidx];
                        initAceEditor(solution.code, solution.language.aceName, codeViewer, true);
                    });
                }
            }
        }


    }, [user, props.history, languageId, page, problemId, solutionData.othersSolutions, solutionActions, problemActions, problemData.problemMetaData]);


    const getLanguageOptions = () => {
        return problemData.problemMetaData.languages.reduce((accumulator, language) => {
            accumulator.push(
                <option key={language.id} data-languageid={language.id}>{language.name}</option>
            );
            return accumulator;
        }, []);
    }

    const getPaginationItems = () => {
        let paginationItems = [];
        for (let number = 1; number <= solutionData.othersSolutions.maxPageNumber; number++) {
            paginationItems.push(
                <Pagination.Item key={number} active={page === number} onClick={e => { setPage(number); updateOthersSolutions(); }}>{number}</Pagination.Item>
            );
        }
        return paginationItems;
    }

    const getSolutionsAndComments = () => {
        return solutionData.othersSolutions.solutions.reduce((accumulator, solution, idx) => {
            accumulator.push(
                <div key={idx} className="others-solution">
                    <h5 className="font-weight-bold">{unescape(solution.user.nickname)}</h5>
                    <div id={`code-viewer${idx}`} className="code-viewer" data-solutionidx={idx}>
                    </div>
                    <div className="others-solution-like">
                        <LikeBtn solutionId={solution.id} likes={solution.likes} which={solutionWhich} isSuccess={isSolutionSuccess} isProgressing={isSolutionProgressing} solutionActions={solutionActions} />
                    </div>
                    <h6 className="font-weight-bold mt-3">댓글</h6>
                    <div className="others-solution-comments">
                        <Comments solutionId={solution.id} user={user} comments={solution.comments} which={solutionWhich} isSuccess={isSolutionSuccess} isProgressing={isSolutionProgressing} solutionActions={solutionActions} />
                    </div>
                </div>

            )
            return accumulator;
        }, []);
    }


    const updateOthersSolutions = () => {
        solutionActions.clearOthersSolutions();
    }
    return (
        <div className="others-solutions">
            {(!solutionData.othersSolutions || !problemData.problemMetaData) ? <LoadingScreen label='다른 사람의 풀이를 불러오는 중입니다' /> :
                <>

                    <div className="others-solutions-title-bar">
                        <div className="others-solution-title">
                            <h3 className="font-weight-bold">다른 사람의 풀이</h3>
                            <Nav.Link className="to-problem-link ellipsis-text" href={`${paths.pages.algorithmTest.prefix}/${problemId}`}>
                                {solutionData.othersSolutions.problem.title}
                            </Nav.Link>
                        </div>

                        <select id="others-solution-language-select" className="custom-select" onChange={e => {
                            setLanguageId(Number(e.target.options[e.target.selectedIndex].dataset.languageid));
                            setPage(1);
                            updateOthersSolutions();
                        }}>
                            {getLanguageOptions()}
                        </select>
                    </div>
                    {isSolutionProgressing ? <ProgressBar animated now={100} /> : null}
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
                                if (page < solutionData.othersSolutions.maxPageNumber) {
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