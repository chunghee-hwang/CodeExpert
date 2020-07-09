import swal from "sweetalert";

export const showSuccessAlert = ({ success_what, text, btn_text }) => {
    if (!btn_text) btn_text = '확인';
    return swal({
        title: success_what + ' 성공',
        text,
        icon: "success",
        button: btn_text,
    });
}

export const showErrorAlert = ({ error_what, text, btn_text }) => {
    if (!btn_text) btn_text = '확인';
    return swal({
        title: error_what + ' 실패',
        text,
        icon: "error",
        button: btn_text
    });
}

export const showWarningAlert = ({ title, text, btn_text }) => {
    if (!btn_text) btn_text = '확인';
    return swal({
        title,
        text,
        icon: "warning",
        buttons: {
            cancel: '취소',
            [btn_text]: btn_text
        },
        dangerMode: true,
    });
}

export const showValidationFailureAlert = ({ validation, fail_what, btn_text }) => {
    if (validation.is_valid) return;
    const afterValidate = () => {
        if (validation.failed_element) {
            validation.failed_element.focus();
            validation.failed_element.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        }
    };
    return showErrorAlert({ error_what: fail_what, text: validation.fail_cause, btn_text }).then(afterValidate);
}