import React, { useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap'
import 'pages/css/Form.css'
import { paths } from 'constants/Paths'
import { input_names } from 'constants/FormInputNames'
import { validateLogin } from 'utils/validation/LoginValidation';
import { showErrorAlert, showValidationFailureAlert } from 'utils/AlertManager';
import { moveToPage } from 'utils/PageControl';
import AuthenticateManager from 'utils/AuthenticateManager';

function LoginForm(props) {
    const { is_progressing,
        is_success,
        data,
        which, user, account_actions } = props;



    const login = form => {
        const validation = validateLogin(form);
        if (!validation.is_valid) {
            showValidationFailureAlert({ validation, fail_what: "로그인" });
        } else {
            //- request login
            account_actions.login(validation.values);
        }
    }


    useEffect(() => {
        if (user && AuthenticateManager.isUserLoggedIn()) {
            moveToPage(props.history, paths.pages.problem_list);
        }
        if (which === 'login') {
            let success_or_error_what = '로그인';
            if (!is_progressing) {
                if (is_success) {
                    if(AuthenticateManager.isUserLoggedIn())moveToPage(props.history, paths.pages.problem_list);
                } else {
                    showErrorAlert({ error_what: success_or_error_what, text: data });
                }
            }
        }

    }, [which, is_progressing, is_success, data, user, props.history]);

    return (
        <div>
            <h1 className="my-3 text-center">로그인</h1>

            <Form id="loginform" action={paths.actions.login} className="form" onSubmit={e => e.preventDefault()}>
                <Form.Group>
                    <Form.Label>아이디</Form.Label>
                    <Form.Control name={input_names.email} type="text" placeholder="아이디를 입력하세요." maxLength="50" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control name={input_names.password} type="password" placeholder="비밀번호를 입력하세요." maxLength="50" />
                </Form.Group>
                {which === 'login' && is_progressing ?
                    <Button variant="primary" disabled block><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />로그인 중...</Button>
                    :
                    <Button variant="primary" type="submit" block onClick={e => login(document.getElementById('loginform'))}>로그인</Button>
                }
            </Form>
        </div>
    );
}
export default LoginForm;