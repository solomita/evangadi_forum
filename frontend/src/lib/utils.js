/**
 * Formats a date into a relative time string (e.g., "5 mins ago", "2 hrs ago")
 * @param {Date|string|number} dateInput - The date to format
 * @returns {string} Relative time string
 */
export function timeAgo(dateInput) {
  if (!dateInput) return "";

  const date = new Date(dateInput);

  // Check for invalid dates
  if (isNaN(date.getTime())) return "";

  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Handle future dates or extremely recent dates
  if (seconds < 0) return "just now";
  if (seconds < 60) return `${seconds} sec${seconds !== 1 ? "s" : ""} ago`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min${minutes !== 1 ? "s" : ""} ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr${hours !== 1 ? "s" : ""} ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} day${days !== 1 ? "s" : ""} ago`;

  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} week${weeks !== 1 ? "s" : ""} ago`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`;

  const years = Math.floor(days / 365);
  return `${years} year${years !== 1 ? "s" : ""} ago`;
}

/**
 * Whether a question was created by the signed-in user (IDs compared as strings).
 * @param {{ author?: { id?: string | number } } | null | undefined} question
 * @param {{ id?: string | number } | null | undefined} user
 * @returns {boolean}
 */
export function isAuthoredByUser(question, user) {
  if (!question || !user) return false;
  const authorId = question.author?.id;
  const userId = user.id;
  if (authorId == null || userId == null) return false;
  return String(authorId) === String(userId);
}

/**
 * Apply markdown formatting around the selected textarea text and update state.
 * @param {HTMLTextAreaElement | null} textarea
 * @param {string} value
 * @param {(newValue: string) => void} setValue
 * @param {'bold'|'italic'|'code'|'link'} type
 */
export function applyMarkdownFormat(textarea, value, setValue, type) {
  if (!textarea) return;

  try {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end);
    const before = value.substring(0, start);
    const after = value.substring(end);

    let formatted = "";
    let insertOffset = 0;

    if (!selected) {
      // No text selected - insert placeholder
      switch (type) {
        case "bold":
          formatted = "**bold text**";
          insertOffset = 2; // cursor after **
          break;
        case "italic":
          formatted = "*italic text*";
          insertOffset = 1; // cursor after *
          break;
        case "code":
          formatted = "`code`";
          insertOffset = 1; // cursor after `
          break;
        case "link":
          formatted = "[link text](url)";
          insertOffset = 1; // cursor after [
          break;
        default:
          return;
      }
    } else {
      // Text is selected - wrap it
      switch (type) {
        case "bold":
          formatted = `**${selected}**`;
          insertOffset = selected.length + 2;
          break;
        case "italic":
          formatted = `*${selected}*`;
          insertOffset = selected.length + 1;
          break;
        case "code":
          if (selected.includes("\n")) {
            formatted = `\`\`\`\n${selected}\n\`\`\``;
            insertOffset = selected.length + 8;
          } else {
            formatted = `\`${selected}\``;
            insertOffset = selected.length + 1;
          }
          break;
        case "link":
          formatted = `[${selected}](url)`;
          insertOffset = selected.length + 1;
          break;
        default:
          return;
      }
    }

    const newText = before + formatted + after;
    setValue(newText);

    // Move cursor to end of inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + insertOffset, start + insertOffset);
    }, 0);
  } catch (error) {
    console.error("Error applying markdown format:", error);
  }
}
