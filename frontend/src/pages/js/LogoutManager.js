import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import * as account_actions from 'store/modules/Account';
import { connect } from 'react-redux';
import { paths } from 'constants/Paths';
import { showErrorAlert } from 'utils/AlertManager';
import { Spinner } from 'react-bootstrap';

function LogoutManager(props) {

    const { account_actions, which, is_progressing, is_success, user, data } = props;

    useEffect(() => {
        if (which !== 'logout') {
            if (user) {
                account_actions.logout();
            } else {
                props.history.push(paths.pages.login_form);
            }
        }
        else if (!is_progressing) {
            if (is_success) {
                props.history.push(paths.pages.login_form);
            }
            else {
                showErrorAlert({ error_what: '로그아웃', text: data }).then(() => {
                    props.history.push(paths.pages.problem_list);
                });
            }
        }
    }, [props.history, account_actions, which, is_progressing, is_success, user, data]);

    return <div className="text-center" style={{ "height": "100vh" }}>로그아웃 중입니다 <Spinner animation="grow" variant="warning" /></div>
}


const mapStateToProps = state => {
    return {
        is_progressing: state.account.is_progressing,
        is_success: state.account.is_success,
        which: state.account.which,
        user: state.account.user,
        data: state.account.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        account_actions: bindActionCreators(account_actions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutManager);