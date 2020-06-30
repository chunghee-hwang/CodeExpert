import React from 'react';
import { paths } from 'constants/Paths';
import { NavLink } from 'react-router-dom';
import 'components/css/ProblemItemBox.css';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { BsPencilSquare } from 'react-icons/bs'
function ProblemItemBox(props) {
    const problem = props.problem;
    return (
        <div className="ploblem-item-box">
            <div className="problem-info">
                <div className="problem-title">
                    <NavLink className="to-problem-link ellipsis-text" to={`${paths.pages.algorithm_test.prefix}/${problem.id}`}>
                        {problem.title}
                    </NavLink>
                </div>
                <div className="problem-content">
                    <span className="problem-type">{problem.type.name}</span>
                    <span> • </span>
                    <span className="problem-resolve-count">{problem.resolve_count}명 완료</span>
                    <div className="problem-level">Level {problem.level}</div>
                </div>

            </div>

            <div className="problem-btn-panel">
                {problem.created_by_me ? <IoMdCheckmarkCircle className="problem-resolved-icon" size="30px" color="green"></IoMdCheckmarkCircle> : null}
                {problem.resolved ? <NavLink className="edit-problem-btn" to={`${paths.pages.make_problem_form}?id=${problem.id}`}><BsPencilSquare size="30px" color="red" /></NavLink> : null}

            </div>
        </div>
    )
}

export default ProblemItemBox;