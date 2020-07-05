import React, { useEffect, useState } from 'react';
import { TiImage } from 'react-icons/ti';
import { input_names } from 'constants/FormInputNames';

// 문제 설명 에디터
// 참고: http://spectrumdig.blogspot.com/2015/06/contenteditable-html-wyswyg.html
function ProblemExplainEditor() {
    const [range, setRange] = useState(null);

    useEffect(() => {
        const editor = document.querySelector('#problem-explain-editor');
        editor.addEventListener('blur', (e) => {
            saveRange();
        })
    })
    return (
        <div className="editor_container">
            <div className="pic_control text-right">
                <input type="file" id="file" accept="image/*" className="pic_input" multiple onChange={e => addPicture(e)}></input>
                <label htmlFor="file" className="pic_input_label">
                    <TiImage /> <span>사진 추가</span>
                </label>
            </div>
            <div id="problem-explain-editor" contentEditable="true" name={input_names.problem_explain}></div>
        </div>
    );

    function addPicture(event) {
        event.preventDefault();
        const files = event.target.files;
        /*
         fetch(서버 업로드) 후 url 생성 
         */
        const url = 'https://image.shutterstock.com/image-photo/bright-spring-view-cameo-island-260nw-1048185397.jpg';
        const editor = document.querySelector('#problem-explain-editor');
        if (files) {
            for (let i = 0; i < files.length; i++) {
                let img = document.createElement('img');
                img.setAttribute('src', url);
                img.setAttribute('class', 'attached_pic');
                editor.focus();
                // editor 태그에 focus가 잡힐 때까지 기다리기 위해 이벤트큐에 이 코드 push
                setTimeout(() => {
                    loadRange();
                    if (window.getSelection) {
                        let sel = window.getSelection();
                        if (sel.getRangeAt && sel.rangeCount) {
                            let range = sel.getRangeAt(0);
                            range.insertNode(img);
                            window.getSelection().removeAllRanges();
                        }
                    }
                }, 0)
            }
        }
        event.target.value = '';
    }

    // editor에서 포커스가 나가면 커서 위치 저장
    function saveRange() {
        let rangeCount = window.getSelection().rangeCount;
        if (rangeCount > 0) {
            setRange(window.getSelection().getRangeAt(window.getSelection().rangeCount - 1));
        } else {
            setRange(null);
        }
    }

    // 이미지가 추가될 경우 커서 위치 다시 불러옴
    function loadRange() {
        if (!range) return;
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }
}


export default ProblemExplainEditor;