import React, { useEffect, useState, useCallback } from 'react';
import { TiImage } from 'react-icons/ti';
import { input_names } from 'constants/FormInputNames';
import LoadingScreen from './LoadingScreen';
import { showErrorAlert } from 'utils/AlertManager';

// 문제 설명 에디터
// 참고: http://spectrumdig.blogspot.com/2015/06/contenteditable-html-wyswyg.html
function ProblemExplainEditor(props) {
    const [range, setRange] = useState(null);
    const { problem_id, is_success, is_progressing, images, which, problem_actions } = props;

    // 이미지가 추가될 경우 커서 위치 다시 불러옴
    const loadRange = useCallback(() => {
        if (!range) return;
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
    }, [range]);

    const addImages = useCallback((images) => {
        const editor = document.querySelector('#problem-explain-editor');
        if (images) {
            let span = document.createElement('span');

            for (let i = 0; i < images.length; i++) {
                const url = images[i].url;
                let img = document.createElement('img');
                img.setAttribute('src', url);
                img.setAttribute('class', 'attached_pic');
                span.append(img);
                span.appendChild(document.createTextNode('  '))
            }

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
        }
    }, [loadRange]);
    useEffect(() => {
        // const editor = document.querySelector('#problem-explain-editor');
        // editor.addEventListener('blur', (e) => {
        //     saveRange();
        // });
        if (which === 'upload_problem_image') {
            if (!is_progressing) {
                if (is_success) {
                    if (images) {
                        addImages(images);
                        problem_actions.clearProblemImageCache();
                    }
                } else {
                    showErrorAlert({ error_what: '사진 업로드' });
                }
            }

        }
    }, [addImages, images, is_progressing, is_success, which, problem_actions]);
    return (
        <div className="editor_container">
            <div className="pic_control text-right">
                {is_progressing ?
                    <>
                        <LoadingScreen label="업로드 또는 데이터 준비 중입니다" />
                    </>
                    :
                    <>
                        <input type="file" id="file" accept="image/*" className="pic_input" multiple onChange={e => uploadPictures(e)}></input>
                        <label htmlFor="file" className="pic_input_label">
                            <TiImage /> <span>사진 추가</span>
                        </label>
                    </>
                }

            </div>
            <div id="problem-explain-editor" onBlur={e => saveRange()} contentEditable="true" name={input_names.problem_explain} dangerouslySetInnerHTML={props.content ? { __html: props.content } : { __html: '' }}></div>
        </div>
    );

    function uploadPictures(event) {
        event.preventDefault();
        const files = event.target.files;
        //- request upload image file using problem_id
        /*
         fetch(서버 업로드) 후 url 생성 
         */
        if (files) {
            problem_actions.uploadProblemImage({ problem_id, files });
            event.target.value = '';
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