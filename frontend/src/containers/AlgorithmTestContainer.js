import { connect } from 'react-redux';
import AlgorithmTest from 'pages/js/AlgorithmTest';
const mapStateToProps = state => {
    return {
        user: state.account.user
    }
}
export default connect(mapStateToProps)(AlgorithmTest);