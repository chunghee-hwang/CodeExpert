import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import * as account_actions from 'store/modules/Account';
import { connect } from 'react-redux';
import { paths } from 'constants/Paths';
import { showErrorAlert } from 'utils/AlertManager';
import LoadingScreen from 'components/LoadingScreen';
import { moveToPage } from 'utils/PageControl';

function LogoutManager(props) {

    const { account_actions, which, is_progressing, is_success, user, data } = props;

    useEffect(() => {
        if (which !== 'logout') {
            if (user) {
                account_actions.logout();
            } else {
                moveToPage(props.history, paths.pages.login_form);
            }
        }
        else if (!is_progressing) {
            if (is_success) {
                moveToPage(props.history, paths.pages.login_form);
            }
            else {
                showErrorAlert({ error_what: '로그아웃', text: data }).then(() => {
                    moveToPage(props.history, paths.pages.problem_list);
                });
            }
        }
    }, [props.history, account_actions, which, is_progressing, is_success, user, data]);

    return <LoadingScreen label="로그 아웃 중입니다." variant='warning' />;
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