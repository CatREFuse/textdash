import { dispatch, handleEvent } from './codeMessageHandler';
figma.showUI(__html__);

figma.ui.resize(300, 500);

handleEvent('change-text', async (data) => {
    console.log('begin to change');

    const node = figma.getNodeById(data.id) as TextNode;

    if (node.characters.length > 0) {
        const textNameArray = node.getRangeAllFontNames(
            0,
            node.characters.length
        );

        for (const fontName of textNameArray) {
            await figma.loadFontAsync(fontName);
        }
    } else if (node.characters.length == 0) {
        await figma.loadFontAsync(node.fontName as FontName);
    }

    console.log('font loaded');

    node.characters = data.characters;
});

function selectionHandler() {
    function getAllTextNodes(node: SceneNode): TextNode[] {
        let textNodeArray = [] as TextNode[];

        if ('characters' in node) {
            textNodeArray.push(node);
        }

        if ('children' in node) {
            for (const childNode of node.children) {
                textNodeArray.push(...getAllTextNodes(childNode));
            }
        }

        return textNodeArray;
    }
    // 当选项发生了变化

    // console.log('current selection', figma.currentPage.selection);

    if (figma.currentPage.selection.length == 0) {
        return;
    }

    let textNodeArray = [] as TextNode[];

    for (const node of figma.currentPage.selection) {
        textNodeArray.push(...getAllTextNodes(node));
    }

    console.log('text selection', textNodeArray);

    // 预处理

    let postArray = textNodeArray.map((textNode) => {
        return {
            id: textNode.id,
            name: textNode.name,
            characters: textNode.characters,
        };
    });

    dispatch('selectionchange', { textNodeArray: postArray });
}

figma.on('selectionchange', selectionHandler);

figma.on('run', selectionHandler);

let rect = null as RectangleNode;

handleEvent('input-focus', (data) => {
    rect = figma.createRectangle();
    const textNode = figma.getNodeById(data.id) as TextNode;

    let highlight = clone(rect.fills);

    highlight[0].color = { r: 122 / 256, g: 98 / 256, b: 249 / 256 };

    rect.fills = highlight;
    const absoluteTextNodePostion = {
        x: textNode.absoluteTransform[0][2],
        y: textNode.absoluteTransform[1][2],
    };

    let width = 0;

    // console.log(textNode.getStyledTextSegments(['fontSize']));

    if (textNode.fontSize !== figma.mixed) {
        width = 0.3 * (textNode.fontSize as number);
    } else {
        width = 0.3 * textNode.getStyledTextSegments(['fontSize'])[0].fontSize;
    }

    console.log(width);

    rect.x = absoluteTextNodePostion.x - width * 2;
    rect.y = absoluteTextNodePostion.y;
    rect.resize(width, textNode.height);
});

handleEvent('input-blur', (data) => {
    const textNode = figma.getNodeById(data.id) as TextNode;

    rect.remove();
    rect = null;
});

// tools

function clone(val) {
    const type = typeof val;
    if (val === null) {
        return null;
    } else if (
        type === 'undefined' ||
        type === 'number' ||
        type === 'string' ||
        type === 'boolean'
    ) {
        return val;
    } else if (type === 'object') {
        if (val instanceof Array) {
            return val.map((x) => clone(x));
        } else if (val instanceof Uint8Array) {
            return new Uint8Array(val);
        } else {
            let o = {};
            for (const key in val) {
                o[key] = clone(val[key]);
            }
            return o;
        }
    }
    throw 'unknown';
}
