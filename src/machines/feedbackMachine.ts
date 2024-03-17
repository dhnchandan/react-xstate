import {assign, setup} from 'xstate'

export interface FeedbackContext {
    feedback: string;
}

export type FeedbackEvents = { type: 'feedback.good' } | { type: 'feedback.bad' } | {
    type: 'feedback.update',
    value: string
} | { type: 'submit' } | { type: 'close' } | { type: 'back' } | { type: 'restart' }

export const feedbackMachine = setup({
    types: {
        context: {} as FeedbackContext,
        events: {} as FeedbackEvents,
    },
    guards: {
        feedbackValid: ({context}) => context.feedback.length > 0,
    },
}).createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QDMyQEYEMDGBrAxNgDYD2sYA2gAwC6ioADmQJYAuzJAdvSAB6IAWAEwAaEAE9EARgDsMgHQA2ZYoEyAHIoCsAThlUhQgL5GxqDDlzyGAJxIBbBq3zmIWPPKgkSEanSQgTLBsHNwB-AhaVOryWgI6UQDMBlKJyupikgjJUvLqhjpUVAKJcaXKJmZobpbWdo7Oru5WWL60PEEhXDwRUTFxCVTJQqnpmYgjOvJSVIoyuoUy2okalSBNtcgkNvYu1c3yAK4MEJislO0Bnezd4YhzWtNaM+ppiVJaWokZEojquYkClJhIoirIhDI1hsPFsdvhmn4OiwbmFQL18rEZEI9DIpOlEvFxgg8VNscI4kt1FjsVD9pttrtYId0PY2IirsjQj0-p95PMioCdGkqHIdESpP95AI8aoNNo9AZjKZ1nSPMQyJB8DY4KxMDZWOzGJzbmiJoohEopFIdP85AItIZNOK5EoVGpNLp9IYTMrOD44DxobgkcEUdyEABaRREqO0iweWwOJwhrqoviIFYCeQiobJXQCdT21TOhT5f7AoQCKg6aVDOM1GEMlNhu4IfSPXHVrE5z5fcWSrQaK3CKs1maJesHVgAC0wnFw8A5oa5rZej2SMne2g+ami-Zi+UUaQE9viiT0WkntXV5AgzZXpuJJWmgPU1YJb6oskSJbyQjfOiqEBOiyOoPpGEAA */
    id: 'feedback',
    context: {
        feedback: '',
    },
    initial: 'prompt',
    states: {
        prompt: {
            on: {
                'feedback.good': 'thanks',
                'feedback.bad': 'form',
            },
        },
        form: {
            on: {
                'feedback.update': {
                    actions: assign({
                        feedback: ({event}) => event.value,
                    }),
                },
                'back': {
                    target: 'prompt',
                },
                submit: {
                    guard: 'feedbackValid',
                    target: 'thanks',
                },
            },
        },
        thanks: {},
        closed: {
            on: {
                restart: 'prompt',
            },
        },
    },
    on: {
        close: '.closed',
    },
})