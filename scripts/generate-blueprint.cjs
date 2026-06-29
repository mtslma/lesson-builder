const fs = require("fs");
const path = require("path");

const [, , inputJson, outputMarkdown] = process.argv;

if (!inputJson || !outputMarkdown) {
  console.error("Usage: node scripts/generate-blueprint.cjs <inputJson> <outputMarkdown>");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(inputJson, "utf8"));
const lines = [];

function addLine(text = "") {
  lines.push(text);
}

function addSectionTitle(title) {
  addLine(`## ${title}`);
  addLine();
}

function addBlockTitle(type, title = "") {
  if (title && String(title).trim()) addLine(`**[Block: ${type}]** ${title}`);
  else addLine(`**[Block: ${type}]**`);
}

function addKeyValue(key, value) {
  if (value === undefined || value === null) return;
  const text = String(value).trim();
  if (!text) return;
  addLine(`${key}: ${text}`);
}

function addTable(headers, rows) {
  if (!headers || !headers.length) return;
  addLine(`| ${headers.join(" | ")} |`);
  addLine(`| ${headers.map(() => "---").join(" | ")} |`);
  for (const row of rows) {
    addLine(`| ${row.map((cell) => String(cell ?? "")).join(" | ")} |`);
  }
}

function renderHeading(block) {
  addBlockTitle(`Heading - ${block.level}`);
  addLine(block.content || "");
}

function renderParagraph(block) {
  addBlockTitle("Paragraph");
  addKeyValue("Style", block.style);
  addLine(block.content || "");
}

function renderConversation(block) {
  addBlockTitle("Conversation", block.title);
  addKeyValue("Layout", block.layout);
  addKeyValue("Instruction", block.instruction);
  addKeyValue("Image", block.imageUrl);
  addLine();
  for (const message of block.messages || []) {
    addLine(`- ${message.speaker}: ${message.text}`);
  }
  if (block.substitutionBox?.length) {
    addLine();
    addLine("Substitution ideas:");
    for (const entry of block.substitutionBox) {
      addLine(`- Original: ${entry.original}`);
      for (const alt of entry.alternatives || []) {
        addLine(`- Alternative: ${alt}`);
      }
    }
  }
}

function renderFlashcards(block) {
  addBlockTitle("Flashcards", block.title);
  addLine();
  for (const card of block.cards || []) {
    const expressions = (card.expressions || []).filter(Boolean).join(" / ");
    if (expressions) addLine(`- Expressions: ${expressions}`);
    addKeyValue("  Meaning", card.shortMeaning);
    addKeyValue("  Back text", card.backText);
    addKeyValue("  Example", card.exampleSentence);
    addKeyValue("  Translation", card.translation);
  }
}

function renderRoleplay(block) {
  addBlockTitle("Roleplay", block.title);
  addKeyValue("Objective", block.objective);
  addKeyValue("Scenario", block.scenario);
  addKeyValue("Student A Card", block.studentACard);
  addKeyValue("Student B Card", block.studentBCard);
  addKeyValue("Tips", block.tips);
  if (block.customFields?.length) {
    addLine();
    addLine("Custom fields:");
    for (const field of block.customFields) {
      addLine(`- ${field.label}: ${field.value}`);
    }
  }
  if (block.characters?.length) {
    addLine();
    addLine("Characters:");
    for (const character of block.characters) {
      addLine(`- ${character.name}`);
      for (const detail of character.details || []) {
        addLine(`- ${detail.label}: ${detail.value}`);
      }
    }
  }
}

function renderFillBlank(block) {
  addBlockTitle("Fill-blank", block.title);
  addKeyValue("Instruction", block.instruction);
  addKeyValue("Mode", block.mode);
  addLine();
  addLine(block.text || "");
}

function renderLetterNumber(block) {
  addBlockTitle("Letter-Number", block.title);
  addKeyValue("Instruction", block.instruction);
  addKeyValue("Variant", block.variant);
  addLine();
  for (const item of block.items || []) {
    addLine(`- ${item.symbol}: ${item.label}`);
  }
}

function renderConversationPrompts(block) {
  addBlockTitle("Conversation-prompts", block.title);
  addKeyValue("Instruction", block.instruction);
  addLine();
  for (const prompt of block.prompts || []) {
    addLine(`- ${prompt}`);
  }
  const speakers = new Map((block.speakers || []).map((s) => [s.id, s.name]));
  for (const exchange of block.exchanges || []) {
    const speaker = speakers.get(exchange.speakerId);
    addLine(speaker ? `- ${speaker}: ${exchange.text}` : `- ${exchange.text}`);
  }
}

