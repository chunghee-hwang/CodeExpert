import React, { useEffect } from 'react';
import { AiOutlineLike } from 'react-icons/ai';
import { showErrorAlert, showSuccessAlert } from 'utils/AlertManager';
function LikeBtn(props) {
    const { solution_id, likes } = props;
    const { which, is_progressing, is_success, solution_actions } = props;
    const is_progressing_like_or_cancel_like = which === 'like_or_cancel_like' && is_progressing;

    // container에서 수행할 일 (props.changeLikeCount)
    const changeLikeCount = () => {
        // request like or cancel like using solution_id
        if (solution_id && !is_progressing_like_or_cancel_like) {
            solution_actions.likeOrCancelLike({ solution_id });
        }
        // 성공 시 store의 likes 데이터만 변경 서버 요청 시 solutions 모든 객체 바꾸지 말 것
    }

    useEffect(() => {
        if (!is_progressing) {
            if (which === 'like_or_cancel_like') {
                if (!is_success) {
                    showErrorAlert({ error_what: '좋아요' });
                } else {
                    showSuccessAlert({ text: likes.is_like_pressed ? '풀이에 좋아요를 표시했습니다.' : '좋아요 표시를 취소했습니다.' });
                }
            }
        }
    }, [is_progressing, which, is_success, likes.is_like_pressed]);

    return (
        <>
            <AiOutlineLike size="30px" className={is_progressing_like_or_cancel_like ? 'like-btn disabled' : likes.is_like_pressed ? 'like-btn pressed' : 'like-btn'} onClick={e => changeLikeCount()} />
            <span>{likes.like_count}</span>
        </>
    );
}
export default LikeBtn;