export const paths =
{
    pages: {
        root: "/",
        problem_list: "/problemList",
        make_problem_form: "/makeProblemForm",
        signup_form: "/signupForm",
        account_management: "/accountManagement",
        login_form: "/loginForm",
        algorithm_test: {
            prefix: "/algorithmTest",
            full: "/algorithmTest/:problemId"
        },
        others_solutions: {
            prefix: "/othersSolutions",
            full: "/othersSolutions/:problemId"
        }
    },
    actions: {
        make_problem: "/makeProblem",
        login: "/login",
        logout: "/logout",
        change_nickname: "/changeNickname",
        change_password: "/changePassword",
        signup: "/signup",

    }
}