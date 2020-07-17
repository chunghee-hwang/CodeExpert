import { connect } from 'react-redux';
import OthersSolutions from 'pages/js/OthersSolutions';
import { bindActionCreators } from 'redux';
import * as solution_actions from 'store/modules/Solution';
import * as problem_actions from 'store/modules/Problem';
const mapStateToProps = state => {
    return {
        account: {
            user: state.account.user
        },
        solution: {
            is_progressing: state.solution.is_progressing,
            is_success: state.solution.is_success,
            data: state.solution.data,
            which: state.solution.which
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
        solution_actions: bindActionCreators(solution_actions, dispatch),
        problem_actions: bindActionCreators(problem_actions, dispatch),
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(OthersSolutions);