function renderAdvancedGrammar(block) {
  addBlockTitle("Advanced Grammar", block.title);
  addKeyValue("Explanation", block.explanation);
  addKeyValue("Details", block.details);
  if (block.tableHeaders?.length && block.tableRows?.length) {
    addLine();
    addTable(
      block.tableHeaders,
      block.tableRows.map((row) => (row.cells || []).map((cell) => cell.text || ""))
    );
  }
  if (block.examples?.length) {
    addLine();
    addLine("Examples:");
    for (const item of block.examples) addLine(`- ${item}`);
  }
  if (block.commonMistakes?.length) {
    addLine();
    addLine("Common mistakes:");
    for (const item of block.commonMistakes) addLine(`- ${item}`);
  }
  if (block.miniPractice?.length) {
    addLine();
    addLine("Mini practice:");
    for (const item of block.miniPractice) addLine(`- ${item}`);
  }
}

function renderTableCompletion(block) {
  addBlockTitle("Table-completion", block.title);
  addKeyValue("Instruction", block.instruction);
  addLine();
  addTable(block.headers || [], (block.rows || []).map((row) => row.cells || []));
}

function renderQuestionSet(block) {
  addBlockTitle("Question-set", block.title);
  addKeyValue("Instruction", block.instruction);
  addKeyValue("Practice mode", block.practiceMode);
  addLine();
  let index = 1;
  for (const question of block.questions || []) {
    addLine(`${index}. [${question.type}] ${question.question}`);
    for (const option of question.options || []) {
      addLine(`- ${option.text}`);
    }
    index += 1;
  }
}

function renderListening(block) {
  addBlockTitle("Listening", block.title);
  addKeyValue("Instruction", block.instruction);
  addKeyValue("AudioUrl", block.audioUrl);
  addKeyValue("TranscriptVisibility", block.transcriptVisibility);
  addKeyValue("Context image", block.contextImageUrl);
  if (block.script?.length) {
    addLine();
    addLine("Script:");
    for (const part of block.script) {
      addLine(`- ${part.speaker}: ${part.text}`);
    }
  }
  if (block.questions?.length) {
    addLine();
    addLine("Questions:");
    let index = 1;
    for (const question of block.questions) {
      addLine(`${index}. [${question.type}] ${question.question}`);
      for (const option of question.options || []) {
        addLine(`- ${option.text}`);
      }
      index += 1;
    }
  }
}

function renderWritingTask(block) {
  addBlockTitle("Writing-task", block.title);
  addKeyValue("Prompt", block.prompt);
  addKeyValue("Minimum words", block.minWords);
}

function renderGeneric(block) {
  addBlockTitle(block.type, block.title);
  for (const [key, value] of Object.entries(block)) {
    if (["id", "type", "title", "audience", "pageNumber", "estimatedTime"].includes(key)) continue;
    if (value === undefined || value === null) continue;
    if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
      addKeyValue(key, value);
    } else {
      addKeyValue(key, JSON.stringify(value));
    }
  }
}

const renderers = {
  heading: renderHeading,
  paragraph: renderParagraph,
  conversation: renderConversation,
  flashcards: renderFlashcards,
  roleplay: renderRoleplay,
  "fill-blank": renderFillBlank,
  "letter-number": renderLetterNumber,
  "conversation-prompts": renderConversationPrompts,
  "advanced-grammar": renderAdvancedGrammar,
  "table-completion": renderTableCompletion,
  "question-set": renderQuestionSet,
  listening: renderListening,
  "writing-task": renderWritingTask,
};

addLine(`# ${data.title}`);
addLine();
addLine(`Level: ${data.level} | Language: ${data.language}`);
addLine();
addSectionTitle("Global Scope");
addLine("This blueprint is a full text conversion of the source JSON. Keep the student-facing content in English and preserve the lesson flow, examples, and activities below.");
addLine();

const pages = [];
let currentPage = null;

for (const block of data.blocks || []) {
  if (block.type === "page-break") {
    currentPage = { number: block.pageNumber, estimatedTime: block.estimatedTime, blocks: [] };
    pages.push(currentPage);
    continue;
  }
  if (!currentPage) {
    currentPage = { number: 1, estimatedTime: "", blocks: [] };
    pages.push(currentPage);
  }
  currentPage.blocks.push(block);
}

for (const page of pages) {
  addLine("---");
  addLine();
  addSectionTitle(`Page ${page.number}`);
  addKeyValue("Estimated time", page.estimatedTime);
  addLine();
  for (const block of page.blocks) {
    const renderer = renderers[block.type] || renderGeneric;
    renderer(block);
    addLine();
  }
}

fs.mkdirSync(path.dirname(outputMarkdown), { recursive: true });
fs.writeFileSync(outputMarkdown, lines.join("\n"), "utf8");
