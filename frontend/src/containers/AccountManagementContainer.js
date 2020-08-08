import AccountManagement from 'pages/js/AccountManagement';
import { bindActionCreators } from 'redux';
import * as accountActions from 'store/modules/Account';
import { connect } from 'react-redux';
const mapStateToProps = state => {
    /**
     * isProgressing,
        isSuccess,
        data,
        which
     */
    return {
        isProgressing: state.account.isProgressing,
        isSuccess: state.account.isSuccess,
        data: state.account.data,
        which: state.account.which,
        user: state.account.user,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        accountActions: bindActionCreators(accountActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagement);