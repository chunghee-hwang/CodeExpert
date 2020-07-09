import React, { useEffect } from 'react';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import 'pages/css/AccountManagement.css';
import 'pages/css/Form.css';
import { paths } from 'constants/Paths';
import { input_names } from 'constants/FormInputNames';
import { validateNewNickname, validateNewPassword } from 'utils/validation/AccountManagementValidation';
import { showSuccessAlert, showErrorAlert, showValidationFailureAlert, showWarningAlert } from 'utils/AlertManager';
import { moveToPage } from 'utils/PageControl';
function AccountManagement(props) {
    const { is_progressing,
        is_success,
        data,
        which, account_actions, user } = props;
    useEffect(() => {
        let success_or_error_what = null;
        if (!user) {
            moveToPage(props.history, paths.pages.login_form);
            return;
        }
        switch (which) {
            case 'nickname':
                success_or_error_what = '닉네임 변경';
                break;
            case 'password':
                success_or_error_what = '비밀번호 변경';
                break;
            case 'account':
                success_or_error_what = '계정 삭제';
                break;
            default:
                break;
        }

        if (success_or_error_what && !is_progressing) {
            if (is_success) {
                showSuccessAlert({ success_what: success_or_error_what, text: data });
            } else {
                showErrorAlert({ success_what: success_or_error_what, text: data });
            }
            account_actions.clearWhich();
        }
    }, [which, is_progressing, is_success, data, props.history, user, account_actions]);

    const changeNickname = form => {
        const validation = validateNewNickname(form, user.nickname);

        if (!validation.is_valid) {
            showValidationFailureAlert({ validation, fail_what: "닉네임 변경" });
        } else {
            //- request change nickname
            account_actions.changeNickname(validation.values);
        }
    }

    const changePassword = form => {
        const validation = validateNewPassword(form);

        if (!validation.is_valid) {
            showValidationFailureAlert({ validation, fail_what: "비밀번호 변경" });
        } else {
            //- request change password
            account_actions.changePassword(validation.values);
        }
    }

    const deleteAccount = () => {
        showWarningAlert({ title: "계정 삭제", text: "정말 계정을 삭제할까요?", btn_text: "삭제" }).then((will_delete) => {
            if (will_delete) {
                //- request delete account
                account_actions.deleteAccount();
            }
        });
    }




    return (
        <div>
            <h1 className="text-center">계정 관리</h1>
            <Card>
                <Card.Header>프로필</Card.Header>
                <Card.Body>
                    <Form id="nicknameform" action={paths.actions.change_nickname} className="form" onSubmit={e => e.preventDefault()}>
                        <Form.Group>
                            <Form.Label>아이디</Form.Label>
                            <h6>{user ? user.name : 'N/A'}</h6>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>닉네임</Form.Label>

                            <Form.Control name={input_names.nickname}
                                defaultValue={user ? unescape(user.nickname) : 'N/A'} type="text" placeholder="닉네임을 입력하세요." maxLength="50" />
                        </Form.Group>
                        {which === 'nickname' && is_progressing ?
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
                        {which === 'password' && is_progressing ?
                            <Button variant="primary" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />변경 중...</Button>
                            :
                            <Button variant="primary" type="submit" onClick={e => changePassword(document.getElementById('passwordform'))}>비밀번호 변경</Button>
                        }
                    </Form>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header>회원 탈퇴</Card.Header>
                <Card.Body>
                    <div className="text-center">
                        <span className="mx-3">테스트 결과, 프로필이 삭제됩니다.</span>
                        {which === 'account' && is_progressing ?
                            <Button variant="dark" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />삭제 중...</Button>
                            :
                            <Button variant="dark" onClick={e => deleteAccount()}>계정 삭제</Button>
                        }
                    </div>
                </Card.Body>
            </Card>
        </div >
    );
}

export default AccountManagement;