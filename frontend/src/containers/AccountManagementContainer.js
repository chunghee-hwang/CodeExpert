import AccountManagement from 'pages/js/AccountManagement';
import { bindActionCreators } from 'redux';
import * as account_actions from 'store/modules/Account';
import { connect } from 'react-redux';
const mapStateToProps = state => {
    /**
     *  nickname: {
        is_changing: false,
        change_success: false,
        msg: null
    },
     */
    return {
        nickname: state.account.nickname
    }
}

const mapDispatchToProps = dispatch => {
    return {
        account_actions: bindActionCreators(account_actions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AccountManagement);