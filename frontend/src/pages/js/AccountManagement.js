import React from 'react';
import { Form, Button, Card } from 'react-bootstrap'

import 'pages/css/AccountManagement.css';
import 'pages/css/Form.css'
function AccountManagement() {

    return (
        <div>
            <h1 className="text-align-center-horizontal">계정 관리</h1>
            <Card>
                <Card.Header>프로필</Card.Header>
                <Card.Body>
                    <Form id="nicknameform" action="/changenickname
" className="form">
                        <Form.Group>
                            <Form.Label>아이디</Form.Label>
                            <h6>user1</h6>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>닉네임</Form.Label>
                            <Form.Control name="nickname"
                                defaultValue="사용자1" type="text" placeholder="닉네임을 입력하세요." maxLength="50" />
                        </Form.Group>
                        <Button variant="primary" type="submit">닉네임 변경</Button>
                    </Form>
                </Card.Body>
            </Card>

            <Card>
                <Card.Header>비밀번호 관리</Card.Header>
                <Card.Body>
                    <Form id="passwordform" action="/changepassword" className="form">
                        <Form.Group >
                            <Form.Label>현재 비밀번호</Form.Label>
                            <Form.Control name="password" type="password" placeholder="현재 비밀번호를 입력하세요." maxLength="50" />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>비밀번호 확인</Form.Label>
                            <Form.Control name="passwordCheck" type="password" placeholder="비밀번호를 다시 입력하세요." maxLength="50" />
                        </Form.Group>
                        <Button variant="primary" type="submit">비밀번호 변경</Button>
                    </Form>
                </Card.Body>
            </Card>
            <Card>
                <Card.Header>회원 탈퇴</Card.Header>
                <Card.Body>
                    <div className="text-align-center-horizontal">
                        <span className="mx-3">테스트 결과, 프로필이 삭제됩니다.</span>
                        <Button variant="dark">계정 삭제</Button>
                    </div>
                </Card.Body>
            </Card>
        </div >
    );
}

export default AccountManagement;