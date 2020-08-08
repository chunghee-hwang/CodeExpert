import React, { useState, useCallback } from 'react';
import { TiImage } from 'react-icons/ti';
import { inputNames } from 'constants/FormInputNames';
import LoadingScreen from './LoadingScreen';
import { showErrorAlert } from 'utils/AlertManager';

// 문제 설명 에디터
// 참고: http://spectrumdig.blogspot.com/2015/06/contenteditable-html-wyswyg.html
function ProblemExplainEditor(props) {
    const [range, setRange] = useState(null);
    const { isProgressing } = props;

    // 이미지가 추가될 경우 커서 위치 다시 불러옴
    const loadRange = useCallback(() => {
        if (!range) return;
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }, [range]);

    const addImage = useCallback(file => {
        const editor = document.querySelector('#problem-explain-editor');
        let img;
        let span = document.createElement('span');

        img = document.createElement('img');
        img.setAttribute('class', 'attached-pic');
        // FileReader support
        if (FileReader && file) {
            var fr = new FileReader();
            fr.onload = function () {
                img.src = fr.result;
            }
            fr.readAsDataURL(file);
        }
        // Not supported
        else {
            showErrorAlert({ errorWhat: "브라우저 호환" });
            throw new Error("The file Reader is not supported.");
        }

        span.append(img);
        span.appendChild(document.createTextNode('\n'))
        editor.focus();
        // editor 태그에 focus가 잡힐 때까지 기다리기 위해 이벤트큐에 이 코드 push
        setTimeout(() => {
            loadRange();
            if (window.getSelection) {
                let sel = window.getSelection();
                if (sel.getRangeAt && sel.rangeCount) {
                    let range = sel.getRangeAt(0);
                    range.insertNode(span);
                    window.getSelection().removeAllRanges();
                }
            }
        }, 10);

    }, [loadRange]);
    return (
        <div className="editorContainer">
            <div className="picControl text-right">
                {isProgressing ?
                    <>
                        <LoadingScreen label="업로드 또는 데이터 준비 중입니다" />
                    </>
                    :
                    <>
                        <input type="file" id="file" accept="image/*" className="pic-input" multiple onChange={e => uploadPictures(e)}></input>
                        <label htmlFor="file" className="pic-input-label">
                            <TiImage /> <span>사진 추가</span>
                        </label>
                    </>
                }
            </div>
            <div id="problem-explain-editor" onBlur={e => saveRange()} contentEditable="true" name={inputNames.problemExplain} dangerouslySetInnerHTML={props.content ? { __html: props.content } : { __html: '' }}></div>
        </div>
    );

    function uploadPictures(event) {
        event.preventDefault();
        const files = event.target.files;
        //- request upload image file using problemId
        /*
         로컬 이미지 URL 생성
         */
        if(files) {
            Array.from(files).forEach(file => addImage(file));
            event.target.value='';
        }
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
}


export default ProblemExplainEditor;