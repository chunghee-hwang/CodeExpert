import React from 'react';
import { Form, Button } from 'react-bootstrap'
import 'pages/css/Form.css'
function SignupForm() {
    return (
        <div className="align-center-horizontal">
            <h1 className="my-3 text-align-center-horizontal">회원 가입</h1>
            <Form id="signupform" action="/signup" className="form">
                <Form.Group >
                    <Form.Label>아이디</Form.Label>
                    <Form.Control name="name" type="text" placeholder="아이디를 입력하세요." maxLength="50" />
                </Form.Group>
                <Form.Group >
                    <Form.Label>닉네임</Form.Label>
                    <Form.Control name="nickname" type="text" placeholder="닉네임을 입력하세요." maxLength="50" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>비밀번호</Form.Label>
                    <Form.Control name="password" type="password" placeholder="비밀번호를 입력하세요." maxLength="50" />
                </Form.Group>
                <Form.Group>
                    <Form.Label>비밀번호 확인</Form.Label>
                    <Form.Control name="passwordCheck" type="password" placeholder="비밀번호를 다시 입력하세요." maxLength="50" />
                </Form.Group>
                <Button variant="primary" type="submit" block>
                    회원 가입
                </Button>
            </Form>
        </div>
    );
}

export default SignupForm;