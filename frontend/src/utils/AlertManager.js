import swal from "sweetalert";

export const showSuccessAlert = ({ successWhat, text, btnText, appendSuccessText }) => {
    if (!btnText) btnText = '확인';
    let title = '';
    if (successWhat) {
        title = successWhat;
        if(appendSuccessText){
            title+=' 성공';
        }
    }
    return swal({
        title,
        text,
        icon: "success",
        button: btnText,
    });
}

export const showErrorAlert = ({ errorWhat, text, btnText, appendFailureText }) => {
    if (!btnText) btnText = '확인';
    let title = '';
    if (errorWhat) {
        title = errorWhat;
        if(appendFailureText){
            title+=" 실패";
        }
    }
    return swal({
        title,
        text,
        icon: "error",
        button: btnText
    });
}

export const showWarningAlert = ({ title, text, btnText }) => {
    if (!btnText) btnText = '확인';
    return swal({
        title,
        text,
        icon: "warning",
        buttons: {
            cancel: '취소',
            [btnText]: btnText
        },
        dangerMode: true,
    });
}

export const showValidationFailureAlert = ({ validation, failWhat, btnText }) => {
    if (validation.isValid) return;
    const afterValidate = () => {
        if (validation.failedElement) {
            validation.failedElement.focus();
            validation.failedElement.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        }
    };
    return showErrorAlert({ errorWhat: failWhat, text: validation.failCause, btnText, appendFailureText:true }).then(afterValidate);
}

export const showTextInputAlert = ({ title, text, btnText, defaultValue }) => {
    if (!btnText) btnText = '확인';
    return swal({
        title,
        text,

        button: btnText,
        content: {
            element: 'input',
            attributes: {
                defaultValue: defaultValue,
            }
        }
    });
}