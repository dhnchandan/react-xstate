import {createBrowserInspector} from "@statelyai/inspect";
import {useMachine} from "@xstate/react";
import {feedbackMachine} from "../machines/feedbackMachine.ts";

const {inspect} = createBrowserInspector({
    autoStart: false,
})

function Feedback() {
    const [state, send] = useMachine(feedbackMachine, {inspect})

    if (state.matches('closed')) {
        return (<div>
            <h3>Feedback closed</h3>
            <div>
                <button onClick={() => send({type: 'restart'})}>Start new feedback</button>
            </div>
        </div>)
    }

    return (
        <div>
            <div>
                <button onClick={() => send({type: 'close'})}>Close feedback</button>
            </div>

            {state.matches('prompt') ? <div>
                <h4>What is your experience?</h4>
                <div>
                    <button onClick={() => send({type: 'feedback.good'})}>Good</button>
                    <button onClick={() => send({type: 'feedback.bad'})}>Bad</button>
                </div>
            </div> : null}

            {state.matches('thanks') ? <div>
                <p>Thanks for your feedback</p>
                {state.context.feedback.length ? <p>Feedback: {state.context.feedback}</p> : null}
            </div> : null}

            {state.matches('form') ? <div>
                <form onSubmit={(e) => {
                    e.preventDefault()
                    send({type: 'submit'})
                }}>
                    <textarea rows={4} onChange={(e) => send({type: 'feedback.update', value: e.target.value})}/>
                    <button type='submit' disabled={!state.can({type: 'submit'})}>Submit</button>
                </form>

                <div>
                    <button onClick={() => send({type: 'back'})}>Cancel Feedback</button>
                </div>
            </div> : null}
        </div>
    )
}

export default Feedback