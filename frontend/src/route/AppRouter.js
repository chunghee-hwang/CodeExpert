import React from 'react';
import { Route, Switch } from 'react-router-dom'
import { paths } from 'constants/Paths'
import ProblemList from 'pages/js/ProblemList'
import SignupForm from 'pages/js/SignupForm';
import LoginForm from 'pages/js/LoginForm';
import MakeProblem from 'pages/js/MakeProblem';
import NotFound from 'pages/js/NotFound';
import AccountManagement from 'pages/js/AccountManagement';
import AlgorithmTest from 'pages/js/AlgorithmTest';
import OthersSolutions from 'pages/js/OthersSolutions';


function AppRouter() {
    return (
        <Switch>
            <Route exact path={paths.pages.root} component={ProblemList} />
            <Route path={paths.pages.make_problem_form} component={MakeProblem} />
            <Route path={paths.pages.problem_list} component={ProblemList} />
            <Route path={paths.pages.signup_form} component={SignupForm} />
            <Route path={paths.pages.login_form} component={LoginForm} />
            <Route path={paths.pages.account_management} component={AccountManagement} />
            <Route path={paths.pages.algorithm_test.full} component={AlgorithmTest} />
            <Route path={paths.pages.others_solutions.full} component={OthersSolutions} />
            <Route path={paths.pages.root} component={NotFound} />
        </Switch >
    );
}
export default AppRouter;