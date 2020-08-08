export const paths =
{
    pages: {
        root: "/",
        problemList: "/problemList",
        makeProblemForm: "/makeProblemForm",
        signupForm: "/signupForm",
        accountManagement: "/accountManagement",
        loginForm: "/loginForm",
        algorithmTest: {
            prefix: "/algorithmTest",
            full: "/algorithmTest/:problemId"
        },
        othersSolutions: {
            prefix: "/othersSolutions",
            full: "/othersSolutions/:problemId"
        }
    },
    actions: {
        makeProblem: "/makeProblem",
        login: "/login",
        logout: "/logout",
        changeNickname: "/changeNickname",
        changePassword: "/changePassword",
        signup: "/signup",

    }
}