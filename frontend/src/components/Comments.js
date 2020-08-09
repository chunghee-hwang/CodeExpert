import React, { useEffect } from 'react';
import { FormControl, Button, InputGroup } from 'react-bootstrap';
import Moment from 'react-moment';
import 'moment-timezone';
import { showTextInputAlert, showErrorAlert, showWarningAlert } from 'utils/AlertManager';
function Comments(props) {
    const { solutionId, comments } = props;
    const { user, which, isProgressing, isSuccess, solutionActions } = props;
    const isProgressingComment = (which === 'registerComment' || which === 'updateComment' || which === 'deleteComment') && isProgressing;
    useEffect(() => {
        if (!isProgressing) {
            switch (which) {
                case 'registerComment':
                    if (!isSuccess) {
                        showErrorAlert({ errorWhat: '댓글 등록' });
                    }
                    break;
                case 'updateComment':
                    if (!isSuccess) {
                        showErrorAlert({ errorWhat: '댓글 수정' });
                    }
                    break;
                case 'deleteComment':
                    if (!isSuccess) {
                        showErrorAlert({ errorWhat: '댓글 삭제' });
                    }
                    break;
                default:
                    break;
            }
        }
    });



    const createCommentsTemplate = (comments) => {
        if (!comments || comments.length === 0) {
            return <div>댓글이 없습니다.</div>
        }
        return comments.reduce((accumulator, comment, idx) => {
            accumulator.push(
                <div key={idx} className="others-solution-comment-container mb-2">
                    <span className="others-solution-comment-username font-weight-bold">{decodeURI(comment.user.nickname)}</span>
                    <span className="others-solution-comment-timestamp"><Moment date={comment.timestamp} format="YYYY-MM-DD HH:mm" /></span>
                    <span className="others-solution-comment-content">
                        {
                            comment.content
                        }
                    </span>

                    {user.id === comment.user.id ?
                        <span className="ml-2">
                            <Button variant="outline-info" size="sm" onClick={e => updateComment(comment)} disabled={isProgressingComment}>
                                수정
                            </Button>

                            <Button className="ml-1" variant="outline-danger" size="sm" onClick={e => deleteComment(comment)} disabled={isProgressingComment}>
                                삭제
                            </Button>

                        </span>
                        : null
                    }
                </div>
            );
            return accumulator;
        }, []);
    }
    const registerComment = (commentInput) => {
        const commentContent = commentInput.value;
        if (commentContent.trim()) {
            //- request register comment using solutionId
            solutionActions.registerComment({ commentContent, solutionId });
        }
        commentInput.value = '';
    }

    const updateComment = (comment) => {
        if (comment.user.id !== user.id) {
            showErrorAlert({ errorWhat: '잘못된 접근', text: '댓글을 수정할 권한이 없습니다.' });
            return;
        }
        showTextInputAlert({ title: '댓글 수정', text: '', btnText: '수정', defaultValue: comment.content }).then((commentContent) => {
            if (commentContent) {
                //- request update comment using commentId, commentContent
                solutionActions.updateComment({ commentId: comment.id, commentContent });
                // 성공 시, store의 해당 댓글 데이터만 수정
            }
        });
    }

    const deleteComment = (comment) => {
        if (comment.user.id !== user.id) {
            showErrorAlert({ errorWhat: '잘못된 접근', text: '댓글을 수정할 권한이 없습니다.' });
            return;
        }
        showWarningAlert({ title: '댓글 삭제', text: '정말 삭제할까요?', btnText: '삭제' }).then((willDelete) => {
            if (willDelete) {
                //- request delete comment using commentId
                solutionActions.deleteComment({ commentId: comment.id });
                // 성공 시, store의 해당 댓글 데이터만 삭제
            }
        });

    }

    return (
        <>
            <div>
                {user ? createCommentsTemplate(comments) : null}
            </div>

            <InputGroup className="mb-3 others-solution-comment">
                <FormControl
                    className="others-solution-comment-input"
                    placeholder="댓글을 입력하세요."
                    aria-label="댓글 남기기"
                    aria-describedby="basic-addon2"
                />
                <InputGroup.Append>

                    <Button variant="outline-secondary" disabled={isProgressingComment} onClick={e => registerComment(e.target.parentElement.parentElement.querySelector('.others-solution-comment-input'))}>
                        등록
                    </Button>
                </InputGroup.Append>
            </InputGroup>

        </>
    )
}

export default Comments;