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
        login: "/authenticate",
        logout: "/logoutAccount",
        changeNickname: "/changeNickname",
        changePassword: "/changePassword",
        signup: "/signup",

    }
}