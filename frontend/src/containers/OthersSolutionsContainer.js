import { connect } from 'react-redux';
import OthersSolutions from 'pages/js/OthersSolutions';
import { bindActionCreators } from 'redux';
import * as solutionActions from 'store/modules/Solution';
import * as problemActions from 'store/modules/Problem';
const mapStateToProps = state => {
    return {
        account: {
            user: state.account.user
        },
        solution: {
            isProgressing: state.solution.isProgressing,
            isSuccess: state.solution.isSuccess,
            data: state.solution.data,
            which: state.solution.which
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
        solutionActions: bindActionCreators(solutionActions, dispatch),
        problemActions: bindActionCreators(problemActions, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OthersSolutions);