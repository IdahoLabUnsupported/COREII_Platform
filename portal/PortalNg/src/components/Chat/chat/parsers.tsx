import React from "react";

interface InlineXMLProps {
  content: string;
}

export function InlineXML({ content }: InlineXMLProps) {
  if (!content || typeof content !== 'string') {
    return <>{content}</>;
  }

  const parseNode = (node: Node, key: string | number): React.ReactNode => {
    // Handle text nodes
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent;
    }

    // Handle element nodes
    if (node.nodeType === Node.ELEMENT_NODE) {
      const elem = node as Element;
      const tagName = elem.tagName.toLowerCase();

      // Recursively process all children
      const children: React.ReactNode[] = [];
      elem.childNodes.forEach((child, index) => {
        const parsed = parseNode(child, `${key}-${index}`);
        if (parsed) children.push(parsed);
      });

      // Return appropriate element
      switch (tagName) {
        case 'sub':
          return <sub key={key}>{children}</sub>;
        case 'sup':
          return <sup key={key}>{children}</sup>;
        case 'i':
        case 'em':
          return <em key={key}>{children}</em>;
        case 'b':
        case 'strong':
          return <strong key={key}>{children}</strong>;
        default:
          // Just return children without wrapper
          return children;
      }
    }

    return null;
  };

  try {
    const parser = new DOMParser();
    const wrappedContent = `<root>${content}</root>`;
    const xmlDoc = parser.parseFromString(wrappedContent, 'text/xml');

    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      console.error('Parse error:', parserError.textContent);
      return <>{content}</>;
    }

    const root = xmlDoc.documentElement;
    const result: React.ReactNode[] = [];

    root.childNodes.forEach((node, index) => {
      const parsed = parseNode(node, index);
      if (parsed) {
        if (Array.isArray(parsed)) {
          result.push(...parsed);
        } else {
          result.push(parsed);
        }
      }
    });

    return <>{result}</>;

  } catch (error) {
    console.error('InlineXML error:', error);
    return <>{content}</>;
  }
}


interface XMLContentProps {
  content: string;
}

export function XMLContent({ content }: XMLContentProps) {
  if (!content || typeof content !== 'string') {
    return null;
  }

  const parseInlineElements = (element: Element): React.ReactNode => {
    const result: React.ReactNode[] = [];

    const processNode = (node: Node, index: number): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const elem = node as Element;
        const tagName = elem.tagName.toLowerCase();
        const children: React.ReactNode[] = [];

        // Recursively process child nodes
        for (let i = 0; i < elem.childNodes.length; i++) {
          children.push(processNode(elem.childNodes[i], i));
        }

        // Return appropriate JSX element
        switch (tagName) {
          case 'br':
            return <br key={`br-${index}`} />;
          case 'strong':
          case 'b':
            return <strong key={`strong-${index}`}>{children}</strong>;
          case 'em':
          case 'i':
            return <em key={`em-${index}`}>{children}</em>;
          case 'sub':
            return <sub key={`sub-${index}`}>{children}</sub>;
          case 'sup':
            return <sup key={`sup-${index}`}>{children}</sup>;
          default:
            return <span key={`span-${index}`}>{children}</span>;
        }
      }

      return null;
    };

    // Process all child nodes
    for (let i = 0; i < element.childNodes.length; i++) {
      const processed = processNode(element.childNodes[i], i);
      if (processed !== null) {
        result.push(processed);
      }
    }

    return result;
  };

  try {
    const parser = new DOMParser();
    const wrappedContent = `<root>${content}</root>`;
    const xmlDoc = parser.parseFromString(wrappedContent, 'text/xml');

    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      console.error('XML parsing failed:', parserError.textContent);
      return <div className="text-xs whitespace-pre-wrap">{content}</div>;
    }

    const root = xmlDoc.documentElement;
    const sections = root.querySelectorAll('sec');

    // Case 1: Has <sec> sections (structured abstract)
    if (sections.length > 0) {
      return (
        <div>
          {Array.from(sections).map((section, sIndex) => {
            const title = section.querySelector('title');
            const paragraphs = section.querySelectorAll('p');

            return (
              <div key={sIndex} className="mb-4">
                {title && (
                  <h4 className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-200">
                    {title.textContent}
                  </h4>
                )}
                {Array.from(paragraphs).map((p, pIndex) => (
                  <p
                    key={pIndex}
                    className="text-xs mb-2 leading-relaxed text-gray-700 dark:text-gray-300"
                  >
                    {parseInlineElements(p)}
                  </p>
                ))}
              </div>
            );
          })}
        </div>
      );
    }

    // Case 2: Simple format with <title> and <p> tags
    const titles = root.querySelectorAll('title');
    const paragraphs = root.querySelectorAll('p');

    if (titles.length > 0 || paragraphs.length > 0) {
      return (
        <div>
          {Array.from(titles).map((title, tIndex) => (
            <h4
              key={`title-${tIndex}`}
              className="font-semibold text-sm mb-2 text-gray-800 dark:text-gray-200"
            >
              {title.textContent}
            </h4>
          ))}
          {Array.from(paragraphs).map((p, pIndex) => (
            <p
              key={`p-${pIndex}`}
              className="text-xs mb-2 leading-relaxed text-gray-700 dark:text-gray-300"
            >
              {parseInlineElements(p)}
            </p>
          ))}
        </div>
      );
    }

    // Case 3: Plain text with inline HTML elements (like <sub>, <sup>)
    const hasInlineElements = Array.from(root.childNodes).some(
      node => node.nodeType === Node.ELEMENT_NODE
    );

    if (hasInlineElements) {
      return (
        <div className="text-xs mb-2 leading-relaxed text-gray-700 dark:text-gray-300">
          {parseInlineElements(root)}
        </div>
      );
    }

    // Case 4: Pure plain text with no structure
    return <div className="text-xs whitespace-pre-wrap">{content}</div>;

  } catch (error) {
    console.error('Error parsing XML:', error);
    return <div className="text-xs whitespace-pre-wrap">{content}</div>;
  }
}