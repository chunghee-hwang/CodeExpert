import { connect } from 'react-redux';
import SignupForm from 'pages/js/SignupForm';
const mapStateToProps = state => {
    return {
        user: state.account.user
    }
}
export default connect(mapStateToProps)(SignupForm);