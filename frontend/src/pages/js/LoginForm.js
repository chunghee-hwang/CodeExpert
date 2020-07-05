import React from 'react';
import { Form, Button } from 'react-bootstrap'
import 'pages/css/Form.css'
import { paths } from 'constants/Paths'
import { input_names } from 'constants/FormInputNames'
import { validateLogin } from 'utils/validation/LoginValidation';
import swal from 'sweetalert';
function LoginForm() {

    const login = form => {
        const validation = validateLogin(form);
        if (!validation.is_valid) {

            swal({
                title: "로그인 실패",
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

            // request login

        }
    }

    return (
        <div>
            <h1 className="my-3 text-center">로그인</h1>

            <Form id="loginform" action={paths.actions.login} className="form" onSubmit={e => e.preventDefault()}>
                <Form.Group>
                    <Form.Label>아이디</Form.Label>
                    <Form.Control name={input_names.id} type="text" placeholder="아이디를 입력하세요." maxLength="50" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control name={input_names.password} type="password" placeholder="비밀번호를 입력하세요." maxLength="50" />
                </Form.Group>
                <Button variant="primary" type="submit" block onClick={e => login(document.getElementById('loginform'))}>
                    로그인
                </Button>
            </Form>
        </div>
    );
}
export default LoginForm;