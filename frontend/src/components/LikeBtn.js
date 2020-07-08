import React, { useState } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
function LikeBtn(props) {
    // const solution_id = props.solution_id;
    // request a solution includes like_count, like_pressed only using solution_id

    // props로 대체 예정
    const [solution, setSolution] = useState({
        like_count: 24,
        is_like_pressed: false
    });

    // container에서 수행할 일 (props.changeLikeCount)
    const changeLikeCount = () => {
        if (solution.is_like_pressed) {
            setSolution({ like_count: 24, is_like_pressed: false })
        } else {
            setSolution({ like_count: 25, is_like_pressed: true })
        }
    }

    return (
        <>
            <AiOutlineLike size="30px" className={solution.is_like_pressed ? 'like-btn pressed' : 'like-btn'} onClick={e => changeLikeCount()} />
            <span>{solution.like_count}</span>
        </>
    );
}
export default LikeBtn;