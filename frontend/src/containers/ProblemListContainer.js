import { connect } from 'react-redux';
import ProblemList from 'pages/js/ProblemList';
import { bindActionCreators } from 'redux';
import * as problemActions from 'store/modules/Problem';
const mapStateToProps = state => {
    return {
        account: {
            user: state.account.user
        },
        problem: {
            isProgressing: state.problem.isProgressing,
            isSuccess: state.problem.isSuccess,
            data: state.problem.data,
            which: state.problem.which
        }
    }
}
const mapDispatchToProps = dispatch => {
    return {
        problemActions: bindActionCreators(problemActions, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProblemList);