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

export function createTextInput(placeholder = '', value = '', disabled = false) {
    let input = document.createElement('input');
    input.setAttribute('placeholder', placeholder);
    input.setAttribute('type', 'text');
    input.setAttribute('value', value);
    if (disabled) {
        input.setAttribute('disabled', true);
    }
    return input;
}

export function removeClassName(element, className) {
    let regex = new RegExp(`${className}`, 'g')
    element.className = element.className.replace(regex, "").trim();
}

export function addClassName(element, className) {
    let arr = element.className.split(" ");
    if (arr.indexOf(className) === -1) {
        element.className += " " + className;
    }
}