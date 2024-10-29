import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const ChemistryQuestion = () => {
  const questionText = `
  <START_OF_QUESTION>
  <START_OF_PART> (a) Any two from: <br />
  sodium conducts electricity / diamond does not conduct electricity [1] <br />
  sodium malleable / diamond brittle [1] <br />
  brittle [1] <br />
  sodium ductile / diamond not ductile [1] <br />
  sodium soft / diamond hard [1] <END_OF_PART>
  <START_OF_PART> (b) protons: 11 [1] <br />
  neutrons: 12 [1] <br />
  electrons: 10 [1]  <END_OF_PART>
  <START_OF_PART> (c) [[6\\text{Na} + \\text{N}_2 \\rightarrow 2\\text{Na}_3\\text{N}]] [1] <END_OF_PART>
  <START_OF_PART> (d)(i) equilibrium moves to the right / more product formed [1] <br />
  (increasing the temperature) pushes the reaction in the direction of absorbing energy / (increasing the temperature) pushes <br />
  the reaction in the direction of the endothermic reaction [1] <END_OF_PART>
  <START_OF_PART>(d)(ii) equilibrium moves to the right / more product formed [1] <br />
  more gas molecules on right than on left / more moles of gas on right than on left / when pressure decreased reaction <br />
  moves in direction of more gas molecules [1] <END_OF_PART>
  <END_OF_QUESTION>
  `;

  const replaceTags = (text) => {
    // Replace <sup> and <br /> tags for rendering
    return text
      .replace(/<sup>(.*?)<\/sup>/g, (_, content) => <span style="font-size: 0.75em; vertical-align: super;">${content}</span>)
      .replace(/<br\s*\/?>/g, '<br />');
  };

  const parseQuestion = (text) => {
    // Replace tags for introduction and part text
    text = replaceTags(text);

    // Split the question text by defined tags
    const parts = text.split(/<START_OF_PART>|<END_OF_PART>|<START_OF_QUESTION>|<END_OF_QUESTION>/);
    const questionParts = parts.filter(part => part.trim() !== "");

    return questionParts.map((part, index) => {
      // Separate marks if present
      const [mainText, marks] = part.split(/\[(\d+)\]$/).map(p => p.trim());

      // Check if part is total marks or introduction
      if (mainText.includes("Total:") || index === 0) {
        // Skip rendering input box for introduction or total marks
        return (
          <div key={index} style={{ marginBottom: "1rem" }}>
            {/* Render HTML tags like <br /> for introduction */}
            <p style={{ margin: 0 }} dangerouslySetInnerHTML={{ __html: mainText }} />
          </div>
        );
      }

      // Split lines by <br />
      const lines = mainText.split('<br />').map(line => line.trim()).filter(line => line);

      return (
        <div key={index} style={{ marginBottom: "1rem" }}>
          {lines.map((line, i) => {
            // Separate text and inline LaTeX with [[ ]]
            const partsWithLatex = line.split(/(\[\[.*?\]\])/g);

            return (
              <p key={i} style={{ margin: 0 }}>
                {partsWithLatex.map((part, j) => {
                  // Detect if part is LaTeX expression
                  if (part.startsWith('[[') && part.endsWith(']]')) {
                    const latexCode = part.slice(2, -2); // Remove surrounding brackets
                    return <InlineMath key={j}>{latexCode}</InlineMath>;
                  }
                  return <span key={j} dangerouslySetInnerHTML={{ __html: part }} />;
                })}
              </p>
            );
          })}
          {marks && <div><strong>[{marks} mark{marks > 1 ? 's' : ''}]</strong></div>} {/* Display marks uniformly */}
        </div>
      );
    });
  };

  return (
    <div style={{ padding: "1rem", fontFamily: "Arial, sans-serif" }}>
      {parseQuestion(questionText)}
    </div>
  );
};

export default ChemistryQuestion;
