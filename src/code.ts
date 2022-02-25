import { dispatch, handleEvent } from './codeMessageHandler';
figma.showUI(__html__);

// The following shows how messages from the UI code can be handled in the main code.
handleEvent('createNode', () => {
    const node = figma.createRectangle();
    node.name = node.id;

    // This shows how the main code can send messages to the UI code.
    dispatch('nodeCreated', node.id);
});

figma.showUI(__html__);

figma.ui.resize(300, 500);

interface Message {
    type: string;
    nodeID: string;
    characters: string;
}

handleEvent('change-text', async (data) => {
    console.log('begin to change');

    const node = figma.getNodeById(data.id) as TextNode;

    const textNameArray = node.getRangeAllFontNames(0, node.characters.length);

    for (const fontName of textNameArray) {
        await figma.loadFontAsync(fontName);
    }

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
