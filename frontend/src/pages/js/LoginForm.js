import React from 'react';
import { Form, Button } from 'react-bootstrap'
import 'pages/css/Form.css'
function LoginForm() {
    return (
        <div>
            <h1 className="my-3 text-align-center-horizontal">로그인</h1>

            <Form id="loginform" action="/login" className="form">
                <Form.Group>
                    <Form.Label>아이디</Form.Label>
                    <Form.Control name="name" type="text" placeholder="아이디를 입력하세요." maxLength="50" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control name="password" type="password" placeholder="비밀번호를 입력하세요." maxLength="50" />
                </Form.Group>
                <Button variant="primary" type="submit" block>
                    로그인
                </Button>
            </Form>
        </div>
    );
}
export default LoginForm;