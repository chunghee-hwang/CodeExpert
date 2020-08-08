import React, { useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap'
import 'pages/css/Form.css'
import { paths } from 'constants/Paths'
import { inputNames } from 'constants/FormInputNames'
import { validateSignup } from 'utils/validation/SignupValidation';
import { showValidationFailureAlert, showSuccessAlert, showErrorAlert } from 'utils/AlertManager';
import { moveToPage } from 'utils/PageControl';

function SignupForm(props) {
    const { accountActions, isProgressing, isSuccess, data, which,user } = props;

    useEffect(() => {
        if(user){
            moveToPage(props.history, paths.actions.logout);
            setTimeout(()=>{
                moveToPage(props.history, paths.pages.signupForm);
            },10)
            return;
        }
        if (which === 'signup') {
            if (!isProgressing) {
                if (isSuccess) {
                    showSuccessAlert({ successWhat: "회원 가입", text: "회원가입을 완료했습니다. 가입하신 정보로 로그인 해주세요." }).then(() => {
                        moveToPage(props.history, paths.pages.loginForm);
                    });
                }
                else {
                    showErrorAlert({ errorWhat: "회원 가입", text: data });
                }
            }
        }
    }, [data, user,isProgressing, isSuccess, which, props.history]);

    const signup = form => {
        const validation = validateSignup(form);

        if (!validation.isValid) {
            showValidationFailureAlert({ validation, failWhat: "회원 가입" });
        } else {
            //- request siginup
            accountActions.signup(validation.values);
        }
    }
    return (
        <div className="align-center">
            <h1 className="my-3 text-center">회원 가입</h1>
            <Form id="signupform" action={paths.actions.signup} className="form" onSubmit={e => e.preventDefault()}>
                <Form.Group >
                    <Form.Label>아이디</Form.Label>
                    <Form.Control name={inputNames.email} type="text" placeholder="아이디를 입력하세요." maxLength="50" />
                </Form.Group>
                <Form.Group >
                    <Form.Label>닉네임</Form.Label>
                    <Form.Control name={inputNames.nickname} type="text" placeholder="닉네임을 입력하세요." maxLength="50" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control name={inputNames.password} type="password" placeholder="비밀번호를 입력하세요." maxLength="50" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>비밀번호 확인</Form.Label>
                    <Form.Control name={inputNames.passwordCheck} type="password" placeholder="비밀번호를 다시 입력하세요." maxLength="50" />
                </Form.Group>
                {which === 'signup' && isProgressing ?
                    <Button variant="primary" disabled block><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />회원가입 중...</Button>
                    :
                    <Button variant="primary" type="submit" block onClick={e => signup(document.getElementById('signupform'))}>회원 가입</Button>
                }

            </Form>
        </div>
    );
}

export default SignupForm;