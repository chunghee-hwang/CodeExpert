import { connect } from 'react-redux';
import MakeProblem from 'pages/js/MakeProblem';
const mapStateToProps = state => {
    return {
        user: state.account.user
    }
}
export default connect(mapStateToProps)(MakeProblem);