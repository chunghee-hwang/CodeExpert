import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import * as accountActions from 'store/modules/Account';
import { connect } from 'react-redux';
import { paths } from 'constants/Paths';
import { showErrorAlert } from 'utils/AlertManager';
import LoadingScreen from 'components/LoadingScreen';
import { moveToPage } from 'utils/PageControl';

function LogoutManager(props) {

    const { accountActions, which, isProgressing, isSuccess, user, data } = props;

    useEffect(() => {
        if (which !== 'logout') {
            if (user) {
                accountActions.logout();
            } else {
                moveToPage(props.history, paths.pages.loginForm);
            }
        }
        else if (!isProgressing) {
            if (isSuccess) {
                moveToPage(props.history, paths.pages.loginForm);
            }
            else {
                showErrorAlert({ errorWhat: '로그아웃', text: data }).then(() => {
                    moveToPage(props.history, paths.pages.problemList);
                });
            }
        }
    }, [props.history, accountActions, which, isProgressing, isSuccess, user, data]);

    return <LoadingScreen label="로그 아웃 중입니다." variant='warning' />;
}


const mapStateToProps = state => {
    return {
        isProgressing: state.account.isProgressing,
        isSuccess: state.account.isSuccess,
        which: state.account.which,
        user: state.account.user,
        data: state.account.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        accountActions: bindActionCreators(accountActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LogoutManager);