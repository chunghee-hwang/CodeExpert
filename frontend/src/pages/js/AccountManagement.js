import React, { useEffect } from 'react';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import 'pages/css/AccountManagement.css';
import 'pages/css/Form.css';
import { paths } from 'constants/Paths';
import { input_names } from 'constants/FormInputNames';
import { validateNewNickname, validateNewPassword } from 'utils/validation/AccountManagementValidation';
import swal from 'sweetalert';
function AccountManagement(props) {
    /**
     *  nickname: {
        is_changing: false,
        is_change_success: false,
        msg: null
    }
     */
    const { nickname, account_actions } = props;

    let user = {
        id: 1,
        name: 'user1',
        nickname: escape('사용자1')
    }

    const changeNickname = form => {
        const validation = validateNewNickname(form, user.nickname);

        if (!validation.is_valid) {
            swal({
                title: "닉네임 변경 실패",
                text: validation.fail_cause,
                icon: "error",
                button: "확인",
            }).then(() => {
                if (validation.failed_element) {
                    validation.failed_element.focus();
                    validation.failed_element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
                }
            });
        } else {
            // request change nickname
            account_actions.changeNickname(validation.values[input_names.nickname]);
        }
    }

    const changePassword = form => {
        const validation = validateNewPassword(form);

        if (!validation.is_valid) {
            swal({
                title: "비밀번호 변경 실패",
                text: validation.fail_cause,
                icon: "error",
                button: "확인",
            }).then(() => {
                if (validation.failed_element) {
                    validation.failed_element.focus();
                    validation.failed_element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
                }
            });
        } else {
            // request change password

        }
    }

    const deleteAccount = () => {
        swal({
            title: "계정 삭제",
            text: "정말 계정을 삭제할까요?",
            icon: "warning",
            button: "삭제",
        }).then(() => {
            // request delete account
        });
    }
    useEffect(() => {
        if (!nickname.is_changing) {
            if (nickname.is_change_success) {
                swal({
                    title: "닉네임 변경 성공",
                    text: "닉네임 변경을 완료했습니다.",
                    icon: "success",
                    button: "확인",
                })
            }
            else if (nickname.msg) {
                swal({
                    title: "닉네임 변경 실패",
                    text: nickname.msg,
                    icon: "error",
                    button: "확인",
                })
            }
        }
    }, [nickname]);
    return (
        <div>
            <h1 className="text-center">계정 관리</h1>
            <Card>
                <Card.Header>프로필</Card.Header>
                <Card.Body>
                    <Form id="nicknameform" action={paths.actions.change_nickname} className="form" onSubmit={e => e.preventDefault()}>
                        <Form.Group>
                            <Form.Label>아이디</Form.Label>
                            <h6>{user.name}</h6>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>닉네임</Form.Label>
                            <Form.Control name={input_names.nickname}
                                defaultValue={unescape(user.nickname)} type="text" placeholder="닉네임을 입력하세요." maxLength="50" />
                        </Form.Group>
                        {nickname.is_changing ?
                            <Button variant="primary" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />변경 중...</Button>
                            :
                            <Button variant="primary" type="submit" onClick={e => changeNickname(document.getElementById('nicknameform'))}>닉네임 변경</Button>
                        }
                    </Form>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header>비밀번호 관리</Card.Header>
                <Card.Body>
                    <Form id="passwordform" action={paths.actions.change_password} className="form" onSubmit={e => e.preventDefault()}>
                        <Form.Group >
                            <Form.Label>현재 비밀번호</Form.Label>
                            <Form.Control name={input_names.password} type="password" placeholder="현재 비밀번호를 입력하세요." maxLength="50" />
                        </Form.Group>
                        <Form.Group >
                            <Form.Label>새로운 비밀번호</Form.Label>
                            <Form.Control name={input_names.new_password} type="password" placeholder="새로운 비밀번호를 입력하세요." maxLength="50" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>비밀번호 확인</Form.Label>
                            <Form.Control name={input_names.new_password_check} type="password" placeholder="비밀번호를 다시 입력하세요." maxLength="50" />
                        </Form.Group>
                        <Button variant="primary" type="submit" onClick={e => changePassword(document.getElementById('passwordform'))}>비밀번호 변경</Button>
                    </Form>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header>회원 탈퇴</Card.Header>
                <Card.Body>
                    <div className="text-center">
                        <span className="mx-3">테스트 결과, 프로필이 삭제됩니다.</span>
                        <Button variant="dark" onClick={e => deleteAccount()}>계정 삭제</Button>
                    </div>
                </Card.Body>
            </Card>
        </div >
    );
}

export default AccountManagement;