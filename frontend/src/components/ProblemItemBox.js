import React from 'react';
import { paths } from 'constants/Paths';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { BsPencilSquare } from 'react-icons/bs'
import { Nav } from 'react-bootstrap';
function ProblemItemBox(props) {
    const problem = props.problem;
    return (
        <div className="ploblem-item-box">
            <div className="problem-info">
                <div className="problem-title">
                    <Nav.Link className="to-problem-link ellipsis-text" href={`${paths.pages.algorithmTest.prefix}/${problem.id}`}>
                        {problem.title}
                    </Nav.Link>
                </div>
                <div className="problem-content">
                    <span className="problem-type">{problem.problemType.name}</span>
                    <span> • </span>
                    <span className="problem-resolve-count">{problem.resolveCount}명 완료</span>
                    <div className="problem-level">Level {problem.level.name}</div>
                </div>

            </div>

            <div className="problem-btn-panel">
                {problem.resolved ? <IoMdCheckmarkCircle className="problem-resolved-icon" size="30px" color="green"></IoMdCheckmarkCircle> : null}
                {problem.createdByMe ? <Nav.Link className="edit-problem-btn" href={`${paths.pages.makeProblemForm}?id=${problem.id}`}><BsPencilSquare size="30px" color="red" /></Nav.Link> : null}

            </div>
        </div>
    )
}

export default ProblemItemBox;