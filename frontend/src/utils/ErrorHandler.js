export const getErrorMessageFromResponse = (error) => {
    if (error.response && error.response.data && error.response.data.error_message) {
        return error.response.data.error_message;
    }
    else {
        return error.message;
    }
}