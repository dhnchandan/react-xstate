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
    /** @xstate-layout N4IgpgJg5mDOIC5QDMyQEYEMDGBrAxNgDYD2sYA2gAwC6ioADmQJYAuzJAdvSAB6IAWAEwAaEAE9EARgDsADgB0AgJyq5QuQDYZQgQFYqegL5GxqDDlwKGAJxIBbBq3zmIWPAqgkSEanSQgTLBsHNwB-Ah6ApoKAMxCQspSyjIpcsmiEoixVEIKmnqaQlGxUpqaWnICJmZobpbWdo7Oru5WWL60PEEhXDwRUTHxicmp8hlikgi6Ugrq6VKxynqx2gKxxqYgrQ3IJDb2LnVtCgCuDBCYrJRdAT3sfeGIMlKzxfLxhUJUmlRyk4h0nEEsoqC8BNEhGUpDVtsddvtDm0-N0WA8wqAIr89HFohshBsBFI9MpNACEFJogo9Do5MpdD9lOlYjJYTsPHsDvhYKd0PY2Ci7mjQv1AUk5oUZEsDOt0jJyVIgUTysJ5jIZCpWVt2VZiGRIPgbHBWJgbKxBYxhY9MdkqFQ4nIosS9MVKno9Ar1flyppVRp1ZstpwfHAeDrUcF0aKEABaMlZWOaNnwjy2BxOCO9DF8QSvObrGQGJkEoSaZSemRzDRSKiqlYpTa1CwcxGZqNPBAa2ZymRUMrFASFqQKoE09K1jT1wvJ5tWVgAC0wnFw8CFkZFHdeUKUlLtv0SyghmSmisU6k0LJSPydhhn9Q8evIEDbG5tFKJSnKi3m62J8ZPURKASzoJMI2jqCYJhAA */
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
                    actions: assign({
                        feedback: '',
                    }),
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
            entry: assign({
                feedback: '',
            }),
            on: {
                restart: {
                    target: 'prompt',
                },
            },
        },
    },
    on: {
        close: '.closed',
    },
})