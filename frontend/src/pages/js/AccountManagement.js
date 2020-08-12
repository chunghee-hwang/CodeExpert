import React, { useEffect } from 'react';
import { Form, Button, Card, Spinner } from 'react-bootstrap';
import 'pages/css/AccountManagement.css';
import 'pages/css/Form.css';
import { paths } from 'constants/Paths';
import { inputNames } from 'constants/FormInputNames';
import { validateNewNickname, validateNewPassword } from 'utils/validation/AccountValidation';
import { showSuccessAlert, showErrorAlert, showValidationFailureAlert, showWarningAlert } from 'utils/AlertManager';
import { moveToPage } from 'utils/PageControl';
import AuthenticateManager from 'utils/AuthenticateManager';
function AccountManagement(props) {
    const { isProgressing,
        isSuccess,
        data,
        which, accountActions, user } = props;
    useEffect(() => {
        let successOrErrorWhat = null;
        if (!user || !AuthenticateManager.isUserLoggedIn()) {
            moveToPage(props.history, paths.pages.loginForm);
            return;
        }
        switch (which) {
            case 'nickname':
                successOrErrorWhat = '닉네임 변경';
                break;
            case 'password':
                successOrErrorWhat = '비밀번호 변경';
                break;
            case 'account':
                successOrErrorWhat = '계정 삭제';
                break;
            default:
                break;
        }

        if (successOrErrorWhat && !isProgressing) {
            if (isSuccess) {
                showSuccessAlert({ successWhat: successOrErrorWhat, text: data, appendSuccessText:true });
            } else {
                showErrorAlert({ successWhat: successOrErrorWhat, text: data, appendFailureText:true });
            }
            accountActions.clearWhich();
        }
    }, [which, isProgressing, isSuccess, data, props.history, user, accountActions]);

    const changeNickname = form => {
        const validation = validateNewNickname(form, user.nickname);

        if (!validation.isValid) {
            showValidationFailureAlert({ validation, failWhat: "닉네임 변경" });
        } else {
            //- request change nickname
            accountActions.changeNickname(validation.values);
        }
    }

    const changePassword = form => {
        const validation = validateNewPassword(form);

        if (!validation.isValid) {
            showValidationFailureAlert({ validation, failWhat: "비밀번호 변경" });
        } else {
            //- request change password
            accountActions.changePassword(validation.values);
        }
    }

    const deleteAccount = () => {
        showWarningAlert({ title: "계정 삭제", text: "정말 계정을 삭제할까요?", btnText: "삭제" }).then((willDelete) => {
            if (willDelete) {
                //- request delete account
                accountActions.deleteAccount();
            }
        });
    }
    return (
        <div>
            <h1 className="text-center">계정 관리</h1>
            <Card>
                <Card.Header>프로필</Card.Header>
                <Card.Body>
                    <Form id="nicknameform" action={paths.actions.changeNickname} className="form" onSubmit={e => e.preventDefault()}>
                        <Form.Group>
                            <Form.Label>아이디</Form.Label>
                            <h6>{user ? user.email : 'N/A'}</h6>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>닉네임</Form.Label>

                            <Form.Control name={inputNames.newNickname}
                                defaultValue={user ? decodeURI(user.nickname) : 'N/A'} type="text" placeholder="닉네임을 입력하세요." maxLength="50" />
                        </Form.Group>
                        {which === 'nickname' && isProgressing ?
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
                    <Form id="passwordform" action={paths.actions.changePassword} className="form" onSubmit={e => e.preventDefault()}>
                        <Form.Group >
                            <Form.Label>현재 비밀번호</Form.Label>
                            <Form.Control name={inputNames.password} type="password" placeholder="현재 비밀번호를 입력하세요." maxLength="50" />
                        </Form.Group>
                        <Form.Group >
                            <Form.Label>새로운 비밀번호</Form.Label>
                            <Form.Control name={inputNames.newPassword} type="password" placeholder="새로운 비밀번호를 입력하세요." maxLength="50" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>비밀번호 확인</Form.Label>
                            <Form.Control name={inputNames.newPasswordCheck} type="password" placeholder="비밀번호를 다시 입력하세요." maxLength="50" />
                        </Form.Group>
                        {which === 'password' && isProgressing ?
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
                        <span className="mx-3">내 테스트 결과, 내가 출제한 문제, 내 프로필이 삭제됩니다.</span>
                        {which === 'account' && isProgressing ?
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