import { connect } from 'react-redux';
import OthersSolutions from 'pages/js/OthersSolutions';
const mapStateToProps = state => {
    return {
        user: state.account.user
    }
}
export default connect(mapStateToProps)(OthersSolutions);