import { connect } from 'react-redux';
import Menubar from 'components/Menubar';
const mapStateToProps = state => {
    return {
        user: state.account.user
    }
}
export default connect(mapStateToProps)(Menubar);