import React, { useState, useEffect } from 'react';
import 'pages/css/ProblemList.css';
import ProblemItemBox from 'components/js/ProblemItemBox';
import { Pagination } from 'react-bootstrap';
function ProblemList() {
    const [page, setPage] = useState(1);
    useEffect(() => {
        fetch(`/problem_list?page=${page}`);
    }, [page])
    // 문제 유형
    let problem_types = [
        { id: 1, name: "정렬" },
        { id: 2, name: "스택/큐" },
        { id: 3, name: "동적 계획법" },
        { id: 4, name: "탐욕법" },
        { id: 5, name: "완전 탐색" },
        { id: 6, name: "힙" },
        { id: 7, name: "해시" },
        { id: 1000, name: "내가 출제한 문제" }
    ]

    // 난이도
    let levels = [
        { id: 1, name: "1" },
        { id: 2, name: "2" },
        { id: 3, name: "3" },
        { id: 4, name: "4" },
    ]

    // 끝 페이지
    let end_page_number = 20;
    let pagination_items = [];
    for (let number = 1; number <= end_page_number; number++) {
        pagination_items.push(
            <Pagination.Item key={number} active={page === number} onClick={e => { setPage(number); }}>{number}</Pagination.Item>
        );
    }

    // 문제
    let problems = [
        {
            id: 1, title: "오름차순으로 정렬하기",
            type:
            {
                id: 1, name: "정렬"
            },
            level: 1,
            resolve_count: 51891,
            created_by_me: true,
            resolved: true,
        },
        {
            id: 2, title: "미니 계산기",
            type:
            {
                id: 2, name: "스택"
            },
            level: 3
            ,
            resolve_count: 424,
            created_by_me: false,
            resolved: true,
        },
        {
            id: 3, title: "동전 교환기",
            type:
            {
                id: 4, name: "탐욕법"
            },
            level: 2,
            resolve_count: 7901,
            created_by_me: false,
            resolved: false,
        },
        {
            id: 4, title: "짝 맞추기",
            type:
            {
                id: 7, name: "해시"
            },
            level: 1
            ,
            resolve_count: 14791,
            created_by_me: false,
            resolved: false,
        },
        {
            id: 5, title: "공정 거래",
            type:
            {
                id: 5, name: "완전 탐색"
            },
            level: 4,
            resolve_count: 11,
            created_by_me: false,
            resolved: false,
        },
        {
            id: 6, title: "출력 대기열",
            type:
            {
                id: 6, name: "힙"
            },
            level: 3,
            resolve_count: 5464,
            created_by_me: false,
            resolved: true,
        },

    ];
    let problem_boxes = problems.reduce((accumulator, problem, idx) => {
        accumulator.push(
            <ProblemItemBox key={problem.id} problem={problem} />
        );
        return accumulator;
    }, []);


    let problem_type_checkboxes = problem_types.reduce((accumulator, problem_type) => {
        let tag_id = `type-checkbox-${problem_type.id}`;
        accumulator.push(
            <div key={problem_type.id}>
                <input type="checkbox" className="form-check-input" id={tag_id} onChange={e => updateProblemList()} />
                <label className="form-check-label" htmlFor={tag_id}>{problem_type.name}</label>
            </div>
        );
        return accumulator;
    }, []);

    let level_checkboxes = levels.reduce((accumulator, level) => {
        let tag_id = `level-checkbox-${level.id}`;
        accumulator.push(
            <div key={level.id}>
                <input type="checkbox" className="form-check-input" id={tag_id} onChange={e => updateProblemList()} />
                <label className="form-check-label" htmlFor={tag_id}>{level.name}</label>
            </div>
        )
        return accumulator;
    }, []);
    return (
        <div className="problem-page align-center">
            <div className="left-panel">
                <div className="user-info">
                    <div className="panel-title">사용자1</div>
                    <h6>해결한 문제 수: 11</h6>
                </div>

                <div className="problem-types">
                    <div className="panel-title">문제 유형</div>
                    <div className="form-check filter">
                        {problem_type_checkboxes}
                    </div>
                </div>
                <div className="problem-levels">
                    <div className="panel-title">난이도</div>
                    <div className="form-check filter">
                        {level_checkboxes}
                    </div>
                </div>

            </div>
            <div className="problems-and-pages">
                <div className="problem-list">
                    {problem_boxes}
                </div>
                <div className="pages horizontal-scroll ">
                    <Pagination className="align-center">
                        <Pagination.Prev onClick={e => {
                            if (page > 1) setPage(page - 1);
                        }} />
                        {pagination_items}
                        <Pagination.Next onClick={e => {
                            if (page < end_page_number) setPage(page + 1);
                        }} />
                    </Pagination>
                </div>
            </div>

        </div>
    );


    function updateProblemList() {

    }
}




export default ProblemList;