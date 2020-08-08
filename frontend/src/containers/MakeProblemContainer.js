import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as problemActions from 'store/modules/Problem';
import MakeProblem from 'pages/js/MakeProblem';
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
export default connect(mapStateToProps, mapDispatchToProps)(MakeProblem);