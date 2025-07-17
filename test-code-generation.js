// Test script for the CodeGenerator functionality
// This demonstrates how the code generation works with sample data

import { CodeGenerator } from './src/services/code-generator.js';

// Sample JSON tree structure (similar to what would come from Penpot export)
const sampleJsonTree = [
  {
    tag: "div",
    elementName: "hero-section",
    attributes: { 
      className: "hero-section",
      id: "hero"
    },
    styles: {
      width: "1440px",
      backgroundColor: "#F8F9FA",
      padding: "32px",
      borderRadius: "8px"
    },
    layout: {
      display: "flex",
      flexDirection: "column",
      gap: "32px",
      justifyContent: "center",
      alignItems: "center"
    },
    content: "",
    children: [
      {
        tag: "h1",
        elementName: "main-heading",
        attributes: { 
          className: "main-heading"
        },
        styles: {
          fontSize: "48px",
          fontWeight: "700",
          color: "#1A202C",
          textAlign: "center",
          marginBottom: "16px"
        },
        content: "Welcome to Our Platform",
        children: []
      },
      {
        tag: "p",
        elementName: "hero-description",
        attributes: { 
          className: "hero-description"
        },
        styles: {
          fontSize: "18px",
          color: "#4A5568",
          textAlign: "center",
          maxWidth: "600px",
          lineHeight: "1.6"
        },
        content: "Build amazing experiences with our powerful design tools and seamless workflow.",
        children: []
      },
      {
        tag: "div",
        elementName: "cta-buttons",
        attributes: { 
          className: "cta-buttons"
        },
        styles: {
          marginTop: "32px"
        },
        layout: {
          display: "flex",
          gap: "16px",
          justifyContent: "center"
        },
        children: [
          {
            tag: "button",
            elementName: "primary-cta",
            attributes: { 
              className: "btn-primary",
              type: "button"
            },
            styles: {
              backgroundColor: "#3182CE",
              color: "white",
              padding: "12px 24px",
              borderRadius: "6px",
              border: "none",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer"
            },
            content: "Get Started",
            children: []
          },
          {
            tag: "button",
            elementName: "secondary-cta",
            attributes: { 
              className: "btn-secondary",
              type: "button"
            },
            styles: {
              backgroundColor: "transparent",
              color: "#3182CE",
              padding: "12px 24px",
              borderRadius: "6px",
              border: "2px solid #3182CE",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer"
            },
            content: "Learn More",
            children: []
          }
        ]
      }
    ]
  }
];

// Test the code generation
console.log("=== Testing CodeGenerator ===\n");

const codeGenerator = new CodeGenerator();

// Generate HTML
console.log("Generated HTML:");
console.log("==============");
const htmlCode = codeGenerator.generateHtml(sampleJsonTree);
console.log(htmlCode);

console.log("\n\nGenerated CSS:");
console.log("==============");
const cssCode = codeGenerator.generateCss(sampleJsonTree);
console.log(cssCode);

console.log("\n=== Test Complete ===");