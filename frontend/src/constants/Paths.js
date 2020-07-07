export const paths =
{
    pages: {
        root: "/",
        problem_list: "/problem_list",
        make_problem_form: "/make_problem_form",
        signup_form: "/signup_form",
        account_management: "/account_management",
        login_form: "/login_form",
        algorithm_test: {
            prefix: "/algorithm_test",
            full: "/algorithm_test/:problem_id"
        },
        others_solutions: {
            prefix: "/others_solutions",
            full: "/others_solutions/:problem_id"
        }
    },
    actions: {
        make_problem: "/make_problem",
        login: "/login",
        logout: "/logout",
        change_nickname: "/change_nickname",
        change_password: "/change_password",
        signup: "/signup",

    }
}