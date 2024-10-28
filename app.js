import React from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

const ChemistryQuestion = () => {
  const questionText = `
<START_OF_QUESTION>Phosphorus reacts with hydrogen to produce phosphine, PH3. <br />
[[2\\text{P} + 3\\text{H}_2 \\rightarrow 2\\text{PH}_3]]<br />
The reaction is endothermic.
<START_OF_PART>(a) Complete the energy profile diagram for this reaction. <br />
Label reactants, products and ∆H.
<INSERT_DIAGRAM> [2]<END_OF_PART>
<START_OF_PART>(b) Explain, in terms of bond breaking and bond forming, why the reaction is endothermic. [2]<END_OF_PART>
<START_OF_PART>(c) Phosphine reacts with oxygen to form phosphorus(V) oxide, \\text{P}_4\\text{O}_{10}, and water.<br />
Complete the equation for this reaction.<br />
[[...PH_3 + ...O_2 \\rightarrow \\text{P}_4\\text{O}_{10} + ...H_2\\text{O}]] [1]<END_OF_PART>
[Total: 5]<END_OF_QUESTION>
  `;

  const replaceTags = (text) => {
    // Replace <sup> and <br /> tags for rendering
    return text
      .replace(/<sup>(.*?)<\/sup>/g, (_, content) => `<span style="font-size: 0.75em; vertical-align: super;">${content}</span>`)
      .replace(/<br\s*\/?>/g, '<br />');
  };

  const parseQuestion = (text) => {
    // Replace tags for HTML and LaTeX rendering
    text = replaceTags(text);

    // Split text into parts and introduction
    const parts = text.split(/<START_OF_PART>|<END_OF_PART>|<START_OF_QUESTION>|<END_OF_QUESTION>/);
    const questionParts = parts.filter(part => part.trim() !== "");

    return questionParts.map((part, index) => {
      // Separate marks if present
      const [mainText, marks] = part.split(/\[(\d+)\]$/).map(p => p.trim());

      // Handle introduction text
      if (index === 0) {
        const introWithLatex = mainText.split(/(\[\[.*?\]\])/g).map((text, i) => {
          if (text.startsWith('[[') && text.endsWith(']]')) {
            const latexCode = text.slice(2, -2);
            return <InlineMath key={i}>{latexCode}</InlineMath>;
          } else if (text.includes('<INSERT_DIAGRAM>')) {
            return (
              <div key={i} style={{ border: '1px solid #ccc', padding: '1rem', margin: '1rem 0' }}>
                <em>Diagram Placeholder</em>
              </div>
            );
          }
          return <span key={i} dangerouslySetInnerHTML={{ __html: text }} />;
        });

        return <div key={index} style={{ marginBottom: '1rem' }}>{introWithLatex}</div>;
      }

      // Render each question part with input box for answers
      const lines = mainText.split('<br />').map(line => line.trim()).filter(line => line);

      return (
        <div key={index} style={{ marginBottom: "1rem" }}>
          {lines.map((line, i) => {
            const partsWithLatex = line.split(/(\[\[.*?\]\])/g);

            return (
              <p key={i} style={{ margin: 0 }}>
                {partsWithLatex.map((part, j) => {
                  if (part.startsWith('[[') && part.endsWith(']]')) {
                    const latexCode = part.slice(2, -2);
                    return <InlineMath key={j}>{latexCode}</InlineMath>;
                  }
                  return <span key={j} dangerouslySetInnerHTML={{ __html: part }} />;
                })}
              </p>
            );
          })}
          {marks && <div><strong>[{marks} marks]</strong></div>}
          {marks && !mainText.includes("Total:") && (
            <input type="text" placeholder="Your answer" style={{ marginTop: "0.5rem", width: "100%" }} />
          )}
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
