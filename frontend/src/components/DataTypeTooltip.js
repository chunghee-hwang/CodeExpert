import React from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { FiHelpCircle } from 'react-icons/fi';
// 문제 출제자가 정답 테이블 작성할 때, 입력 형식 도움말 표시.

const popover = (
    <Popover id="popover-basic">
        <Popover.Title as="h3">도움말</Popover.Title>
        <Popover.Content>
            <ul>
                <li>
                    정수, 소수는 숫자를 입력하면 됩니다.<br />
                    <code>3.141597</code>
                </li>
                <li>
                    문자열은 큰따옴표를 이용해 입력해 주세요.<br />
                    <code>&quot;string&quot;</code> <br />
                </li>
                <li>
                    boolean은 true/false(소문자)로 입력해 주세요.<br />
                    <code>true/false</code> <br />
                </li>
                <li>
                    배열을 입력하려면 아래와 같이 []로 감싸서 입력해 주세요.<br />
                    <code>[0, 1, 2, 3, 4, 5]</code><br />
                    <code>[&quot;abc&quot;, &quot;cde&quot;]</code><br />
                    <code>[true, false, true]</code><br />
                </li>
            </ul>
        </Popover.Content>
    </Popover>
);

function DataTypeTooltip() {
    return (
        <OverlayTrigger delay={{ show: 250, hide: 1000 }} placement="right" overlay={popover}>
            <FiHelpCircle className="help-toggle-btn" color='blue' size="30px" />
        </OverlayTrigger>
    );
}



export default DataTypeTooltip;