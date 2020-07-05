import React, { useState } from 'react';
import { FormControl, Button, InputGroup } from 'react-bootstrap';
import Moment from 'react-moment';
import 'moment-timezone';
function Comments(props) {
    // const solution_id = props.solution_id;
    const user_id = 2;
    /**
     * request a solution includes comments only using solution_id
     */
    //props로 대체 예정
    const [solution, setSolution] = useState({
        comments: [
            {
                id: 1,
                user: {
                    id: 2,
                    name: '사용자2',
                },
                timestamp: new Date(),
                content: '정말 간단하네요!'
            },
            {
                id: 2,
                user: {
                    id: 3,
                    name: '사용자3',
                },
                timestamp: new Date(),
                content: 'map 함수가 뭔지 찾아봐야겠네요.'
            },
            {
                id: 3,
                user: {
                    id: 3,
                    name: '사용자3',
                },
                timestamp: new Date(),
                content: 'sort와 sorted 함수의 차이가 뭔가요?'
            }
        ]
    });

    const createCommentsTemplate = (comments) => {

        return comments.reduce((accumulator, comment, idx) => {
            accumulator.push(
                <tr key={idx}>
                    <td className="others-solution-comment-username font-weight-bold">{comment.user.name}</td>
                    <td className="others-solution-comment-timestamp"><Moment date={comment.timestamp} format="YYYY-MM-DD HH:mm" /></td>
                    <td className="others-solution-comment-content">
                        {
                            user_id === comment.user.id ?
                                <input className="others-solution-comment-update-input form-control" defaultValue={comment.content} placeholder="댓글을 입력하세요." aria-label="댓글 남기기" /> :
                                comment.content
                        }
                    </td>

                    {user_id === comment.user.id ?
                        <td>
                            <Button variant="outline-info" onClick={e => updateComment(comment.id, e.target.parentElement.parentElement.querySelector('.others-solution-comment-update-input').value)}>수정</Button>
                            <Button variant="outline-danger" onClick={e => deleteComment(comment.id)}>삭제</Button>
                        </td>
                        : null
                    }
                </tr>
            );
            return accumulator;
        }, []);
    }
    const registerComment = (comment_content) => {
        if (comment_content.trim()) {
            // request register comment using solution_id

            // change dommy object
            setSolution({
                comments: [
                    {
                        id: 1,
                        user: {
                            id: 2,
                            name: '사용자2',
                        },
                        timestamp: new Date(),
                        content: '정말 간단하네요!'
                    },
                    {
                        id: 2,
                        user: {
                            id: 3,
                            name: '사용자3',
                        },
                        timestamp: new Date(),
                        content: 'map 함수가 뭔지 찾아봐야겠네요.'
                    },
                    {
                        id: 3,
                        user: {
                            id: 3,
                            name: '사용자3',
                        },
                        timestamp: new Date(),
                        content: 'sort와 sorted 함수의 차이가 뭔가요?'
                    }, {
                        id: 4,
                        user: {
                            id: user_id,
                            name: '사용자2'
                        },
                        timestamp: new Date(),
                        content: comment_content
                    }
                ]
            });

        }
    }

    const updateComment = (comment_id, comment_content) => {
        // request update comment using comment_id, comment_content, user_id
        if (comment_content.trim()) {
            console.log(comment_content);
            // get comment
        }
    }

    const deleteComment = (comment_id) => {
        // request delete comment using comment_id, user_id
        setSolution({
            comments: [
                {
                    id: 2,
                    user: {
                        id: 3,
                        name: '사용자3',
                    },
                    timestamp: new Date(),
                    content: 'map 함수가 뭔지 찾아봐야겠네요.'
                },
                {
                    id: 3,
                    user: {
                        id: 3,
                        name: '사용자3',
                    },
                    timestamp: new Date(),
                    content: 'sort와 sorted 함수의 차이가 뭔가요?'
                }
            ]
        });
    }

    return (
        <>
            <table>
                <tbody>
                    {createCommentsTemplate(solution.comments)}
                </tbody>
            </table>

            <InputGroup className="mb-3 others-solution-comment">
                <FormControl
                    className="others-solution-comment-input"
                    placeholder="댓글을 입력하세요."
                    aria-label="댓글 남기기"
                    aria-describedby="basic-addon2"
                />
                <InputGroup.Append>
                    <Button variant="outline-secondary" onClick={e => registerComment(e.target.parentElement.parentElement.querySelector('.others-solution-comment-input').value)}>등록</Button>
                </InputGroup.Append>
            </InputGroup>
        </>
    )
}

export default Comments;