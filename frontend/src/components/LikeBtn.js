import React from 'react';
import { AiOutlineLike } from 'react-icons/ai';
function LikeBtn(props) {
    const { solutionId, likes } = props;
    const { which, isProgressing, solutionActions } = props;
    const isProgressingLikeOrCancelLike = which === 'likeOrCancelLike' && isProgressing;

    // container에서 수행할 일 (props.changeLikeCount)
    const changeLikeCount = () => {
        //- request like or cancel like using solutionId
        if (solutionId && !isProgressingLikeOrCancelLike) {
            solutionActions.likeOrCancelLike({ solutionId });
        }
        // 성공 시 store의 likes 데이터만 변경 서버 요청 시 solutions 모든 객체 바꾸지 말 것
    }
    return (
        <>
            <AiOutlineLike size="30px" className={isProgressingLikeOrCancelLike ? 'like-btn disabled' : likes.isLikePressed ? 'like-btn pressed' : 'like-btn'} onClick={e => changeLikeCount()} />
            <span>{likes.likeCount}</span>
        </>
    );
}
export default LikeBtn;