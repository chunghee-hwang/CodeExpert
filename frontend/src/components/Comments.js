import React, { useEffect } from 'react';
import { FormControl, Button, InputGroup } from 'react-bootstrap';
import Moment from 'react-moment';
import 'moment-timezone';
import { showTextInputAlert, showErrorAlert, showWarningAlert } from 'utils/AlertManager';
function Comments(props) {
    const { solution_id, comments } = props;
    const { user, which, is_progressing, is_success, solution_actions } = props;
    const is_progressing_comment = (which === 'register_comment' || which === 'update_comment' || which === 'delete_comment') && is_progressing;
    useEffect(() => {
        if (!is_progressing) {
            switch (which) {
                case 'register_comment':
                    if (!is_success) {
                        showErrorAlert({ error_what: '댓글 등록' });
                    }
                    break;
                case 'update_comment':
                    if (!is_success) {
                        showErrorAlert({ error_what: '댓글 수정' });
                    }
                    break;
                case 'delete_comment':
                    if (!is_success) {
                        showErrorAlert({ error_what: '댓글 삭제' });
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
                    <span className="others-solution-comment-username font-weight-bold">{unescape(comment.user.nickname)}</span>
                    <span className="others-solution-comment-timestamp"><Moment date={comment.timestamp} format="YYYY-MM-DD HH:mm" /></span>
                    <span className="others-solution-comment-content">
                        {
                            comment.content
                        }
                    </span>

                    {user.id === comment.user.id ?
                        <span className="ml-2">
                            <Button variant="outline-info" size="sm" onClick={e => updateComment(comment)} disabled={is_progressing_comment}>
                                수정
                            </Button>

                            <Button className="ml-1" variant="outline-danger" size="sm" onClick={e => deleteComment(comment)} disabled={is_progressing_comment}>
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
    const registerComment = (comment_input) => {
        const comment_content = comment_input.value;
        if (comment_content.trim()) {
            //- request register comment using solution_id
            solution_actions.registerComment({ comment_content, solution_id });
        }
        comment_input.value = '';
    }

    const updateComment = (comment) => {
        if (comment.user.id !== user.id) {
            showErrorAlert({ error_what: '잘못된 접근', text: '댓글을 수정할 권한이 없습니다.' });
            return;
        }
        showTextInputAlert({ title: '댓글 수정', text: '', btn_text: '수정', default_value: comment.content }).then((comment_content) => {
            if (comment_content) {
                //- request update comment using comment_id, comment_content
                solution_actions.updateComment({ comment_id: comment.id, comment_content });
                // 성공 시, store의 해당 댓글 데이터만 수정
            }
        });
    }

    const deleteComment = (comment) => {
        if (comment.user.id !== user.id) {
            showErrorAlert({ error_what: '잘못된 접근', text: '댓글을 수정할 권한이 없습니다.' });
            return;
        }
        showWarningAlert({ title: '댓글 삭제', text: '정말 삭제할까요?', btn_text: '삭제' }).then((will_delete) => {
            if (will_delete) {
                //- request delete comment using comment_id
                solution_actions.deleteComment({ comment_id: comment.id });
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

                    <Button variant="outline-secondary" disabled={is_progressing_comment} onClick={e => registerComment(e.target.parentElement.parentElement.querySelector('.others-solution-comment-input'))}>
                        등록
                    </Button>
                </InputGroup.Append>
            </InputGroup>

        </>
    )
}

export default Comments;