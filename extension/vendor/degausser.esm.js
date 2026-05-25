function autoBind() {
  for (let prop of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
    if (prop === 'constructor' || typeof this[prop] !== 'function') continue
    this[prop] = this[prop].bind(this);
  }
}

// Char codes for \t, \n, and non-&nbsp; space character
const whitespaces = [9, 10, 13, 32];
const isCharWhitespace = (charCode) => {
  return whitespaces.includes(charCode)
};

const isCharNewLine = (charCode) => {
  return charCode === 10 || charCode === 13
};

const BreakType = {
  NONE: 'none',
  SINGLE: 'single',
  DOUBLE: 'double',
};

/**
 * Trim whitespace from the start of the string
 * @param string
 * @returns { string }
 */
const trimBeginOnly = (string) => {
  // Get the first non-whitespace character index
  let firstNonWhite = null;
  for (let index = 0; index < string.length; index++) {
      if (!isCharWhitespace(string.charCodeAt(index))) {
      firstNonWhite = index;
      break
      }
  }

  // If the first non-whitespace character is null, the string is entirely whitespace
  if (firstNonWhite === null) {
      return string
  }

  // Return the non-empty sections of the string
  return string.slice(firstNonWhite)
};

/**
 * Trim any new line characters from the end of the string
 * Also trim any whitespace that comes after that new line character, but not any that comes before.
 * @param string
 * @returns {*}
 */
const trimEndNewLine = (string) => {
  let lastNonNewLine = null;
  let foundNewLineCharacter = false;
  let foundNonWhiteSpaceCharacter = false;
  for (let index = string.length - 1; index >= 0; index--) {
    const charCode = string.charCodeAt(index);
    const isNewLine = isCharNewLine(charCode);
    if (isCharWhitespace(charCode)) {
      if (!isNewLine) {
        // okay to trim out any white space
        continue
      } else {
        foundNewLineCharacter = true;
      }
    } else {
      foundNonWhiteSpaceCharacter = true;
    }
    if (!isNewLine) {
      if (foundNewLineCharacter) {
        lastNonNewLine = index;
      }
      break
    }
  }

  if (!foundNonWhiteSpaceCharacter) {
    return null
  }
  // If both are null, the string is entirely whitespace
  if (lastNonNewLine === null) {
    return string
  }

  // Return the non-empty sections of the string
  return string.slice(
      0,
      lastNonNewLine ? lastNonNewLine + 1 : undefined,
  )
};

/**
 * Trims any whitespace at the start and trims any newline characters at the end of the string.
 * Trims any whitespace after newline characters at the end of the string, but not any that comes before.
 * @param string
 * @returns {*}
 */
const trimAllExceptEndWhiteSpace = (string) => {
  return trimEndNewLine(trimBeginOnly(string))
};

const trimBeginAndEnd = (string) => {
  // Get the first and last non-whitespace character index
  let firstNonWhite = null,
    lastNonWhite = null;
  for (let index = 0; index < string.length; index++) {
    if (!isCharWhitespace(string.charCodeAt(index))) {
      firstNonWhite = index;
      break
    }
  }
  for (let index = string.length - 1; index >= 0; index--) {
    if (!isCharWhitespace(string.charCodeAt(index))) {
      // if(index !== string.length - 1){
      // String slicing breaks if the last char is not whitespace
      lastNonWhite = index;
      // }
      break
    }
  }

  // If both are null, the string is entirely whitespace
  if (firstNonWhite === null || lastNonWhite === null) {
    return null
  }

  // Return the non-empty sections of the string
  return string.slice(
    firstNonWhite,
    lastNonWhite ? lastNonWhite + 1 : undefined,
  )
};

const collapseWhitespace = (string) => {
  // Collapse all other sequential whitespace into a single whitespace
  const textElements = [];
  let startOfNonWhite = null;
  for (let index = 0; index < string.length; index++) {
    if (
      startOfNonWhite === null &&
      !isCharWhitespace(string.charCodeAt(index))
    ) {
      startOfNonWhite = index;
      continue
    }
    if (
      startOfNonWhite !== null &&
      isCharWhitespace(string.charCodeAt(index))
    ) {
      textElements.push(string.slice(startOfNonWhite, index));
      startOfNonWhite = null;
      continue
    }
  }

  // At the end, add the rest of the string
  if (startOfNonWhite !== null) {
    textElements.push(string.slice(startOfNonWhite));
  }

  return textElements.join(' ')
};

const trimAndCollapseWhitespace = (string) => {
  return trimBeginAndEnd(collapseWhitespace(string))
};

const blacklist = [
  'base',
  'command',
  'link',
  'meta',
  'noscript',
  'script',
  'style',
  'title',
  // special cases
  // "html",
  'head',
];

const phrasingConstructs = [
  'a',
  'abbr',
  'audio',
  'b',
  'bdo',
  'br',
  'button',
  'canvas',
  'cite',
  'code',
  'command',
  'data',
  'datalist',
  'dfn',
  'em',
  'embed',
  'i',
  'iframe',
  'img',
  'input',
  'kbd',
  'keygen',
  'label',
  'mark',
  'math',
  'meter',
  'noscript',
  'object',
  'output',
  'progress',
  'q',
  'ruby',
  'samp',
  'script',
  'select',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'svg',
  'textarea',
  'time',
  'var',
  'video',
  'wbr',
  // special cases
  'map',
  'area',
];

// copied from readium-cfi-js library
// original function called "isElementBlacklisted"
const isElementBlacklisted = (
  element,
  classBlacklist,
  elementBlacklist,
  idBlacklist,
) => {
  if (classBlacklist && classBlacklist.length) {
    const classList = getClassNameArray(element);
    if (classList.length === 1 && classBlacklist.includes(classList[0])) {
      return true
    }
    if (classList.length && intersection(classBlacklist, classList).length) {
      return true
    }
  }

  if (elementBlacklist && elementBlacklist.length) {
    if (element.tagName) {
      const isElementInBlacklist = elementBlacklist.find((blacklistedTag) =>
        matchesLocalNameOrElement(element, blacklistedTag.toLowerCase()),
      );

      if (isElementInBlacklist) {
        return true
      }
    }
  }

  if (idBlacklist && idBlacklist.length) {
    const { id } = element;
    if (id && id.length && idBlacklist.includes(id)) {
      return true
    }
  }

  return false
};

const intersection = (array1, array2) => {
  const intersectionArray = [];
  for (let value of array1) {
    const index = array2.indexOf(value);
    if (index !== -1) {
      intersectionArray.push(value);
    }
  }

  return intersectionArray
};

const getClassNameArray = (element) => {
  const { className } = element;
  if (typeof className === 'string') {
    return className.split(/\s/)
  }
  if (typeof className === 'object' && 'baseVal' in className) {
    return className.baseVal.split(/\s/)
  }
  return []
};

const matchesLocalNameOrElement = (element, otherNameOrElement) => {
  if (typeof otherNameOrElement === 'string') {
    return (element.localName || element.nodeName) === otherNameOrElement
  }
  return element === otherNameOrElement
};

/**
 * Gets the alt text from an element, if it exists, otherwise returns placeholder alt text composed of 100 unit separator character.
 * If node has empty alt attribute or alt attribute with empty string, this will return the placeholder alt text instead.
 * @param node
 * @param placeholderCharacter
 * @param placeholderLength
 * @returns {string}
 */
const getAltText = (node, placeholderCharacter, placeholderLength) => {
  let altText = node.getAttribute('alt');
  if (altText) {
    altText = altText.trim();
  }

  if (!altText) {
    const altTextPlaceholder = placeholderCharacter.repeat(placeholderLength);
    return altTextPlaceholder
  }

  return altText
};

/**
 * Checks if element with given tagname can have an alt attribute.
 * @param tagName
 * @returns {boolean}
 */
const elementCanHaveAltText = (tagName) => {
  if (!tagName) {
    return false
  }

  const tagNameLowerCase = tagName.toLowerCase();
  const elementsWithAltText = ['area', 'img', 'input', 'canvas',];
  return elementsWithAltText.includes(tagNameLowerCase)
};

class StringCollector {
  constructor(options = {}) {
    this.runs = [];
    this.text = [];
    this.options = options;

    this.hasEncounteredFirstCell = false;
    this.lastBreak = null;

    autoBind.call(this);
  }

  addBreak(double) {
    if (this.lastBreak === null) {
      // The only time it should be null is at the beginning of document
      return
    }

    if (double) {
      this.lastBreak = BreakType.DOUBLE;
    } else if (this.lastBreak !== BreakType.DOUBLE) {
      this.lastBreak = BreakType.SINGLE;
    }
  }

  processBreaks() {
    if (!this.lastBreak) {
      return
    }

    switch (this.lastBreak) {
      case BreakType.SINGLE:
        this.runs.push('\n');
        break
      case BreakType.DOUBLE:
        let paragraphBreakAdded = false;
        // iterate through runs backwards:
        for (let i = this.runs.length - 1; i >= 0; i--) {
          const run = this.runs[i];
          if (run === '\n\n') {
            // found double break
            paragraphBreakAdded = true;
            break
          } else if (run !== '\n') {
            // found text content
            break
          }
        }
        if (!paragraphBreakAdded) {
          this.runs.push('\n\n');
        }
        break
    }

    this.lastBreak = BreakType.NONE;
  }

  processTextAndTrim(trimmingFunction) {
    if (this.text.length === 0) {
      return
    }

    // Trim
    const trimmed = trimmingFunction(this.text.join(''));
    if (!trimmed) {
      // Trimmed into an empty string
      // Preserve all preceding breaks
      this.text = [];
      return
    }

    if (this.lastBreak === null) {
      this.lastBreak = BreakType.NONE;
    }

    this.runs.push(trimmingFunction(trimmed));
    this.text = [];
  }

  processText(trimEndSpaces = true) {
    if (trimEndSpaces) {
      this.processTextAndTrim(trimAndCollapseWhitespace);
    } else {
      this.processTextAndTrim(trimAllExceptEndWhiteSpace);
    }
  }

  processElementNode(node, isOpening) {
    if (
      isElementBlacklisted(
        node,
        this.options.classBlacklist,
        this.options.elementBlacklist,
        this.options.idBlacklist,
      )
    ) {
      return true
    }

    const tag = node.tagName.toLowerCase();

    // Special case for Preformatted
    if (tag === 'pre') {
      this.processText();
      this.addBreak(false);
      this.processBreaks();

      this.runs.push(node.textContent);
      this.lastBreak = BreakType.SINGLE;

      return true
    }

    // Process other tags
    switch (tag) {
      case 'br':
        this.processText(false);
        this.processBreaks();
        this.runs.push('\n');

        return true
      case 'wbr':
        this.processBreaks();
        this.text.push('\u200B');

        return true
    }

    if (elementCanHaveAltText(node.tagName)) {
      this.processBreaks();

      const altText = getAltText(
        node,
        this.options.placeholderString,
        this.options.placeholderCopies
      );
      this.text.push(` ${altText} `);

      return true
    }
    if (node.tagName.toLowerCase() === 'svg' && isOpening) {
      const altText = getAltText(
        node,
        this.options.placeholderString,
        this.options.placeholderCopies
      );
      this.text.push(` ${altText} `);
    }

    this.processBlockConstruct(tag, isOpening);

    return false
  }

  processBlockConstruct(tag, isOpening) {
    if (phrasingConstructs.includes(tag)) {
      // Do not process phrasing tags as block constructs
      return
    }

    if (tag === 'th' || tag === 'td') {
      // Special Block
      if (isOpening) {
        // I'm assuming the DOM will fix all table element malformations

        if (!this.hasEncounteredFirstCell) {
          this.hasEncounteredFirstCell = true;
        } else {
          this.processBreaks();
          this.runs.push('\t');
        }
      } else {
        this.processText();
      }

      return
    }

    // Regular Block

    this.processText();

    if (tag === 'tr') {
      this.hasEncounteredFirstCell = false;
    }

    if (tag === 'p') {
      this.addBreak(true);
    }

    this.addBreak(false);
  }

  processTextNode(node) {
    const string = node.textContent.normalize();

    // Trim
    const trimmed = trimBeginAndEnd(string);
    if (trimmed) {
      this.processBreaks();
    }

    this.text.push(string);
  }

  getResult() {
    // Get Stragglers
    this.processText();

    return this.runs.join('')
  }
}

