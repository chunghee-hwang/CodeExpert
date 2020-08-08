/**
 * write: 테이블 모드
 */
export const tableMode = {

    write: {
        /** 파라미터와 테스트케이스 모두 수정 가능 모드 */
        paramAndTestcase: 1000,

        /** 테스트케이스만 수정 가능 모드 */
        testcase: 1001
    },

    /** 읽기만 가능한 모드(initValue props 필요) */
    read: 1002
}