export const getErrorMessageFromResponse = (error) => {
    if (error.response && error.response.data && error.response.data.errorMessage) {
        return error.response.data.errorMessage;
    }
    else {
        return error.message;
    }
}