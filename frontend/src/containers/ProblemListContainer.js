import { connect } from 'react-redux';
import ProblemList from 'pages/js/ProblemList';
import { bindActionCreators } from 'redux';
import * as problem_actions from 'store/modules/Problem';
const mapStateToProps = state => {
    return {
        account: {
            user: state.account.user
        },
        problem: {
            is_progressing: state.problem.is_progressing,
            is_success: state.problem.is_success,
            data: state.problem.data,
            which: state.problem.which
        }
    }
}
const mapDispatchToProps = dispatch => {
    return {
        problem_actions: bindActionCreators(problem_actions, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProblemList);