import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'
import { paths } from 'constants/Paths'
import NotFound from 'pages/js/NotFound';
import AccountManagementContainer from 'containers/AccountManagementContainer';
import LoginFormContainer from 'containers/LoginFormContainer';
import MakeProblemContainer from 'containers/MakeProblemContainer';
import ProblemListContainer from 'containers/ProblemListContainer';
import SignupFormContainer from 'containers/SignupFormContainer';
import AlgorithmTestContainer from 'containers/AlgorithmTestContainer';
import OthersSolutionsContainer from 'containers/OthersSolutionsContainer';
import LogoutManager from 'pages/js/LogoutManager';

function AppRouter() {
    return (
        <Switch>
            <Route exact path={paths.pages.root}>
                <Redirect to={paths.pages.problem_list}></Redirect>
            </Route>
            <Route path={paths.pages.make_problem_form} component={MakeProblemContainer} />
            <Route path={paths.pages.problem_list} component={ProblemListContainer} />
            <Route path={paths.pages.signup_form} component={SignupFormContainer} />
            <Route path={paths.pages.login_form} component={LoginFormContainer} />
            <Route path={paths.pages.account_management} component={AccountManagementContainer} />
            <Route path={paths.pages.algorithm_test.full} component={AlgorithmTestContainer} />
            <Route path={paths.pages.others_solutions.full} component={OthersSolutionsContainer} />
            <Route path={paths.actions.logout} component={LogoutManager} />
            <Route path={paths.pages.root} component={NotFound} />
        </Switch >
    );
}
export default AppRouter;