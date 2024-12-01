const assignmentQuestions = {
    1: {
      title: 'Simple Writing Prompt',
      questions: [
        {
          id: 'q1',
          text: 'Q1: Describe your favorite holiday or vacation experience. Where did you go? What did you do? Why was it memorable?',
          optional: false,
        },
        {
          id: 'q2',
          text: 'Q2 (optional for variety): If you could have any superpower, what would it be and why?',
          optional: true,
        },
      ],
      purpose: 'Simple and engaging topic that requires minimal cognitive effort but ensures enough typing to capture metrics like typing speed and pauses.',
    },
    2: {
      title: 'Reasoning and Reflection',
      questions: [
        {
          id: 'q1',
          text: 'Q1: Imagine you’re a city planner. What would you change in your city to make it more sustainable and environmentally friendly? Why?',
          optional: false,
        },
        {
          id: 'q2',
          text: 'Q2 (optional for variety): Reflect on a time when you faced a difficult decision. What was the decision, and how did you resolve it?',
          optional: true,
        },
      ],
      purpose: 'Prompts require light reasoning and reflection, which could lead to pauses, error corrections, or deviations for students who find these topics more challenging to articulate.',
    },
    3: {
      title: 'Technical Writing and Problem Solving',
      questions: [
        {
          id: 'q1',
          text: 'Q1: Explain the difference between a stack and a queue, including real-world examples of where each is used.',
          optional: false,
        },
        {
          id: 'q2',
          text: 'Q2 (optional for variety): Describe the steps of a sorting algorithm you know (e.g., Bubble Sort, Merge Sort) in detail and explain why sorting is important in computer science.',
          optional: true,
        },
      ],
      purpose: 'These questions involve both technical knowledge and the ability to articulate concepts clearly, which could trigger behaviors like pauses, tab switches (to look up information), or increased error rates.',
    },
  };

  export default assignmentQuestions;