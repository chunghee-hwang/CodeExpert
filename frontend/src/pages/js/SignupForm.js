import React, { useEffect } from 'react';
import { Form, Button } from 'react-bootstrap'
import 'pages/css/Form.css'
import { paths } from 'constants/Paths'
import { input_names } from 'constants/FormInputNames'
import { validateSignup } from 'utils/validation/SignupValidation';
import { showValidationFailureAlert } from 'utils/AlertManager';

function SignupForm(props) {

    const { user } = props;

    useEffect(() => {
        if (user) {
            props.history.push(paths.pages.problem_list);
        }
    }, [user, props.history]);

    const signup = form => {
        const validation = validateSignup(form);

        if (!validation.is_valid) {
            showValidationFailureAlert({ validation, fail_what: "회원 가입" });
        } else {
            // request siginup

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
                <Button variant="primary" type="submit" block onClick={e => signup(document.getElementById('signupform'))}>
                    회원 가입
                </Button>
            </Form>
        </div>
    );
}

export default SignupForm;