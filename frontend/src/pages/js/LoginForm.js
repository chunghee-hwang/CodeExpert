import React, { useEffect } from 'react';
import { Form, Button, Spinner } from 'react-bootstrap'
import 'pages/css/Form.css'
import { paths } from 'constants/Paths'
import { inputNames } from 'constants/FormInputNames'
import { validateLogin } from 'utils/validation/AccountValidation';
import { showErrorAlert, showValidationFailureAlert } from 'utils/AlertManager';
import { moveToPage } from 'utils/PageControl';
import AuthenticateManager from 'utils/AuthenticateManager';

function LoginForm(props) {
    const { isProgressing,
        isSuccess,
        data,
        which, user, accountActions } = props;


    const login = form => {
        const validation = validateLogin(form);
        if (!validation.isValid) {
            showValidationFailureAlert({ validation, failWhat: "로그인" });
        } else {
            //- request login
            accountActions.login(validation.values);
        }
    }


    useEffect(() => {
        if (user && AuthenticateManager.isUserLoggedIn()) {
            moveToPage(props.history, paths.pages.problemList);
        }
        if (which === 'login') {
            let successOrErrorWhat = '로그인';
            if (!isProgressing) {
                if (isSuccess) {
                    if(AuthenticateManager.isUserLoggedIn())moveToPage(props.history, paths.pages.problemList);
                } else {
                    showErrorAlert({ errorWhat: successOrErrorWhat, text: data, appendFailureText:true });
                }
            }
        }

    }, [which, isProgressing, isSuccess, data, user, props.history]);

    return (
        <div>
            <h1 className="my-3 text-center">로그인</h1>

            <Form id="loginform" action={paths.actions.login} className="form" onSubmit={e => e.preventDefault()}>
                <Form.Group>
                    <Form.Label>아이디</Form.Label>
                    <Form.Control name={inputNames.email} type="text" placeholder="아이디를 입력하세요." maxLength="50" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control name={inputNames.password} type="password" placeholder="비밀번호를 입력하세요." maxLength="50" />
                </Form.Group>
                {which === 'login' && isProgressing ?
                    <Button variant="primary" disabled block><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />로그인 중...</Button>
                    :
                    <Button variant="primary" type="submit" block onClick={e => login(document.getElementById('loginform'))}>로그인</Button>
                }
            </Form>
        </div>
    );
}
export default LoginForm;