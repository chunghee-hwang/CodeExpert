export function createElementWithText(tag, contentText, className = '') {
    let element = document.createElement(tag);
    let content = document.createTextNode(contentText);
    if (className) {
        element.setAttribute('class', className);
    }
    element.appendChild(content);
    return element;
}
export function createElementWithElement(tag, contentElement, className = '') {
    let element = document.createElement(tag);
    if (className) {
        element.setAttribute('class', className);
    }
    element.append(contentElement);
    return element;
}

export function createTextInput(placeholder = '', value = '', className = '', disabled = false) {
    let input = document.createElement('input');
    input.setAttribute('placeholder', placeholder);
    input.setAttribute('type', 'text');
    if (value) {
        input.setAttribute('value', value);
    }
    if (className) {
        input.setAttribute('class', className);
    }
    if (disabled) {
        input.setAttribute('disabled', true);
    }
    return input;
}

export function removeClassName(element, className) {
    const originalClassName = element.getAttribute('class');
    let regex = new RegExp(`${className}`, 'g')
    element.setAttribute('class', originalClassName.replace(regex, "").trim());
}

export function addClassName(element, className) {
    const originalClassName = element.getAttribute('class');
    let arr = originalClassName.split(" ");
    if (arr.indexOf(className) === -1) {
        element.setAttribute('class', `${originalClassName} ${className}`);
    }
}
