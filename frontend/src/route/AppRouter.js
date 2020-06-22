import React from 'react';
import { Route, Switch } from 'react-router-dom'
import { paths } from 'constants/Paths'
import ProblemList from 'pages/js/ProblemList'
import SignupForm from 'pages/js/SignupForm';
import LoginForm from 'pages/js/LoginForm';
import MakeProblem from 'pages/js/MakeProblem';
import NotFound from 'pages/js/NotFound';
function AppRouter() {
    return (
        <Switch>
            <Route exact path={paths.root} component={ProblemList} />
            <Route path={paths.make_problem} component={MakeProblem} />
            <Route path={paths.problem_list} component={ProblemList} />
            <Route path={paths.signup_form} component={SignupForm} />
            <Route path={paths.login_form} component={LoginForm} />
            <Route path={paths.root} component={NotFound} />
        </Switch >
    );
}
export default AppRouter;