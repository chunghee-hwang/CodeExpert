import { connect } from 'react-redux';
import ProblemList from 'pages/js/ProblemList';
const mapStateToProps = state => {
    return {
        user: state.account.user
    }
}
export default connect(mapStateToProps)(ProblemList);