const MapType = {
  TEXT: 'Text',
  BREAK: 'Break',
};

class MapCollector {
  constructor(options = {}) {
    this.map = [];
    this.text = [];

    this.options = options;

    this.hasEncounteredFirstCell = false;
    this.lastBreak = null;

    autoBind.call(this);
  }

  addBreak(double) {
    if (this.lastBreak === null) {
      // The only time it should be null is at the beginning of document
      return
    }

    if (double) {
      this.lastBreak = BreakType.DOUBLE;
    } else if (this.lastBreak !== BreakType.DOUBLE) {
      this.lastBreak = BreakType.SINGLE;
    }
  }

  processBreaks() {
    if (!this.lastBreak) {
      return
    }

    switch (this.lastBreak) {
      case BreakType.SINGLE:
        this.map.push({
          type: MapType.BREAK,
          double: false,
        });
        break
      case BreakType.DOUBLE:
        let paragraphBreakAdded = false;
        // iterate through map backwards:
        for (let i = this.map.length - 1; i >= 0; --i) {
          const map = this.map[i];
          if (map.type === MapType.BREAK && map.double) {
            paragraphBreakAdded = true;
            break
          } else if (!this.isSingleBreak(map)) {
            break
          }
        }
        if (!paragraphBreakAdded) {
          this.map.push({
            type: MapType.BREAK,
            double: true,
          });
        }
        break
    }

    this.lastBreak = BreakType.NONE;
  }

  isSingleBreak(mapObject) {
    const isSingleBreak = mapObject.type === MapType.BREAK && !mapObject.double;
    const isNewLine = mapObject.type === MapType.TEXT && mapObject.content === '\n';
    return isSingleBreak || isNewLine
  }

  processTextAndTrim(trimmingFunction) {
    if (this.text.length === 0) {
      return
    }

    const joinedText = this.text.map((element) => element.string).join('');
    // TODO: might have to check for null string here
    const trimmed = trimmingFunction(joinedText);
    if (!trimmed) {
      // Trimmed into an empty string
      // Preserve all preceding breaks
      this.text = [];
      return
    }

    let fullText = trimmingFunction(trimmed);

    let blockMap = [];
    let currentIndexOfString = 0;

    for (const textMap of this.text) {
      const shrunkText = trimmingFunction(textMap.string);
      if (!shrunkText) {
        continue
      }

      const index = fullText.indexOf(shrunkText);

      if (index < 0) {
        throw new Error(
          `Could not find shrunk string \"${shrunkText}\" in \"${fullText}\"`,
        )
      }

      blockMap.push({
        type: MapType.TEXT,
        node: textMap.node,
        start: currentIndexOfString + index,
        length: shrunkText.length,
        content: shrunkText,
      });

      fullText = fullText.slice(index + shrunkText.length);
      currentIndexOfString += shrunkText.length + index;
    }

    // Do some more magic on block map
    for (let i = 1; i < blockMap.length; ++i) {
      if (
        blockMap[i].start - blockMap[i - 1].start !==
        blockMap[i - 1].length
      ) {
        blockMap[i - 1].length = blockMap[i].start - blockMap[i - 1].start;
      }
    }

    this.map.push(...blockMap);

    if (this.lastBreak === null) {
      this.lastBreak = BreakType.NONE;
    }

    this.text = [];
  }

  processText(trimEndSpaces = true) {
    if (trimEndSpaces) {
      this.processTextAndTrim(trimAndCollapseWhitespace);
    } else {
      this.processTextAndTrim(trimAllExceptEndWhiteSpace);
    }
  }

  processElementNode(node, isOpening) {
    if (
      isElementBlacklisted(
        node,
        this.options.classBlacklist,
        this.options.elementBlacklist,
        this.options.idBlacklist,
      )
    ) {
      return true
    }

    const tag = node.tagName.toLowerCase();

    // Special case for Preformatted
    if (tag === 'pre') {
      this.processText();
      this.addBreak(false);
      this.processBreaks();

      this.lastBreak = BreakType.SINGLE;

      this.map.push({
        type: MapType.TEXT,
        node,
        content: node.textContent,
        length: node.textContent.length,
      });

      return true
    }

    // Process other tags
    switch (tag) {
      case 'br':
        this.processText(false);
        this.processBreaks();

        this.map.push({
          type: MapType.TEXT,
          node,
          content: '\n',
          length: 1,
        });

        return true
      case 'wbr':
        this.processBreaks();
        this.text.push({ node, string: '\u200B' });

        return true
    }

    if (elementCanHaveAltText(node.tagName)) {
      this.processBreaks();

      const altText = getAltText(node, this.options.placeholderString, this.options.placeholderCopies);
      this.text.push({ node, string: ` ${altText} ` });

      return true
    }

    if (node.tagName.toLowerCase() === 'svg' && isOpening) {
      const altText = getAltText(
        node,
        this.options.placeholderString,
        this.options.placeholderCopies
      );
      this.text.push({ node, string: ` ${altText} ` });
    }

    this.processBlockConstruct(node, isOpening);

    return false
  }

  processBlockConstruct(node, isOpening) {
    const tag = node.tagName.toLowerCase();

    if (phrasingConstructs.includes(tag)) {
      // Do not process phrasing tags as block constructs
      return
    }

    if (tag === 'th' || tag === 'td') {
      // Special Block
      if (isOpening) {
        // I'm assuming the DOM will fix all table element malformations

        if (!this.hasEncounteredFirstCell) {
          this.hasEncounteredFirstCell = true;
        } else {
          this.processBreaks();
          this.map.push({
            type: MapType.TEXT,
            node,
            content: '\t',
            length: 1,
          });
        }
      } else {
        this.processText();
      }

      return
    }

    this.processText();

    if (tag === 'tr') {
      this.hasEncounteredFirstCell = false;
    }

    if (tag === 'p') {
      this.addBreak(true);
    }

    this.addBreak(false);
  }

  processTextNode(node) {
    const string = node.textContent.normalize();

    // Trim
    const trimmed = trimBeginAndEnd(string);
    if (trimmed) {
      this.processBreaks();
    }

    this.text.push({ node, string });
  }

  getResult() {
    const result = [];
    let runningIndex = 0;

    for (const entity of this.map) {
      switch (entity.type) {
        case MapType.TEXT:
          // TODO: Tests

          const whitespace = [];

          if (
            entity.node.nodeType === Node.TEXT_NODE ||
            entity.node.tagName === 'img'
          ) {
            let nodeContent;
            if (elementCanHaveAltText(entity.node.tagName)) {
              const altText = getAltText(
                entity.node,
                this.options.placeholderString,
                this.options.placeholderCopies
              ).normalize();
              nodeContent = altText;
            } else {
              nodeContent = '';
              if (entity.node.tagName === 'svg') {
                const altText = getAltText(
                  entity.node,
                  this.options.placeholderString,
                  this.options.placeholderCopies
                ).normalize();
                nodeContent = altText;
              }
              nodeContent += entity.node.textContent.normalize();
            }

            for (
              let charInMap = 0, charInNode = 0;
              charInNode < nodeContent.length;
              ++charInNode
            ) {
              const isEqual =
                entity.content.charAt(charInMap) ===
                nodeContent.charAt(charInNode);
              const isMapWhitespace = isCharWhitespace(
                entity.content.charCodeAt(charInMap),
              );
              const isNodeWhitespace = isCharWhitespace(
                nodeContent.charCodeAt(charInNode),
              );

              if (isEqual || (isMapWhitespace && isNodeWhitespace)) {
                ++charInMap;
              } else if (isMapWhitespace || isNodeWhitespace) {
                const skips = {
                  after: charInMap - 1,
                  position: charInNode,
                };
                whitespace.push(skips);
              } else {
                throw new Error(
                  `Degauss error, character mismatch and not a whitespace`,
                )
              }
            }
          }

          result.push({
            node: entity.node,
            content: entity.content,
            whitespace: whitespace,
            start: runningIndex,
            length: entity.length,
          });

          runningIndex += entity.length;

          break
        case MapType.BREAK:
          const lastResult = result[result.length - 1];

          if (entity.double) {
            lastResult.length += 2;
            runningIndex += 2;
          } else {
            lastResult.length += 1;
            runningIndex += 1;
          }

          break
      }
    }

    return result
  }
}

const walkDOM = (parentNode, collector) => {
  if (!parentNode) {
    return
  }

  processNode(parentNode, collector);

  return collector.getResult()
};

const processNode = (node, collector) => {
  switch (node.nodeType) {
    case Node.TEXT_NODE:
      collector.processTextNode(node);
      break
    case Node.ELEMENT_NODE:
      if (blacklist.includes(node.tagName.toLowerCase())) {
        return
      }
      processElementNode(node, collector);
      break
    case Node.DOCUMENT_NODE:
    case Node.DOCUMENT_FRAGMENT_NODE:
      if (node.hasChildNodes()) {
        node.childNodes.forEach((child) => {
          processNode(child, collector);
        });
      }
      break
  }
};

const processElementNode = (node, collector) => {
  const skipRest = collector.processElementNode(node, true);

  if (skipRest) {
    return
  }

  if (node.hasChildNodes()) {
    node.childNodes.forEach((child) => {
      processNode(child, collector);
    });
  }

  collector.processElementNode(node, false);
};

/**
 * Extracts text from the given node.
 * Options include (but are not limited to):
 * - placeholderString: string to take the place of alt text when alt it is empty/undefined
 * - placeholderCopies: the number of times placeholderString repeats
 * @param parentNode
 * @param options
 * @returns {*}
 */
const degausser = (parentNode, options = {}) => {
  const unitSeparatorCode = 31;
  const defaultOptions = {
    placeholderString: String.fromCharCode(unitSeparatorCode),
    placeholderCopies: 100,
  };
  const finalOptions = Object.assign(defaultOptions, options);

  let collector = new StringCollector(finalOptions);

  if (finalOptions.map) {
    collector = new MapCollector(finalOptions);
  }

  return walkDOM(parentNode, collector)
};

const getRangeFromOffset = (start, end, doc = document, map = null, options = {}) => {
  const docType = doc.nodeType;
  if (
    docType !== Node.DOCUMENT_NODE &&
    docType !== Node.DOCUMENT_FRAGMENT_NODE
  ) {
    throw new Error('Bad Document Node')
  }

  if (map === null) {
    const finalOptions = Object.assign({}, options);
    finalOptions.map = true;
    map = degausser(doc, finalOptions);
  }

  const range = doc.createRange();

  for (let mapIndex = 0; mapIndex < map.length; ++mapIndex) {
    const entry = map[mapIndex];

    if (start >= entry.start && start < entry.start + entry.length) {
      if (entry.node.nodeName === 'img') {
        range.setStartBefore(entry.node);
      } else {
        const adjustedStart = start - entry.start;

        let skips = 0;
        for (const whitespaceEntry of entry.whitespace) {
          if (whitespaceEntry.after < adjustedStart) {
            ++skips;
          }
        }

        if (adjustedStart + skips - entry.node.length === 1){
          // space between the end of the node and the start of the next
          range.setStartAfter(entry.node);
        } else {
          range.setStart(entry.node, adjustedStart + skips);
        }
      }
    }

    if (end >= entry.start && end < entry.start + entry.length) {
      if (entry.node.nodeName === 'img') {
        range.setEndAfter(entry.node);
      } else {
        const adjustedEnd = end - entry.start;

        let skips = 0;
        for (const whitespaceEntry of entry.whitespace) {
          if (whitespaceEntry.after < adjustedEnd) {
            ++skips;
          }
        }

        if (adjustedEnd + skips - entry.node.length === 1){
          // space between the end of the node and the start of the next
          range.setEndAfter(entry.node);
        } else {
          range.setEnd(entry.node, adjustedEnd + skips);
        }
      }
      break
    }
  }

  return range
};

