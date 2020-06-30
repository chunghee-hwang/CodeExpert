import React from 'react';
import Split from 'react-split'
import CodeSection from './CodeSection';
import AnswerSection from './AnswerSection';

function ProblemSolutionSection(props) {



    return (

        <Split className="problem-solution-section"
            sizes={[50, 50]}
            minSize={0}
            expandToMin={true}
            gutterSize={10}
            gutterAlign="center"
            snapOffset={30}
            dragInterval={1}
            direction="vertical"
            cursor="row-resize"
        >
            <CodeSection test={props.test} />
            <AnswerSection />
        </Split>

    );
}
export default ProblemSolutionSection;