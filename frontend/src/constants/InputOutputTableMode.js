/**
 * write: 테이블 모드
 */
export const table_mode = {

    write: {
        /** 파라미터와 테스트케이스 모두 수정 가능 모드 */
        param_and_testcase: 1000,

        /** 테스트케이스만 수정 가능 모드 */
        testcase: 1001
    },

    /** 읽기만 가능한 모드(init_value props 필요) */
    read: 1002
}