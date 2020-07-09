import React, { useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap'
import 'pages/css/Form.css'
import { paths } from 'constants/Paths'
import { input_names } from 'constants/FormInputNames'
import { validateSignup } from 'utils/validation/SignupValidation';
import { showValidationFailureAlert, showSuccessAlert, showErrorAlert } from 'utils/AlertManager';
import { moveToPage } from 'utils/PageControl';

function SignupForm(props) {

    const { account_actions, is_progressing, is_success, data, which } = props;

    useEffect(() => {
        if (which === 'signup') {
            if (!is_progressing) {
                if (is_success) {
                    showSuccessAlert({ success_what: "회원 가입", text: "회원가입을 완료했습니다. 가입하신 정보로 로그인 해주세요." }).then(() => {
                        moveToPage(props.history, paths.pages.login_form);
                    });
                }
                else {
                    showErrorAlert({ error_what: "회원 가입", text: data });
                }
            }
        }
    }, [data, is_progressing, is_success, which, props.history]);

    const signup = form => {
        const validation = validateSignup(form);

        if (!validation.is_valid) {
            showValidationFailureAlert({ validation, fail_what: "회원 가입" });
        } else {
            //- request siginup
            account_actions.signup(validation.values);
        }
    }
    return (
        <div className="align-center">
            <h1 className="my-3 text-center">회원 가입</h1>
            <Form id="signupform" action={paths.actions.signup} className="form" onSubmit={e => e.preventDefault()}>
                <Form.Group >
                    <Form.Label>아이디</Form.Label>
                    <Form.Control name={input_names.id} type="text" placeholder="아이디를 입력하세요." maxLength="50" />
                </Form.Group>
                <Form.Group >
                    <Form.Label>닉네임</Form.Label>
                    <Form.Control name={input_names.nickname} type="text" placeholder="닉네임을 입력하세요." maxLength="50" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control name={input_names.password} type="password" placeholder="비밀번호를 입력하세요." maxLength="50" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>비밀번호 확인</Form.Label>
                    <Form.Control name={input_names.password_check} type="password" placeholder="비밀번호를 다시 입력하세요." maxLength="50" />
                </Form.Group>
                {which === 'signup' && is_progressing ?
                    <Button variant="primary" disabled block><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />회원가입 중...</Button>
                    :
                    <Button variant="primary" type="submit" block onClick={e => signup(document.getElementById('signupform'))}>회원 가입</Button>
                }

            </Form>
        </div>
    );
}

export default SignupForm;