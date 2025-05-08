import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../components/ui/accordion';

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: 'What is this project about?',
      answer: 'This project is a virtual HR preparation tool built with React, TypeScript, and shadcn-ui. It helps users prepare for HR interviews by providing practice questions and feedback.'
    },
    {
      question: 'How do I start using the application?',
      answer: 'You can start by navigating to the Setup page, where you can configure your interview preferences and begin the practice session.'
    },
    {
      question: 'Can I customize the interview questions?',
      answer: 'Currently, the questions are predefined, but you can adjust the difficulty level and topics in the Setup page.'
    },
    {
      question: 'How are the results calculated?',
      answer: 'Results are calculated based on your responses during the interview. The system evaluates your answers and provides feedback on your performance.'
    },
    {
      question: 'Is there a way to save my progress?',
      answer: 'At the moment, progress is not saved automatically. You can manually note your progress or take screenshots of your results.'
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Frequently Asked Questions</h1>
      <Accordion type="single" collapsible>
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FAQ; 