export { degausser, getRangeFromOffset };
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVnYXVzc2VyLmVzbS5qcyIsInNvdXJjZXMiOlsiLi4vLi4vbm9kZV9tb2R1bGVzL2RlZ2F1c3Nlci9zcmMvdXRpbC5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kZWdhdXNzZXIvc3JjL3N0cmluZ0NvbGxlY3Rvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kZWdhdXNzZXIvc3JjL21hcENvbGxlY3Rvci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kZWdhdXNzZXIvc3JjL2RvbVdhbGtlci5qcyIsIi4uLy4uL25vZGVfbW9kdWxlcy9kZWdhdXNzZXIvc3JjL2RlZ2F1c3Nlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBhdXRvQmluZCgpIHtcbiAgZm9yIChsZXQgcHJvcCBvZiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcykpKSB7XG4gICAgaWYgKHByb3AgPT09ICdjb25zdHJ1Y3RvcicgfHwgdHlwZW9mIHRoaXNbcHJvcF0gIT09ICdmdW5jdGlvbicpIGNvbnRpbnVlXG4gICAgdGhpc1twcm9wXSA9IHRoaXNbcHJvcF0uYmluZCh0aGlzKVxuICB9XG59XG5cbi8vIENoYXIgY29kZXMgZm9yIFxcdCwgXFxuLCBhbmQgbm9uLSZuYnNwOyBzcGFjZSBjaGFyYWN0ZXJcbmNvbnN0IHdoaXRlc3BhY2VzID0gWzksIDEwLCAxMywgMzJdXG5jb25zdCBpc0NoYXJXaGl0ZXNwYWNlID0gKGNoYXJDb2RlKSA9PiB7XG4gIHJldHVybiB3aGl0ZXNwYWNlcy5pbmNsdWRlcyhjaGFyQ29kZSlcbn1cblxuY29uc3QgaXNDaGFyTmV3TGluZSA9IChjaGFyQ29kZSkgPT4ge1xuICByZXR1cm4gY2hhckNvZGUgPT09IDEwIHx8IGNoYXJDb2RlID09PSAxM1xufVxuXG5jb25zdCBCcmVha1R5cGUgPSB7XG4gIE5PTkU6ICdub25lJyxcbiAgU0lOR0xFOiAnc2luZ2xlJyxcbiAgRE9VQkxFOiAnZG91YmxlJyxcbn1cblxuLyoqXG4gKiBUcmltIHdoaXRlc3BhY2UgZnJvbSB0aGUgc3RhcnQgb2YgdGhlIHN0cmluZ1xuICogQHBhcmFtIHN0cmluZ1xuICogQHJldHVybnMgeyBzdHJpbmcgfVxuICovXG5jb25zdCB0cmltQmVnaW5Pbmx5ID0gKHN0cmluZykgPT4ge1xuICAvLyBHZXQgdGhlIGZpcnN0IG5vbi13aGl0ZXNwYWNlIGNoYXJhY3RlciBpbmRleFxuICBsZXQgZmlyc3ROb25XaGl0ZSA9IG51bGxcbiAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IHN0cmluZy5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGlmICghaXNDaGFyV2hpdGVzcGFjZShzdHJpbmcuY2hhckNvZGVBdChpbmRleCkpKSB7XG4gICAgICBmaXJzdE5vbldoaXRlID0gaW5kZXhcbiAgICAgIGJyZWFrXG4gICAgICB9XG4gIH1cblxuICAvLyBJZiB0aGUgZmlyc3Qgbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVyIGlzIG51bGwsIHRoZSBzdHJpbmcgaXMgZW50aXJlbHkgd2hpdGVzcGFjZVxuICBpZiAoZmlyc3ROb25XaGl0ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHN0cmluZ1xuICB9XG5cbiAgLy8gUmV0dXJuIHRoZSBub24tZW1wdHkgc2VjdGlvbnMgb2YgdGhlIHN0cmluZ1xuICByZXR1cm4gc3RyaW5nLnNsaWNlKGZpcnN0Tm9uV2hpdGUpXG59XG5cbi8qKlxuICogVHJpbSBhbnkgbmV3IGxpbmUgY2hhcmFjdGVycyBmcm9tIHRoZSBlbmQgb2YgdGhlIHN0cmluZ1xuICogQWxzbyB0cmltIGFueSB3aGl0ZXNwYWNlIHRoYXQgY29tZXMgYWZ0ZXIgdGhhdCBuZXcgbGluZSBjaGFyYWN0ZXIsIGJ1dCBub3QgYW55IHRoYXQgY29tZXMgYmVmb3JlLlxuICogQHBhcmFtIHN0cmluZ1xuICogQHJldHVybnMgeyp9XG4gKi9cbmNvbnN0IHRyaW1FbmROZXdMaW5lID0gKHN0cmluZykgPT4ge1xuICBsZXQgbGFzdE5vbk5ld0xpbmUgPSBudWxsXG4gIGxldCBmb3VuZE5ld0xpbmVDaGFyYWN0ZXIgPSBmYWxzZVxuICBsZXQgZm91bmROb25XaGl0ZVNwYWNlQ2hhcmFjdGVyID0gZmFsc2VcbiAgZm9yIChsZXQgaW5kZXggPSBzdHJpbmcubGVuZ3RoIC0gMTsgaW5kZXggPj0gMDsgaW5kZXgtLSkge1xuICAgIGNvbnN0IGNoYXJDb2RlID0gc3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpXG4gICAgY29uc3QgaXNOZXdMaW5lID0gaXNDaGFyTmV3TGluZShjaGFyQ29kZSlcbiAgICBpZiAoaXNDaGFyV2hpdGVzcGFjZShjaGFyQ29kZSkpIHtcbiAgICAgIGlmICghaXNOZXdMaW5lKSB7XG4gICAgICAgIC8vIG9rYXkgdG8gdHJpbSBvdXQgYW55IHdoaXRlIHNwYWNlXG4gICAgICAgIGNvbnRpbnVlXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmb3VuZE5ld0xpbmVDaGFyYWN0ZXIgPSB0cnVlXG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvdW5kTm9uV2hpdGVTcGFjZUNoYXJhY3RlciA9IHRydWVcbiAgICB9XG4gICAgaWYgKCFpc05ld0xpbmUpIHtcbiAgICAgIGlmIChmb3VuZE5ld0xpbmVDaGFyYWN0ZXIpIHtcbiAgICAgICAgbGFzdE5vbk5ld0xpbmUgPSBpbmRleFxuICAgICAgfVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICBpZiAoIWZvdW5kTm9uV2hpdGVTcGFjZUNoYXJhY3Rlcikge1xuICAgIHJldHVybiBudWxsXG4gIH1cbiAgLy8gSWYgYm90aCBhcmUgbnVsbCwgdGhlIHN0cmluZyBpcyBlbnRpcmVseSB3aGl0ZXNwYWNlXG4gIGlmIChsYXN0Tm9uTmV3TGluZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBzdHJpbmdcbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgbm9uLWVtcHR5IHNlY3Rpb25zIG9mIHRoZSBzdHJpbmdcbiAgcmV0dXJuIHN0cmluZy5zbGljZShcbiAgICAgIDAsXG4gICAgICBsYXN0Tm9uTmV3TGluZSA/IGxhc3ROb25OZXdMaW5lICsgMSA6IHVuZGVmaW5lZCxcbiAgKVxufVxuXG4vKipcbiAqIFRyaW1zIGFueSB3aGl0ZXNwYWNlIGF0IHRoZSBzdGFydCBhbmQgdHJpbXMgYW55IG5ld2xpbmUgY2hhcmFjdGVycyBhdCB0aGUgZW5kIG9mIHRoZSBzdHJpbmcuXG4gKiBUcmltcyBhbnkgd2hpdGVzcGFjZSBhZnRlciBuZXdsaW5lIGNoYXJhY3RlcnMgYXQgdGhlIGVuZCBvZiB0aGUgc3RyaW5nLCBidXQgbm90IGFueSB0aGF0IGNvbWVzIGJlZm9yZS5cbiAqIEBwYXJhbSBzdHJpbmdcbiAqIEByZXR1cm5zIHsqfVxuICovXG5jb25zdCB0cmltQWxsRXhjZXB0RW5kV2hpdGVTcGFjZSA9IChzdHJpbmcpID0+IHtcbiAgcmV0dXJuIHRyaW1FbmROZXdMaW5lKHRyaW1CZWdpbk9ubHkoc3RyaW5nKSlcbn1cblxuY29uc3QgdHJpbUJlZ2luQW5kRW5kID0gKHN0cmluZykgPT4ge1xuICAvLyBHZXQgdGhlIGZpcnN0IGFuZCBsYXN0IG5vbi13aGl0ZXNwYWNlIGNoYXJhY3RlciBpbmRleFxuICBsZXQgZmlyc3ROb25XaGl0ZSA9IG51bGwsXG4gICAgbGFzdE5vbldoaXRlID0gbnVsbFxuICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgc3RyaW5nLmxlbmd0aDsgaW5kZXgrKykge1xuICAgIGlmICghaXNDaGFyV2hpdGVzcGFjZShzdHJpbmcuY2hhckNvZGVBdChpbmRleCkpKSB7XG4gICAgICBmaXJzdE5vbldoaXRlID0gaW5kZXhcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIGZvciAobGV0IGluZGV4ID0gc3RyaW5nLmxlbmd0aCAtIDE7IGluZGV4ID49IDA7IGluZGV4LS0pIHtcbiAgICBpZiAoIWlzQ2hhcldoaXRlc3BhY2Uoc3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpKSkge1xuICAgICAgLy8gaWYoaW5kZXggIT09IHN0cmluZy5sZW5ndGggLSAxKXtcbiAgICAgIC8vIFN0cmluZyBzbGljaW5nIGJyZWFrcyBpZiB0aGUgbGFzdCBjaGFyIGlzIG5vdCB3aGl0ZXNwYWNlXG4gICAgICBsYXN0Tm9uV2hpdGUgPSBpbmRleFxuICAgICAgLy8gfVxuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cblxuICAvLyBJZiBib3RoIGFyZSBudWxsLCB0aGUgc3RyaW5nIGlzIGVudGlyZWx5IHdoaXRlc3BhY2VcbiAgaWYgKGZpcnN0Tm9uV2hpdGUgPT09IG51bGwgfHwgbGFzdE5vbldoaXRlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxuXG4gIC8vIFJldHVybiB0aGUgbm9uLWVtcHR5IHNlY3Rpb25zIG9mIHRoZSBzdHJpbmdcbiAgcmV0dXJuIHN0cmluZy5zbGljZShcbiAgICBmaXJzdE5vbldoaXRlLFxuICAgIGxhc3ROb25XaGl0ZSA/IGxhc3ROb25XaGl0ZSArIDEgOiB1bmRlZmluZWQsXG4gIClcbn1cblxuY29uc3QgY29sbGFwc2VXaGl0ZXNwYWNlID0gKHN0cmluZykgPT4ge1xuICAvLyBDb2xsYXBzZSBhbGwgb3RoZXIgc2VxdWVudGlhbCB3aGl0ZXNwYWNlIGludG8gYSBzaW5nbGUgd2hpdGVzcGFjZVxuICBjb25zdCB0ZXh0RWxlbWVudHMgPSBbXVxuICBsZXQgc3RhcnRPZk5vbldoaXRlID0gbnVsbFxuICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgc3RyaW5nLmxlbmd0aDsgaW5kZXgrKykge1xuICAgIGlmIChcbiAgICAgIHN0YXJ0T2ZOb25XaGl0ZSA9PT0gbnVsbCAmJlxuICAgICAgIWlzQ2hhcldoaXRlc3BhY2Uoc3RyaW5nLmNoYXJDb2RlQXQoaW5kZXgpKVxuICAgICkge1xuICAgICAgc3RhcnRPZk5vbldoaXRlID0gaW5kZXhcbiAgICAgIGNvbnRpbnVlXG4gICAgfVxuICAgIGlmIChcbiAgICAgIHN0YXJ0T2ZOb25XaGl0ZSAhPT0gbnVsbCAmJlxuICAgICAgaXNDaGFyV2hpdGVzcGFjZShzdHJpbmcuY2hhckNvZGVBdChpbmRleCkpXG4gICAgKSB7XG4gICAgICB0ZXh0RWxlbWVudHMucHVzaChzdHJpbmcuc2xpY2Uoc3RhcnRPZk5vbldoaXRlLCBpbmRleCkpXG4gICAgICBzdGFydE9mTm9uV2hpdGUgPSBudWxsXG4gICAgICBjb250aW51ZVxuICAgIH1cbiAgfVxuXG4gIC8vIEF0IHRoZSBlbmQsIGFkZCB0aGUgcmVzdCBvZiB0aGUgc3RyaW5nXG4gIGlmIChzdGFydE9mTm9uV2hpdGUgIT09IG51bGwpIHtcbiAgICB0ZXh0RWxlbWVudHMucHVzaChzdHJpbmcuc2xpY2Uoc3RhcnRPZk5vbldoaXRlKSlcbiAgfVxuXG4gIHJldHVybiB0ZXh0RWxlbWVudHMuam9pbignICcpXG59XG5cbmNvbnN0IHRyaW1BbmRDb2xsYXBzZVdoaXRlc3BhY2UgPSAoc3RyaW5nKSA9PiB7XG4gIHJldHVybiB0cmltQmVnaW5BbmRFbmQoY29sbGFwc2VXaGl0ZXNwYWNlKHN0cmluZykpXG59XG5cbmNvbnN0IGJsYWNrbGlzdCA9IFtcbiAgJ2Jhc2UnLFxuICAnY29tbWFuZCcsXG4gICdsaW5rJyxcbiAgJ21ldGEnLFxuICAnbm9zY3JpcHQnLFxuICAnc2NyaXB0JyxcbiAgJ3N0eWxlJyxcbiAgJ3RpdGxlJyxcbiAgLy8gc3BlY2lhbCBjYXNlc1xuICAvLyBcImh0bWxcIixcbiAgJ2hlYWQnLFxuXVxuXG5jb25zdCBwaHJhc2luZ0NvbnN0cnVjdHMgPSBbXG4gICdhJyxcbiAgJ2FiYnInLFxuICAnYXVkaW8nLFxuICAnYicsXG4gICdiZG8nLFxuICAnYnInLFxuICAnYnV0dG9uJyxcbiAgJ2NhbnZhcycsXG4gICdjaXRlJyxcbiAgJ2NvZGUnLFxuICAnY29tbWFuZCcsXG4gICdkYXRhJyxcbiAgJ2RhdGFsaXN0JyxcbiAgJ2RmbicsXG4gICdlbScsXG4gICdlbWJlZCcsXG4gICdpJyxcbiAgJ2lmcmFtZScsXG4gICdpbWcnLFxuICAnaW5wdXQnLFxuICAna2JkJyxcbiAgJ2tleWdlbicsXG4gICdsYWJlbCcsXG4gICdtYXJrJyxcbiAgJ21hdGgnLFxuICAnbWV0ZXInLFxuICAnbm9zY3JpcHQnLFxuICAnb2JqZWN0JyxcbiAgJ291dHB1dCcsXG4gICdwcm9ncmVzcycsXG4gICdxJyxcbiAgJ3J1YnknLFxuICAnc2FtcCcsXG4gICdzY3JpcHQnLFxuICAnc2VsZWN0JyxcbiAgJ3NtYWxsJyxcbiAgJ3NwYW4nLFxuICAnc3Ryb25nJyxcbiAgJ3N1YicsXG4gICdzdXAnLFxuICAnc3ZnJyxcbiAgJ3RleHRhcmVhJyxcbiAgJ3RpbWUnLFxuICAndmFyJyxcbiAgJ3ZpZGVvJyxcbiAgJ3dicicsXG4gIC8vIHNwZWNpYWwgY2FzZXNcbiAgJ21hcCcsXG4gICdhcmVhJyxcbl1cblxuLy8gY29waWVkIGZyb20gcmVhZGl1bS1jZmktanMgbGlicmFyeVxuLy8gb3JpZ2luYWwgZnVuY3Rpb24gY2FsbGVkIFwiaXNFbGVtZW50QmxhY2tsaXN0ZWRcIlxuY29uc3QgaXNFbGVtZW50QmxhY2tsaXN0ZWQgPSAoXG4gIGVsZW1lbnQsXG4gIGNsYXNzQmxhY2tsaXN0LFxuICBlbGVtZW50QmxhY2tsaXN0LFxuICBpZEJsYWNrbGlzdCxcbikgPT4ge1xuICBpZiAoY2xhc3NCbGFja2xpc3QgJiYgY2xhc3NCbGFja2xpc3QubGVuZ3RoKSB7XG4gICAgY29uc3QgY2xhc3NMaXN0ID0gZ2V0Q2xhc3NOYW1lQXJyYXkoZWxlbWVudClcbiAgICBpZiAoY2xhc3NMaXN0Lmxlbmd0aCA9PT0gMSAmJiBjbGFzc0JsYWNrbGlzdC5pbmNsdWRlcyhjbGFzc0xpc3RbMF0pKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBpZiAoY2xhc3NMaXN0Lmxlbmd0aCAmJiBpbnRlcnNlY3Rpb24oY2xhc3NCbGFja2xpc3QsIGNsYXNzTGlzdCkubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIGlmIChlbGVtZW50QmxhY2tsaXN0ICYmIGVsZW1lbnRCbGFja2xpc3QubGVuZ3RoKSB7XG4gICAgaWYgKGVsZW1lbnQudGFnTmFtZSkge1xuICAgICAgY29uc3QgaXNFbGVtZW50SW5CbGFja2xpc3QgPSBlbGVtZW50QmxhY2tsaXN0LmZpbmQoKGJsYWNrbGlzdGVkVGFnKSA9PlxuICAgICAgICBtYXRjaGVzTG9jYWxOYW1lT3JFbGVtZW50KGVsZW1lbnQsIGJsYWNrbGlzdGVkVGFnLnRvTG93ZXJDYXNlKCkpLFxuICAgICAgKVxuXG4gICAgICBpZiAoaXNFbGVtZW50SW5CbGFja2xpc3QpIHtcbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBpZiAoaWRCbGFja2xpc3QgJiYgaWRCbGFja2xpc3QubGVuZ3RoKSB7XG4gICAgY29uc3QgeyBpZCB9ID0gZWxlbWVudFxuICAgIGlmIChpZCAmJiBpZC5sZW5ndGggJiYgaWRCbGFja2xpc3QuaW5jbHVkZXMoaWQpKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZVxufVxuXG5jb25zdCBpbnRlcnNlY3Rpb24gPSAoYXJyYXkxLCBhcnJheTIpID0+IHtcbiAgY29uc3QgaW50ZXJzZWN0aW9uQXJyYXkgPSBbXVxuICBmb3IgKGxldCB2YWx1ZSBvZiBhcnJheTEpIHtcbiAgICBjb25zdCBpbmRleCA9IGFycmF5Mi5pbmRleE9mKHZhbHVlKVxuICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgIGludGVyc2VjdGlvbkFycmF5LnB1c2godmFsdWUpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGludGVyc2VjdGlvbkFycmF5XG59XG5cbmNvbnN0IGdldENsYXNzTmFtZUFycmF5ID0gKGVsZW1lbnQpID0+IHtcbiAgY29uc3QgeyBjbGFzc05hbWUgfSA9IGVsZW1lbnRcbiAgaWYgKHR5cGVvZiBjbGFzc05hbWUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGNsYXNzTmFtZS5zcGxpdCgvXFxzLylcbiAgfVxuICBpZiAodHlwZW9mIGNsYXNzTmFtZSA9PT0gJ29iamVjdCcgJiYgJ2Jhc2VWYWwnIGluIGNsYXNzTmFtZSkge1xuICAgIHJldHVybiBjbGFzc05hbWUuYmFzZVZhbC5zcGxpdCgvXFxzLylcbiAgfVxuICByZXR1cm4gW11cbn1cblxuY29uc3QgbWF0Y2hlc0xvY2FsTmFtZU9yRWxlbWVudCA9IChlbGVtZW50LCBvdGhlck5hbWVPckVsZW1lbnQpID0+IHtcbiAgaWYgKHR5cGVvZiBvdGhlck5hbWVPckVsZW1lbnQgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIChlbGVtZW50LmxvY2FsTmFtZSB8fCBlbGVtZW50Lm5vZGVOYW1lKSA9PT0gb3RoZXJOYW1lT3JFbGVtZW50XG4gIH1cbiAgcmV0dXJuIGVsZW1lbnQgPT09IG90aGVyTmFtZU9yRWxlbWVudFxufVxuXG4vKipcbiAqIEdldHMgdGhlIGFsdCB0ZXh0IGZyb20gYW4gZWxlbWVudCwgaWYgaXQgZXhpc3RzLCBvdGhlcndpc2UgcmV0dXJucyBwbGFjZWhvbGRlciBhbHQgdGV4dCBjb21wb3NlZCBvZiAxMDAgdW5pdCBzZXBhcmF0b3IgY2hhcmFjdGVyLlxuICogSWYgbm9kZSBoYXMgZW1wdHkgYWx0IGF0dHJpYnV0ZSBvciBhbHQgYXR0cmlidXRlIHdpdGggZW1wdHkgc3RyaW5nLCB0aGlzIHdpbGwgcmV0dXJuIHRoZSBwbGFjZWhvbGRlciBhbHQgdGV4dCBpbnN0ZWFkLlxuICogQHBhcmFtIG5vZGVcbiAqIEBwYXJhbSBwbGFjZWhvbGRlckNoYXJhY3RlclxuICogQHBhcmFtIHBsYWNlaG9sZGVyTGVuZ3RoXG4gKiBAcmV0dXJucyB7c3RyaW5nfVxuICovXG5jb25zdCBnZXRBbHRUZXh0ID0gKG5vZGUsIHBsYWNlaG9sZGVyQ2hhcmFjdGVyLCBwbGFjZWhvbGRlckxlbmd0aCkgPT4ge1xuICBsZXQgYWx0VGV4dCA9IG5vZGUuZ2V0QXR0cmlidXRlKCdhbHQnKVxuICBpZiAoYWx0VGV4dCkge1xuICAgIGFsdFRleHQgPSBhbHRUZXh0LnRyaW0oKVxuICB9XG5cbiAgaWYgKCFhbHRUZXh0KSB7XG4gICAgY29uc3QgYWx0VGV4dFBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXJDaGFyYWN0ZXIucmVwZWF0KHBsYWNlaG9sZGVyTGVuZ3RoKVxuICAgIHJldHVybiBhbHRUZXh0UGxhY2Vob2xkZXJcbiAgfVxuXG4gIHJldHVybiBhbHRUZXh0XG59XG5cbi8qKlxuICogQ2hlY2tzIGlmIGVsZW1lbnQgd2l0aCBnaXZlbiB0YWduYW1lIGNhbiBoYXZlIGFuIGFsdCBhdHRyaWJ1dGUuXG4gKiBAcGFyYW0gdGFnTmFtZVxuICogQHJldHVybnMge2Jvb2xlYW59XG4gKi9cbmNvbnN0IGVsZW1lbnRDYW5IYXZlQWx0VGV4dCA9ICh0YWdOYW1lKSA9PiB7XG4gIGlmICghdGFnTmFtZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgY29uc3QgdGFnTmFtZUxvd2VyQ2FzZSA9IHRhZ05hbWUudG9Mb3dlckNhc2UoKVxuICBjb25zdCBlbGVtZW50c1dpdGhBbHRUZXh0ID0gWydhcmVhJywgJ2ltZycsICdpbnB1dCcsICdjYW52YXMnLF1cbiAgcmV0dXJuIGVsZW1lbnRzV2l0aEFsdFRleHQuaW5jbHVkZXModGFnTmFtZUxvd2VyQ2FzZSlcbn1cblxuZXhwb3J0IHtcbiAgYXV0b0JpbmQsXG4gIGJsYWNrbGlzdCxcbiAgQnJlYWtUeXBlLFxuICB0cmltQmVnaW5Pbmx5LFxuICB0cmltRW5kTmV3TGluZSxcbiAgdHJpbUJlZ2luQW5kRW5kLFxuICB0cmltQWxsRXhjZXB0RW5kV2hpdGVTcGFjZSxcbiAgdHJpbUFuZENvbGxhcHNlV2hpdGVzcGFjZSxcbiAgY29sbGFwc2VXaGl0ZXNwYWNlLFxuICBwaHJhc2luZ0NvbnN0cnVjdHMsXG4gIGlzRWxlbWVudEJsYWNrbGlzdGVkLFxuICBpc0NoYXJXaGl0ZXNwYWNlLFxuICBnZXRBbHRUZXh0LFxuICBlbGVtZW50Q2FuSGF2ZUFsdFRleHQsXG59XG4iLCJpbXBvcnQge1xuICBhdXRvQmluZCxcbiAgQnJlYWtUeXBlLFxuICB0cmltQmVnaW5BbmRFbmQsXG4gIHBocmFzaW5nQ29uc3RydWN0cyxcbiAgaXNFbGVtZW50QmxhY2tsaXN0ZWQsXG4gIGdldEFsdFRleHQsXG4gIGVsZW1lbnRDYW5IYXZlQWx0VGV4dCxcbiAgdHJpbUFuZENvbGxhcHNlV2hpdGVzcGFjZSxcbiAgdHJpbUFsbEV4Y2VwdEVuZFdoaXRlU3BhY2UsXG59IGZyb20gJy4vdXRpbCdcblxuZXhwb3J0IGNsYXNzIFN0cmluZ0NvbGxlY3RvciB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMucnVucyA9IFtdXG4gICAgdGhpcy50ZXh0ID0gW11cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICB0aGlzLmhhc0VuY291bnRlcmVkRmlyc3RDZWxsID0gZmFsc2VcbiAgICB0aGlzLmxhc3RCcmVhayA9IG51bGxcblxuICAgIGF1dG9CaW5kLmNhbGwodGhpcylcbiAgfVxuXG4gIGFkZEJyZWFrKGRvdWJsZSkge1xuICAgIGlmICh0aGlzLmxhc3RCcmVhayA9PT0gbnVsbCkge1xuICAgICAgLy8gVGhlIG9ubHkgdGltZSBpdCBzaG91bGQgYmUgbnVsbCBpcyBhdCB0aGUgYmVnaW5uaW5nIG9mIGRvY3VtZW50XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoZG91YmxlKSB7XG4gICAgICB0aGlzLmxhc3RCcmVhayA9IEJyZWFrVHlwZS5ET1VCTEVcbiAgICB9IGVsc2UgaWYgKHRoaXMubGFzdEJyZWFrICE9PSBCcmVha1R5cGUuRE9VQkxFKSB7XG4gICAgICB0aGlzLmxhc3RCcmVhayA9IEJyZWFrVHlwZS5TSU5HTEVcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzQnJlYWtzKCkge1xuICAgIGlmICghdGhpcy5sYXN0QnJlYWspIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy5sYXN0QnJlYWspIHtcbiAgICAgIGNhc2UgQnJlYWtUeXBlLlNJTkdMRTpcbiAgICAgICAgdGhpcy5ydW5zLnB1c2goJ1xcbicpXG4gICAgICAgIGJyZWFrXG4gICAgICBjYXNlIEJyZWFrVHlwZS5ET1VCTEU6XG4gICAgICAgIGxldCBwYXJhZ3JhcGhCcmVha0FkZGVkID0gZmFsc2VcbiAgICAgICAgLy8gaXRlcmF0ZSB0aHJvdWdoIHJ1bnMgYmFja3dhcmRzOlxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5ydW5zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgY29uc3QgcnVuID0gdGhpcy5ydW5zW2ldXG4gICAgICAgICAgaWYgKHJ1biA9PT0gJ1xcblxcbicpIHtcbiAgICAgICAgICAgIC8vIGZvdW5kIGRvdWJsZSBicmVha1xuICAgICAgICAgICAgcGFyYWdyYXBoQnJlYWtBZGRlZCA9IHRydWVcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfSBlbHNlIGlmIChydW4gIT09ICdcXG4nKSB7XG4gICAgICAgICAgICAvLyBmb3VuZCB0ZXh0IGNvbnRlbnRcbiAgICAgICAgICAgIGJyZWFrXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghcGFyYWdyYXBoQnJlYWtBZGRlZCkge1xuICAgICAgICAgIHRoaXMucnVucy5wdXNoKCdcXG5cXG4nKVxuICAgICAgICB9XG4gICAgICAgIGJyZWFrXG4gICAgfVxuXG4gICAgdGhpcy5sYXN0QnJlYWsgPSBCcmVha1R5cGUuTk9ORVxuICB9XG5cbiAgcHJvY2Vzc1RleHRBbmRUcmltKHRyaW1taW5nRnVuY3Rpb24pIHtcbiAgICBpZiAodGhpcy50ZXh0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gVHJpbVxuICAgIGNvbnN0IHRyaW1tZWQgPSB0cmltbWluZ0Z1bmN0aW9uKHRoaXMudGV4dC5qb2luKCcnKSlcbiAgICBpZiAoIXRyaW1tZWQpIHtcbiAgICAgIC8vIFRyaW1tZWQgaW50byBhbiBlbXB0eSBzdHJpbmdcbiAgICAgIC8vIFByZXNlcnZlIGFsbCBwcmVjZWRpbmcgYnJlYWtzXG4gICAgICB0aGlzLnRleHQgPSBbXVxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHRoaXMubGFzdEJyZWFrID09PSBudWxsKSB7XG4gICAgICB0aGlzLmxhc3RCcmVhayA9IEJyZWFrVHlwZS5OT05FXG4gICAgfVxuXG4gICAgdGhpcy5ydW5zLnB1c2godHJpbW1pbmdGdW5jdGlvbih0cmltbWVkKSlcbiAgICB0aGlzLnRleHQgPSBbXVxuICB9XG5cbiAgcHJvY2Vzc1RleHQodHJpbUVuZFNwYWNlcyA9IHRydWUpIHtcbiAgICBpZiAodHJpbUVuZFNwYWNlcykge1xuICAgICAgdGhpcy5wcm9jZXNzVGV4dEFuZFRyaW0odHJpbUFuZENvbGxhcHNlV2hpdGVzcGFjZSlcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm9jZXNzVGV4dEFuZFRyaW0odHJpbUFsbEV4Y2VwdEVuZFdoaXRlU3BhY2UpXG4gICAgfVxuICB9XG5cbiAgcHJvY2Vzc0VsZW1lbnROb2RlKG5vZGUsIGlzT3BlbmluZykge1xuICAgIGlmIChcbiAgICAgIGlzRWxlbWVudEJsYWNrbGlzdGVkKFxuICAgICAgICBub2RlLFxuICAgICAgICB0aGlzLm9wdGlvbnMuY2xhc3NCbGFja2xpc3QsXG4gICAgICAgIHRoaXMub3B0aW9ucy5lbGVtZW50QmxhY2tsaXN0LFxuICAgICAgICB0aGlzLm9wdGlvbnMuaWRCbGFja2xpc3QsXG4gICAgICApXG4gICAgKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGNvbnN0IHRhZyA9IG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIFByZWZvcm1hdHRlZFxuICAgIGlmICh0YWcgPT09ICdwcmUnKSB7XG4gICAgICB0aGlzLnByb2Nlc3NUZXh0KClcbiAgICAgIHRoaXMuYWRkQnJlYWsoZmFsc2UpXG4gICAgICB0aGlzLnByb2Nlc3NCcmVha3MoKVxuXG4gICAgICB0aGlzLnJ1bnMucHVzaChub2RlLnRleHRDb250ZW50KVxuICAgICAgdGhpcy5sYXN0QnJlYWsgPSBCcmVha1R5cGUuU0lOR0xFXG5cbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgLy8gUHJvY2VzcyBvdGhlciB0YWdzXG4gICAgc3dpdGNoICh0YWcpIHtcbiAgICAgIGNhc2UgJ2JyJzpcbiAgICAgICAgdGhpcy5wcm9jZXNzVGV4dChmYWxzZSlcbiAgICAgICAgdGhpcy5wcm9jZXNzQnJlYWtzKClcbiAgICAgICAgdGhpcy5ydW5zLnB1c2goJ1xcbicpXG5cbiAgICAgICAgcmV0dXJuIHRydWVcbiAgICAgIGNhc2UgJ3dicic6XG4gICAgICAgIHRoaXMucHJvY2Vzc0JyZWFrcygpXG4gICAgICAgIHRoaXMudGV4dC5wdXNoKCdcXHUyMDBCJylcblxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChlbGVtZW50Q2FuSGF2ZUFsdFRleHQobm9kZS50YWdOYW1lKSkge1xuICAgICAgdGhpcy5wcm9jZXNzQnJlYWtzKClcblxuICAgICAgY29uc3QgYWx0VGV4dCA9IGdldEFsdFRleHQoXG4gICAgICAgIG5vZGUsXG4gICAgICAgIHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlclN0cmluZyxcbiAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyQ29waWVzXG4gICAgICApXG4gICAgICB0aGlzLnRleHQucHVzaChgICR7YWx0VGV4dH0gYClcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG4gICAgaWYgKG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc3ZnJyAmJiBpc09wZW5pbmcpIHtcbiAgICAgIGNvbnN0IGFsdFRleHQgPSBnZXRBbHRUZXh0KFxuICAgICAgICBub2RlLFxuICAgICAgICB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXJTdHJpbmcsXG4gICAgICAgIHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlckNvcGllc1xuICAgICAgKVxuICAgICAgdGhpcy50ZXh0LnB1c2goYCAke2FsdFRleHR9IGApXG4gICAgfVxuXG4gICAgdGhpcy5wcm9jZXNzQmxvY2tDb25zdHJ1Y3QodGFnLCBpc09wZW5pbmcpXG5cbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuXG4gIHByb2Nlc3NCbG9ja0NvbnN0cnVjdCh0YWcsIGlzT3BlbmluZykge1xuICAgIGlmIChwaHJhc2luZ0NvbnN0cnVjdHMuaW5jbHVkZXModGFnKSkge1xuICAgICAgLy8gRG8gbm90IHByb2Nlc3MgcGhyYXNpbmcgdGFncyBhcyBibG9jayBjb25zdHJ1Y3RzXG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAodGFnID09PSAndGgnIHx8IHRhZyA9PT0gJ3RkJykge1xuICAgICAgLy8gU3BlY2lhbCBCbG9ja1xuICAgICAgaWYgKGlzT3BlbmluZykge1xuICAgICAgICAvLyBJJ20gYXNzdW1pbmcgdGhlIERPTSB3aWxsIGZpeCBhbGwgdGFibGUgZWxlbWVudCBtYWxmb3JtYXRpb25zXG5cbiAgICAgICAgaWYgKCF0aGlzLmhhc0VuY291bnRlcmVkRmlyc3RDZWxsKSB7XG4gICAgICAgICAgdGhpcy5oYXNFbmNvdW50ZXJlZEZpcnN0Q2VsbCA9IHRydWVcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnByb2Nlc3NCcmVha3MoKVxuICAgICAgICAgIHRoaXMucnVucy5wdXNoKCdcXHQnKVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnByb2Nlc3NUZXh0KClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgLy8gUmVndWxhciBCbG9ja1xuXG4gICAgdGhpcy5wcm9jZXNzVGV4dCgpXG5cbiAgICBpZiAodGFnID09PSAndHInKSB7XG4gICAgICB0aGlzLmhhc0VuY291bnRlcmVkRmlyc3RDZWxsID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAodGFnID09PSAncCcpIHtcbiAgICAgIHRoaXMuYWRkQnJlYWsodHJ1ZSlcbiAgICB9XG5cbiAgICB0aGlzLmFkZEJyZWFrKGZhbHNlKVxuICB9XG5cbiAgcHJvY2Vzc1RleHROb2RlKG5vZGUpIHtcbiAgICBjb25zdCBzdHJpbmcgPSBub2RlLnRleHRDb250ZW50Lm5vcm1hbGl6ZSgpXG5cbiAgICAvLyBUcmltXG4gICAgY29uc3QgdHJpbW1lZCA9IHRyaW1CZWdpbkFuZEVuZChzdHJpbmcpXG4gICAgaWYgKHRyaW1tZWQpIHtcbiAgICAgIHRoaXMucHJvY2Vzc0JyZWFrcygpXG4gICAgfVxuXG4gICAgdGhpcy50ZXh0LnB1c2goc3RyaW5nKVxuICB9XG5cbiAgZ2V0UmVzdWx0KCkge1xuICAgIC8vIEdldCBTdHJhZ2dsZXJzXG4gICAgdGhpcy5wcm9jZXNzVGV4dCgpXG5cbiAgICByZXR1cm4gdGhpcy5ydW5zLmpvaW4oJycpXG4gIH1cbn1cbiIsImltcG9ydCB7XG4gIGF1dG9CaW5kLFxuICBCcmVha1R5cGUsXG4gIHRyaW1CZWdpbkFuZEVuZCxcbiAgaXNDaGFyV2hpdGVzcGFjZSxcbiAgcGhyYXNpbmdDb25zdHJ1Y3RzLFxuICBpc0VsZW1lbnRCbGFja2xpc3RlZCxcbiAgZ2V0QWx0VGV4dCxcbiAgZWxlbWVudENhbkhhdmVBbHRUZXh0LFxuICB0cmltQWxsRXhjZXB0RW5kV2hpdGVTcGFjZSxcbiAgdHJpbUFuZENvbGxhcHNlV2hpdGVzcGFjZSxcbn0gZnJvbSAnLi91dGlsJ1xuXG5jb25zdCBNYXBUeXBlID0ge1xuICBURVhUOiAnVGV4dCcsXG4gIEJSRUFLOiAnQnJlYWsnLFxufVxuXG5leHBvcnQgY2xhc3MgTWFwQ29sbGVjdG9yIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5tYXAgPSBbXVxuICAgIHRoaXMudGV4dCA9IFtdXG5cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zXG5cbiAgICB0aGlzLmhhc0VuY291bnRlcmVkRmlyc3RDZWxsID0gZmFsc2VcbiAgICB0aGlzLmxhc3RCcmVhayA9IG51bGxcblxuICAgIGF1dG9CaW5kLmNhbGwodGhpcylcbiAgfVxuXG4gIGFkZEJyZWFrKGRvdWJsZSkge1xuICAgIGlmICh0aGlzLmxhc3RCcmVhayA9PT0gbnVsbCkge1xuICAgICAgLy8gVGhlIG9ubHkgdGltZSBpdCBzaG91bGQgYmUgbnVsbCBpcyBhdCB0aGUgYmVnaW5uaW5nIG9mIGRvY3VtZW50XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBpZiAoZG91YmxlKSB7XG4gICAgICB0aGlzLmxhc3RCcmVhayA9IEJyZWFrVHlwZS5ET1VCTEVcbiAgICB9IGVsc2UgaWYgKHRoaXMubGFzdEJyZWFrICE9PSBCcmVha1R5cGUuRE9VQkxFKSB7XG4gICAgICB0aGlzLmxhc3RCcmVhayA9IEJyZWFrVHlwZS5TSU5HTEVcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzQnJlYWtzKCkge1xuICAgIGlmICghdGhpcy5sYXN0QnJlYWspIHtcbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIHN3aXRjaCAodGhpcy5sYXN0QnJlYWspIHtcbiAgICAgIGNhc2UgQnJlYWtUeXBlLlNJTkdMRTpcbiAgICAgICAgdGhpcy5tYXAucHVzaCh7XG4gICAgICAgICAgdHlwZTogTWFwVHlwZS5CUkVBSyxcbiAgICAgICAgICBkb3VibGU6IGZhbHNlLFxuICAgICAgICB9KVxuICAgICAgICBicmVha1xuICAgICAgY2FzZSBCcmVha1R5cGUuRE9VQkxFOlxuICAgICAgICBsZXQgcGFyYWdyYXBoQnJlYWtBZGRlZCA9IGZhbHNlXG4gICAgICAgIC8vIGl0ZXJhdGUgdGhyb3VnaCBtYXAgYmFja3dhcmRzOlxuICAgICAgICBmb3IgKGxldCBpID0gdGhpcy5tYXAubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgICBjb25zdCBtYXAgPSB0aGlzLm1hcFtpXVxuICAgICAgICAgIGlmIChtYXAudHlwZSA9PT0gTWFwVHlwZS5CUkVBSyAmJiBtYXAuZG91YmxlKSB7XG4gICAgICAgICAgICBwYXJhZ3JhcGhCcmVha0FkZGVkID0gdHJ1ZVxuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLmlzU2luZ2xlQnJlYWsobWFwKSkge1xuICAgICAgICAgICAgYnJlYWtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFwYXJhZ3JhcGhCcmVha0FkZGVkKSB7XG4gICAgICAgICAgdGhpcy5tYXAucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiBNYXBUeXBlLkJSRUFLLFxuICAgICAgICAgICAgZG91YmxlOiB0cnVlLFxuICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICAgICAgYnJlYWtcbiAgICB9XG5cbiAgICB0aGlzLmxhc3RCcmVhayA9IEJyZWFrVHlwZS5OT05FXG4gIH1cblxuICBpc1NpbmdsZUJyZWFrKG1hcE9iamVjdCkge1xuICAgIGNvbnN0IGlzU2luZ2xlQnJlYWsgPSBtYXBPYmplY3QudHlwZSA9PT0gTWFwVHlwZS5CUkVBSyAmJiAhbWFwT2JqZWN0LmRvdWJsZVxuICAgIGNvbnN0IGlzTmV3TGluZSA9IG1hcE9iamVjdC50eXBlID09PSBNYXBUeXBlLlRFWFQgJiYgbWFwT2JqZWN0LmNvbnRlbnQgPT09ICdcXG4nXG4gICAgcmV0dXJuIGlzU2luZ2xlQnJlYWsgfHwgaXNOZXdMaW5lXG4gIH1cblxuICBwcm9jZXNzVGV4dEFuZFRyaW0odHJpbW1pbmdGdW5jdGlvbikge1xuICAgIGlmICh0aGlzLnRleHQubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm5cbiAgICB9XG5cbiAgICBjb25zdCBqb2luZWRUZXh0ID0gdGhpcy50ZXh0Lm1hcCgoZWxlbWVudCkgPT4gZWxlbWVudC5zdHJpbmcpLmpvaW4oJycpXG4gICAgLy8gVE9ETzogbWlnaHQgaGF2ZSB0byBjaGVjayBmb3IgbnVsbCBzdHJpbmcgaGVyZVxuICAgIGNvbnN0IHRyaW1tZWQgPSB0cmltbWluZ0Z1bmN0aW9uKGpvaW5lZFRleHQpXG4gICAgaWYgKCF0cmltbWVkKSB7XG4gICAgICAvLyBUcmltbWVkIGludG8gYW4gZW1wdHkgc3RyaW5nXG4gICAgICAvLyBQcmVzZXJ2ZSBhbGwgcHJlY2VkaW5nIGJyZWFrc1xuICAgICAgdGhpcy50ZXh0ID0gW11cbiAgICAgIHJldHVyblxuICAgIH1cblxuICAgIGxldCBmdWxsVGV4dCA9IHRyaW1taW5nRnVuY3Rpb24odHJpbW1lZClcblxuICAgIGxldCBibG9ja01hcCA9IFtdXG4gICAgbGV0IGN1cnJlbnRJbmRleE9mU3RyaW5nID0gMFxuXG4gICAgZm9yIChjb25zdCB0ZXh0TWFwIG9mIHRoaXMudGV4dCkge1xuICAgICAgY29uc3Qgc2hydW5rVGV4dCA9IHRyaW1taW5nRnVuY3Rpb24odGV4dE1hcC5zdHJpbmcpXG4gICAgICBpZiAoIXNocnVua1RleHQpIHtcbiAgICAgICAgY29udGludWVcbiAgICAgIH1cblxuICAgICAgY29uc3QgaW5kZXggPSBmdWxsVGV4dC5pbmRleE9mKHNocnVua1RleHQpXG5cbiAgICAgIGlmIChpbmRleCA8IDApIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFxuICAgICAgICAgIGBDb3VsZCBub3QgZmluZCBzaHJ1bmsgc3RyaW5nIFxcXCIke3NocnVua1RleHR9XFxcIiBpbiBcXFwiJHtmdWxsVGV4dH1cXFwiYCxcbiAgICAgICAgKVxuICAgICAgfVxuXG4gICAgICBibG9ja01hcC5wdXNoKHtcbiAgICAgICAgdHlwZTogTWFwVHlwZS5URVhULFxuICAgICAgICBub2RlOiB0ZXh0TWFwLm5vZGUsXG4gICAgICAgIHN0YXJ0OiBjdXJyZW50SW5kZXhPZlN0cmluZyArIGluZGV4LFxuICAgICAgICBsZW5ndGg6IHNocnVua1RleHQubGVuZ3RoLFxuICAgICAgICBjb250ZW50OiBzaHJ1bmtUZXh0LFxuICAgICAgfSlcblxuICAgICAgZnVsbFRleHQgPSBmdWxsVGV4dC5zbGljZShpbmRleCArIHNocnVua1RleHQubGVuZ3RoKVxuICAgICAgY3VycmVudEluZGV4T2ZTdHJpbmcgKz0gc2hydW5rVGV4dC5sZW5ndGggKyBpbmRleFxuICAgIH1cblxuICAgIC8vIERvIHNvbWUgbW9yZSBtYWdpYyBvbiBibG9jayBtYXBcbiAgICBmb3IgKGxldCBpID0gMTsgaSA8IGJsb2NrTWFwLmxlbmd0aDsgKytpKSB7XG4gICAgICBpZiAoXG4gICAgICAgIGJsb2NrTWFwW2ldLnN0YXJ0IC0gYmxvY2tNYXBbaSAtIDFdLnN0YXJ0ICE9PVxuICAgICAgICBibG9ja01hcFtpIC0gMV0ubGVuZ3RoXG4gICAgICApIHtcbiAgICAgICAgYmxvY2tNYXBbaSAtIDFdLmxlbmd0aCA9IGJsb2NrTWFwW2ldLnN0YXJ0IC0gYmxvY2tNYXBbaSAtIDFdLnN0YXJ0XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5tYXAucHVzaCguLi5ibG9ja01hcClcblxuICAgIGlmICh0aGlzLmxhc3RCcmVhayA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5sYXN0QnJlYWsgPSBCcmVha1R5cGUuTk9ORVxuICAgIH1cblxuICAgIHRoaXMudGV4dCA9IFtdXG4gIH1cblxuICBwcm9jZXNzVGV4dCh0cmltRW5kU3BhY2VzID0gdHJ1ZSkge1xuICAgIGlmICh0cmltRW5kU3BhY2VzKSB7XG4gICAgICB0aGlzLnByb2Nlc3NUZXh0QW5kVHJpbSh0cmltQW5kQ29sbGFwc2VXaGl0ZXNwYWNlKVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnByb2Nlc3NUZXh0QW5kVHJpbSh0cmltQWxsRXhjZXB0RW5kV2hpdGVTcGFjZSlcbiAgICB9XG4gIH1cblxuICBwcm9jZXNzRWxlbWVudE5vZGUobm9kZSwgaXNPcGVuaW5nKSB7XG4gICAgaWYgKFxuICAgICAgaXNFbGVtZW50QmxhY2tsaXN0ZWQoXG4gICAgICAgIG5vZGUsXG4gICAgICAgIHRoaXMub3B0aW9ucy5jbGFzc0JsYWNrbGlzdCxcbiAgICAgICAgdGhpcy5vcHRpb25zLmVsZW1lbnRCbGFja2xpc3QsXG4gICAgICAgIHRoaXMub3B0aW9ucy5pZEJsYWNrbGlzdCxcbiAgICAgIClcbiAgICApIHtcbiAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgY29uc3QgdGFnID0gbm9kZS50YWdOYW1lLnRvTG93ZXJDYXNlKClcblxuICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgUHJlZm9ybWF0dGVkXG4gICAgaWYgKHRhZyA9PT0gJ3ByZScpIHtcbiAgICAgIHRoaXMucHJvY2Vzc1RleHQoKVxuICAgICAgdGhpcy5hZGRCcmVhayhmYWxzZSlcbiAgICAgIHRoaXMucHJvY2Vzc0JyZWFrcygpXG5cbiAgICAgIHRoaXMubGFzdEJyZWFrID0gQnJlYWtUeXBlLlNJTkdMRVxuXG4gICAgICB0aGlzLm1hcC5wdXNoKHtcbiAgICAgICAgdHlwZTogTWFwVHlwZS5URVhULFxuICAgICAgICBub2RlLFxuICAgICAgICBjb250ZW50OiBub2RlLnRleHRDb250ZW50LFxuICAgICAgICBsZW5ndGg6IG5vZGUudGV4dENvbnRlbnQubGVuZ3RoLFxuICAgICAgfSlcblxuICAgICAgcmV0dXJuIHRydWVcbiAgICB9XG5cbiAgICAvLyBQcm9jZXNzIG90aGVyIHRhZ3NcbiAgICBzd2l0Y2ggKHRhZykge1xuICAgICAgY2FzZSAnYnInOlxuICAgICAgICB0aGlzLnByb2Nlc3NUZXh0KGZhbHNlKVxuICAgICAgICB0aGlzLnByb2Nlc3NCcmVha3MoKVxuXG4gICAgICAgIHRoaXMubWFwLnB1c2goe1xuICAgICAgICAgIHR5cGU6IE1hcFR5cGUuVEVYVCxcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIGNvbnRlbnQ6ICdcXG4nLFxuICAgICAgICAgIGxlbmd0aDogMSxcbiAgICAgICAgfSlcblxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgY2FzZSAnd2JyJzpcbiAgICAgICAgdGhpcy5wcm9jZXNzQnJlYWtzKClcbiAgICAgICAgdGhpcy50ZXh0LnB1c2goeyBub2RlLCBzdHJpbmc6ICdcXHUyMDBCJyB9KVxuXG4gICAgICAgIHJldHVybiB0cnVlXG4gICAgfVxuXG4gICAgaWYgKGVsZW1lbnRDYW5IYXZlQWx0VGV4dChub2RlLnRhZ05hbWUpKSB7XG4gICAgICB0aGlzLnByb2Nlc3NCcmVha3MoKVxuXG4gICAgICBjb25zdCBhbHRUZXh0ID0gZ2V0QWx0VGV4dChub2RlLCB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXJTdHJpbmcsIHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlckNvcGllcylcbiAgICAgIHRoaXMudGV4dC5wdXNoKHsgbm9kZSwgc3RyaW5nOiBgICR7YWx0VGV4dH0gYCB9KVxuXG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cblxuICAgIGlmIChub2RlLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3N2ZycgJiYgaXNPcGVuaW5nKSB7XG4gICAgICBjb25zdCBhbHRUZXh0ID0gZ2V0QWx0VGV4dChcbiAgICAgICAgbm9kZSxcbiAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyU3RyaW5nLFxuICAgICAgICB0aGlzLm9wdGlvbnMucGxhY2Vob2xkZXJDb3BpZXNcbiAgICAgIClcbiAgICAgIHRoaXMudGV4dC5wdXNoKHsgbm9kZSwgc3RyaW5nOiBgICR7YWx0VGV4dH0gYCB9KVxuICAgIH1cblxuICAgIHRoaXMucHJvY2Vzc0Jsb2NrQ29uc3RydWN0KG5vZGUsIGlzT3BlbmluZylcblxuICAgIHJldHVybiBmYWxzZVxuICB9XG5cbiAgcHJvY2Vzc0Jsb2NrQ29uc3RydWN0KG5vZGUsIGlzT3BlbmluZykge1xuICAgIGNvbnN0IHRhZyA9IG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpXG5cbiAgICBpZiAocGhyYXNpbmdDb25zdHJ1Y3RzLmluY2x1ZGVzKHRhZykpIHtcbiAgICAgIC8vIERvIG5vdCBwcm9jZXNzIHBocmFzaW5nIHRhZ3MgYXMgYmxvY2sgY29uc3RydWN0c1xuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgaWYgKHRhZyA9PT0gJ3RoJyB8fCB0YWcgPT09ICd0ZCcpIHtcbiAgICAgIC8vIFNwZWNpYWwgQmxvY2tcbiAgICAgIGlmIChpc09wZW5pbmcpIHtcbiAgICAgICAgLy8gSSdtIGFzc3VtaW5nIHRoZSBET00gd2lsbCBmaXggYWxsIHRhYmxlIGVsZW1lbnQgbWFsZm9ybWF0aW9uc1xuXG4gICAgICAgIGlmICghdGhpcy5oYXNFbmNvdW50ZXJlZEZpcnN0Q2VsbCkge1xuICAgICAgICAgIHRoaXMuaGFzRW5jb3VudGVyZWRGaXJzdENlbGwgPSB0cnVlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5wcm9jZXNzQnJlYWtzKClcbiAgICAgICAgICB0aGlzLm1hcC5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6IE1hcFR5cGUuVEVYVCxcbiAgICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgICBjb250ZW50OiAnXFx0JyxcbiAgICAgICAgICAgIGxlbmd0aDogMSxcbiAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnByb2Nlc3NUZXh0KClcbiAgICAgIH1cblxuICAgICAgcmV0dXJuXG4gICAgfVxuXG4gICAgdGhpcy5wcm9jZXNzVGV4dCgpXG5cbiAgICBpZiAodGFnID09PSAndHInKSB7XG4gICAgICB0aGlzLmhhc0VuY291bnRlcmVkRmlyc3RDZWxsID0gZmFsc2VcbiAgICB9XG5cbiAgICBpZiAodGFnID09PSAncCcpIHtcbiAgICAgIHRoaXMuYWRkQnJlYWsodHJ1ZSlcbiAgICB9XG5cbiAgICB0aGlzLmFkZEJyZWFrKGZhbHNlKVxuICB9XG5cbiAgcHJvY2Vzc1RleHROb2RlKG5vZGUpIHtcbiAgICBjb25zdCBzdHJpbmcgPSBub2RlLnRleHRDb250ZW50Lm5vcm1hbGl6ZSgpXG5cbiAgICAvLyBUcmltXG4gICAgY29uc3QgdHJpbW1lZCA9IHRyaW1CZWdpbkFuZEVuZChzdHJpbmcpXG4gICAgaWYgKHRyaW1tZWQpIHtcbiAgICAgIHRoaXMucHJvY2Vzc0JyZWFrcygpXG4gICAgfVxuXG4gICAgdGhpcy50ZXh0LnB1c2goeyBub2RlLCBzdHJpbmcgfSlcbiAgfVxuXG4gIGdldFJlc3VsdCgpIHtcbiAgICBjb25zdCByZXN1bHQgPSBbXVxuICAgIGxldCBydW5uaW5nSW5kZXggPSAwXG5cbiAgICBmb3IgKGNvbnN0IGVudGl0eSBvZiB0aGlzLm1hcCkge1xuICAgICAgc3dpdGNoIChlbnRpdHkudHlwZSkge1xuICAgICAgICBjYXNlIE1hcFR5cGUuVEVYVDpcbiAgICAgICAgICAvLyBUT0RPOiBUZXN0c1xuXG4gICAgICAgICAgY29uc3Qgd2hpdGVzcGFjZSA9IFtdXG5cbiAgICAgICAgICBpZiAoXG4gICAgICAgICAgICBlbnRpdHkubm9kZS5ub2RlVHlwZSA9PT0gTm9kZS5URVhUX05PREUgfHxcbiAgICAgICAgICAgIGVudGl0eS5ub2RlLnRhZ05hbWUgPT09ICdpbWcnXG4gICAgICAgICAgKSB7XG4gICAgICAgICAgICBsZXQgbm9kZUNvbnRlbnRcbiAgICAgICAgICAgIGlmIChlbGVtZW50Q2FuSGF2ZUFsdFRleHQoZW50aXR5Lm5vZGUudGFnTmFtZSkpIHtcbiAgICAgICAgICAgICAgY29uc3QgYWx0VGV4dCA9IGdldEFsdFRleHQoXG4gICAgICAgICAgICAgICAgZW50aXR5Lm5vZGUsXG4gICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyU3RyaW5nLFxuICAgICAgICAgICAgICAgIHRoaXMub3B0aW9ucy5wbGFjZWhvbGRlckNvcGllc1xuICAgICAgICAgICAgICApLm5vcm1hbGl6ZSgpXG4gICAgICAgICAgICAgIG5vZGVDb250ZW50ID0gYWx0VGV4dFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgbm9kZUNvbnRlbnQgPSAnJ1xuICAgICAgICAgICAgICBpZiAoZW50aXR5Lm5vZGUudGFnTmFtZSA9PT0gJ3N2ZycpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBhbHRUZXh0ID0gZ2V0QWx0VGV4dChcbiAgICAgICAgICAgICAgICAgIGVudGl0eS5ub2RlLFxuICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyU3RyaW5nLFxuICAgICAgICAgICAgICAgICAgdGhpcy5vcHRpb25zLnBsYWNlaG9sZGVyQ29waWVzXG4gICAgICAgICAgICAgICAgKS5ub3JtYWxpemUoKVxuICAgICAgICAgICAgICAgIG5vZGVDb250ZW50ID0gYWx0VGV4dFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIG5vZGVDb250ZW50ICs9IGVudGl0eS5ub2RlLnRleHRDb250ZW50Lm5vcm1hbGl6ZSgpXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvciAoXG4gICAgICAgICAgICAgIGxldCBjaGFySW5NYXAgPSAwLCBjaGFySW5Ob2RlID0gMDtcbiAgICAgICAgICAgICAgY2hhckluTm9kZSA8IG5vZGVDb250ZW50Lmxlbmd0aDtcbiAgICAgICAgICAgICAgKytjaGFySW5Ob2RlXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgY29uc3QgaXNFcXVhbCA9XG4gICAgICAgICAgICAgICAgZW50aXR5LmNvbnRlbnQuY2hhckF0KGNoYXJJbk1hcCkgPT09XG4gICAgICAgICAgICAgICAgbm9kZUNvbnRlbnQuY2hhckF0KGNoYXJJbk5vZGUpXG4gICAgICAgICAgICAgIGNvbnN0IGlzTWFwV2hpdGVzcGFjZSA9IGlzQ2hhcldoaXRlc3BhY2UoXG4gICAgICAgICAgICAgICAgZW50aXR5LmNvbnRlbnQuY2hhckNvZGVBdChjaGFySW5NYXApLFxuICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgIGNvbnN0IGlzTm9kZVdoaXRlc3BhY2UgPSBpc0NoYXJXaGl0ZXNwYWNlKFxuICAgICAgICAgICAgICAgIG5vZGVDb250ZW50LmNoYXJDb2RlQXQoY2hhckluTm9kZSksXG4gICAgICAgICAgICAgIClcblxuICAgICAgICAgICAgICBpZiAoaXNFcXVhbCB8fCAoaXNNYXBXaGl0ZXNwYWNlICYmIGlzTm9kZVdoaXRlc3BhY2UpKSB7XG4gICAgICAgICAgICAgICAgKytjaGFySW5NYXBcbiAgICAgICAgICAgICAgfSBlbHNlIGlmIChpc01hcFdoaXRlc3BhY2UgfHwgaXNOb2RlV2hpdGVzcGFjZSkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNraXBzID0ge1xuICAgICAgICAgICAgICAgICAgYWZ0ZXI6IGNoYXJJbk1hcCAtIDEsXG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogY2hhckluTm9kZSxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgd2hpdGVzcGFjZS5wdXNoKHNraXBzKVxuICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcbiAgICAgICAgICAgICAgICAgIGBEZWdhdXNzIGVycm9yLCBjaGFyYWN0ZXIgbWlzbWF0Y2ggYW5kIG5vdCBhIHdoaXRlc3BhY2VgLFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgIG5vZGU6IGVudGl0eS5ub2RlLFxuICAgICAgICAgICAgY29udGVudDogZW50aXR5LmNvbnRlbnQsXG4gICAgICAgICAgICB3aGl0ZXNwYWNlOiB3aGl0ZXNwYWNlLFxuICAgICAgICAgICAgc3RhcnQ6IHJ1bm5pbmdJbmRleCxcbiAgICAgICAgICAgIGxlbmd0aDogZW50aXR5Lmxlbmd0aCxcbiAgICAgICAgICB9KVxuXG4gICAgICAgICAgcnVubmluZ0luZGV4ICs9IGVudGl0eS5sZW5ndGhcblxuICAgICAgICAgIGJyZWFrXG4gICAgICAgIGNhc2UgTWFwVHlwZS5CUkVBSzpcbiAgICAgICAgICBjb25zdCBsYXN0UmVzdWx0ID0gcmVzdWx0W3Jlc3VsdC5sZW5ndGggLSAxXVxuXG4gICAgICAgICAgaWYgKGVudGl0eS5kb3VibGUpIHtcbiAgICAgICAgICAgIGxhc3RSZXN1bHQubGVuZ3RoICs9IDJcbiAgICAgICAgICAgIHJ1bm5pbmdJbmRleCArPSAyXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGxhc3RSZXN1bHQubGVuZ3RoICs9IDFcbiAgICAgICAgICAgIHJ1bm5pbmdJbmRleCArPSAxXG4gICAgICAgICAgfVxuXG4gICAgICAgICAgYnJlYWtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmVzdWx0XG4gIH1cbn1cbiIsImltcG9ydCB7IGJsYWNrbGlzdCB9IGZyb20gJy4vdXRpbCdcblxuZXhwb3J0IGNvbnN0IHdhbGtET00gPSAocGFyZW50Tm9kZSwgY29sbGVjdG9yKSA9PiB7XG4gIGlmICghcGFyZW50Tm9kZSkge1xuICAgIHJldHVyblxuICB9XG5cbiAgcHJvY2Vzc05vZGUocGFyZW50Tm9kZSwgY29sbGVjdG9yKVxuXG4gIHJldHVybiBjb2xsZWN0b3IuZ2V0UmVzdWx0KClcbn1cblxuY29uc3QgcHJvY2Vzc05vZGUgPSAobm9kZSwgY29sbGVjdG9yKSA9PiB7XG4gIHN3aXRjaCAobm9kZS5ub2RlVHlwZSkge1xuICAgIGNhc2UgTm9kZS5URVhUX05PREU6XG4gICAgICBjb2xsZWN0b3IucHJvY2Vzc1RleHROb2RlKG5vZGUpXG4gICAgICBicmVha1xuICAgIGNhc2UgTm9kZS5FTEVNRU5UX05PREU6XG4gICAgICBpZiAoYmxhY2tsaXN0LmluY2x1ZGVzKG5vZGUudGFnTmFtZS50b0xvd2VyQ2FzZSgpKSkge1xuICAgICAgICByZXR1cm5cbiAgICAgIH1cbiAgICAgIHByb2Nlc3NFbGVtZW50Tm9kZShub2RlLCBjb2xsZWN0b3IpXG4gICAgICBicmVha1xuICAgIGNhc2UgTm9kZS5ET0NVTUVOVF9OT0RFOlxuICAgIGNhc2UgTm9kZS5ET0NVTUVOVF9GUkFHTUVOVF9OT0RFOlxuICAgICAgaWYgKG5vZGUuaGFzQ2hpbGROb2RlcygpKSB7XG4gICAgICAgIG5vZGUuY2hpbGROb2Rlcy5mb3JFYWNoKChjaGlsZCkgPT4ge1xuICAgICAgICAgIHByb2Nlc3NOb2RlKGNoaWxkLCBjb2xsZWN0b3IpXG4gICAgICAgIH0pXG4gICAgICB9XG4gICAgICBicmVha1xuICB9XG59XG5cbmNvbnN0IHByb2Nlc3NFbGVtZW50Tm9kZSA9IChub2RlLCBjb2xsZWN0b3IpID0+IHtcbiAgY29uc3Qgc2tpcFJlc3QgPSBjb2xsZWN0b3IucHJvY2Vzc0VsZW1lbnROb2RlKG5vZGUsIHRydWUpXG5cbiAgaWYgKHNraXBSZXN0KSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICBpZiAobm9kZS5oYXNDaGlsZE5vZGVzKCkpIHtcbiAgICBub2RlLmNoaWxkTm9kZXMuZm9yRWFjaCgoY2hpbGQpID0+IHtcbiAgICAgIHByb2Nlc3NOb2RlKGNoaWxkLCBjb2xsZWN0b3IpXG4gICAgfSlcbiAgfVxuXG4gIGNvbGxlY3Rvci5wcm9jZXNzRWxlbWVudE5vZGUobm9kZSwgZmFsc2UpXG59XG4iLCJpbXBvcnQgeyBTdHJpbmdDb2xsZWN0b3IgfSBmcm9tICcuL3N0cmluZ0NvbGxlY3RvcidcbmltcG9ydCB7IE1hcENvbGxlY3RvciB9IGZyb20gJy4vbWFwQ29sbGVjdG9yJ1xuaW1wb3J0IHsgd2Fsa0RPTSB9IGZyb20gJy4vZG9tV2Fsa2VyJ1xuXG4vKipcbiAqIEV4dHJhY3RzIHRleHQgZnJvbSB0aGUgZ2l2ZW4gbm9kZS5cbiAqIE9wdGlvbnMgaW5jbHVkZSAoYnV0IGFyZSBub3QgbGltaXRlZCB0byk6XG4gKiAtIHBsYWNlaG9sZGVyU3RyaW5nOiBzdHJpbmcgdG8gdGFrZSB0aGUgcGxhY2Ugb2YgYWx0IHRleHQgd2hlbiBhbHQgaXQgaXMgZW1wdHkvdW5kZWZpbmVkXG4gKiAtIHBsYWNlaG9sZGVyQ29waWVzOiB0aGUgbnVtYmVyIG9mIHRpbWVzIHBsYWNlaG9sZGVyU3RyaW5nIHJlcGVhdHNcbiAqIEBwYXJhbSBwYXJlbnROb2RlXG4gKiBAcGFyYW0gb3B0aW9uc1xuICogQHJldHVybnMgeyp9XG4gKi9cbmV4cG9ydCBjb25zdCBkZWdhdXNzZXIgPSAocGFyZW50Tm9kZSwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IHVuaXRTZXBhcmF0b3JDb2RlID0gMzFcbiAgY29uc3QgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgcGxhY2Vob2xkZXJTdHJpbmc6IFN0cmluZy5mcm9tQ2hhckNvZGUodW5pdFNlcGFyYXRvckNvZGUpLFxuICAgIHBsYWNlaG9sZGVyQ29waWVzOiAxMDAsXG4gIH1cbiAgY29uc3QgZmluYWxPcHRpb25zID0gT2JqZWN0LmFzc2lnbihkZWZhdWx0T3B0aW9ucywgb3B0aW9ucylcblxuICBsZXQgY29sbGVjdG9yID0gbmV3IFN0cmluZ0NvbGxlY3RvcihmaW5hbE9wdGlvbnMpXG5cbiAgaWYgKGZpbmFsT3B0aW9ucy5tYXApIHtcbiAgICBjb2xsZWN0b3IgPSBuZXcgTWFwQ29sbGVjdG9yKGZpbmFsT3B0aW9ucylcbiAgfVxuXG4gIHJldHVybiB3YWxrRE9NKHBhcmVudE5vZGUsIGNvbGxlY3Rvcilcbn1cblxuZXhwb3J0IGNvbnN0IGdldFJhbmdlRnJvbU9mZnNldCA9IChzdGFydCwgZW5kLCBkb2MgPSBkb2N1bWVudCwgbWFwID0gbnVsbCwgb3B0aW9ucyA9IHt9KSA9PiB7XG4gIGNvbnN0IGRvY1R5cGUgPSBkb2Mubm9kZVR5cGVcbiAgaWYgKFxuICAgIGRvY1R5cGUgIT09IE5vZGUuRE9DVU1FTlRfTk9ERSAmJlxuICAgIGRvY1R5cGUgIT09IE5vZGUuRE9DVU1FTlRfRlJBR01FTlRfTk9ERVxuICApIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBEb2N1bWVudCBOb2RlJylcbiAgfVxuXG4gIGlmIChtYXAgPT09IG51bGwpIHtcbiAgICBjb25zdCBmaW5hbE9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBvcHRpb25zKVxuICAgIGZpbmFsT3B0aW9ucy5tYXAgPSB0cnVlXG4gICAgbWFwID0gZGVnYXVzc2VyKGRvYywgZmluYWxPcHRpb25zKVxuICB9XG5cbiAgY29uc3QgcmFuZ2UgPSBkb2MuY3JlYXRlUmFuZ2UoKVxuXG4gIGZvciAobGV0IG1hcEluZGV4ID0gMDsgbWFwSW5kZXggPCBtYXAubGVuZ3RoOyArK21hcEluZGV4KSB7XG4gICAgY29uc3QgZW50cnkgPSBtYXBbbWFwSW5kZXhdXG5cbiAgICBpZiAoc3RhcnQgPj0gZW50cnkuc3RhcnQgJiYgc3RhcnQgPCBlbnRyeS5zdGFydCArIGVudHJ5Lmxlbmd0aCkge1xuICAgICAgaWYgKGVudHJ5Lm5vZGUubm9kZU5hbWUgPT09ICdpbWcnKSB7XG4gICAgICAgIHJhbmdlLnNldFN0YXJ0QmVmb3JlKGVudHJ5Lm5vZGUpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCBhZGp1c3RlZFN0YXJ0ID0gc3RhcnQgLSBlbnRyeS5zdGFydFxuXG4gICAgICAgIGxldCBza2lwcyA9IDBcbiAgICAgICAgZm9yIChjb25zdCB3aGl0ZXNwYWNlRW50cnkgb2YgZW50cnkud2hpdGVzcGFjZSkge1xuICAgICAgICAgIGlmICh3aGl0ZXNwYWNlRW50cnkuYWZ0ZXIgPCBhZGp1c3RlZFN0YXJ0KSB7XG4gICAgICAgICAgICArK3NraXBzXG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGFkanVzdGVkU3RhcnQgKyBza2lwcyAtIGVudHJ5Lm5vZGUubGVuZ3RoID09PSAxKXtcbiAgICAgICAgICAvLyBzcGFjZSBiZXR3ZWVuIHRoZSBlbmQgb2YgdGhlIG5vZGUgYW5kIHRoZSBzdGFydCBvZiB0aGUgbmV4dFxuICAgICAgICAgIHJhbmdlLnNldFN0YXJ0QWZ0ZXIoZW50cnkubm9kZSlcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByYW5nZS5zZXRTdGFydChlbnRyeS5ub2RlLCBhZGp1c3RlZFN0YXJ0ICsgc2tpcHMpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoZW5kID49IGVudHJ5LnN0YXJ0ICYmIGVuZCA8IGVudHJ5LnN0YXJ0ICsgZW50cnkubGVuZ3RoKSB7XG4gICAgICBpZiAoZW50cnkubm9kZS5ub2RlTmFtZSA9PT0gJ2ltZycpIHtcbiAgICAgICAgcmFuZ2Uuc2V0RW5kQWZ0ZXIoZW50cnkubm9kZSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IGFkanVzdGVkRW5kID0gZW5kIC0gZW50cnkuc3RhcnRcblxuICAgICAgICBsZXQgc2tpcHMgPSAwXG4gICAgICAgIGZvciAoY29uc3Qgd2hpdGVzcGFjZUVudHJ5IG9mIGVudHJ5LndoaXRlc3BhY2UpIHtcbiAgICAgICAgICBpZiAod2hpdGVzcGFjZUVudHJ5LmFmdGVyIDwgYWRqdXN0ZWRFbmQpIHtcbiAgICAgICAgICAgICsrc2tpcHNcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoYWRqdXN0ZWRFbmQgKyBza2lwcyAtIGVudHJ5Lm5vZGUubGVuZ3RoID09PSAxKXtcbiAgICAgICAgICAvLyBzcGFjZSBiZXR3ZWVuIHRoZSBlbmQgb2YgdGhlIG5vZGUgYW5kIHRoZSBzdGFydCBvZiB0aGUgbmV4dFxuICAgICAgICAgIHJhbmdlLnNldEVuZEFmdGVyKGVudHJ5Lm5vZGUpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmFuZ2Uuc2V0RW5kKGVudHJ5Lm5vZGUsIGFkanVzdGVkRW5kICsgc2tpcHMpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJhbmdlXG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsU0FBUyxRQUFRLEdBQUc7QUFDcEIsRUFBRSxLQUFLLElBQUksSUFBSSxJQUFJLE1BQU0sQ0FBQyxtQkFBbUIsQ0FBQyxNQUFNLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUU7QUFDNUUsSUFBSSxJQUFJLElBQUksS0FBSyxhQUFhLElBQUksT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssVUFBVSxFQUFFO0FBQ3BFLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSTtBQUNyQyxFQUFFO0FBQ0Y7O0FBRUE7QUFDQSxNQUFNLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUU7QUFDbEMsTUFBTSxnQkFBZ0IsR0FBRyxDQUFDLFFBQVEsS0FBSztBQUN2QyxFQUFFLE9BQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxRQUFRO0FBQ3RDOztBQUVBLE1BQU0sYUFBYSxHQUFHLENBQUMsUUFBUSxLQUFLO0FBQ3BDLEVBQUUs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
