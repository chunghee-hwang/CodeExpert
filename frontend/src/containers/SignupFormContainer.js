import SignupForm from 'pages/js/SignupForm';
import { bindActionCreators } from 'redux';
import * as account_actions from 'store/modules/Account';
import { connect } from 'react-redux';
const mapStateToProps = state => {
    return {
        is_progressing: state.account.is_progressing,
        is_success: state.account.is_success,
        data: state.account.data,
        which: state.account.which,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        account_actions: bindActionCreators(account_actions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupForm);