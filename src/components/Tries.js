//const keywordDict = JSON.parse(fs.readFileSync('C:/docs/Projects/JapanApp/server/files/keywordSentences.json'))
//const sentenceLinks = JSON.parse(fs.readFileSync('C:/docs/Projects/JapanApp/server/files/sentenceLinks.json'))


class TextTrieNode {
    constructor(char) {
        this.char = char    // Will be used for autocomplete
        this.values = {}
        this.children = {}
    }
}

class IdTrieNode {
    constructor(char) {
        this.char = char;    // Will be used for autocomplete
        this.value = null;
        this.children = {};
    }
}

class TextTrie{
    constructor() {
        this.root = new TextTrieNode("")
    }
    
    insert(word, value, tag) {
        let node = this.root
        for (let char of word){
            if (char in node.children)
            node = node.children[char]
            else {
                let new_node = new TextTrieNode(char)
                node.children[char] = new_node
                node = new_node
            }
        }
        if (!(node.values[tag]))
            node.values[tag] = [];
        node.values[tag].push(value);
    }
    
    findWord(word, tag) {
        let node = this.root
        for (let char of word) {
            if (char in node.children)
                node = node.children[char]
            else
                return []
        }
        if (tag) {
            if (tag in node.values)
                return node.values[tag]
        }
        let ids = []
        for (const pos of Object.values(node.values)) {
            for (const id of pos) {
                if (ids.indexOf(id) == -1) 
                    ids.push(id)
            }
        }
        return ids;
    }
}

class IdTrie{
    constructor() {
        this.root = new IdTrieNode("")
    }
    
    insert(word, value) {
        let node = this.root
        for (let char of word){
            if (char in node.children)
            node = node.children[char]
            else {
                let new_node = new IdTrieNode(char)
                node.children[char] = new_node
                node = new_node
            }
        }
        node.value = value;
    }
    
    findWord(word) {
        let node = this.root
        for (let char of word) {
            if (char in node.children)
                node = node.children[char]
            else
                return false
        }
        return node.value
    }
}


const tries = (JMDict) => {
    let textTrie = new TextTrie();
    let idTrie = new IdTrie();
    
    console.log(JMDict)
    for (const entry of JMDict) {
        let id = entry["ent_seq"][0]
        
        
        let r_ele = entry["r_ele"]
        let k_ele = entry["k_ele"];
        
        let keb = [];
        if (k_ele) {
            if (k_ele.length) {
                for (const el of k_ele)
                    keb.push(el.keb[0]);
            }
        }
        
        let pos = [];
        if (entry.sense) {
            for (const sense of entry.sense) {
                if ("pos" in sense) {
                    for (let p of sense.pos) {
                        let tag = p.replace(";", "").replace('&', '');
                        pos.push(tag)
                    }
                }
            }
        }
        
        let gloss = [];
        if (entry["sense"] != null)
            for (var sense of entry['sense']) {
                let arr = [];
                for (let gls of sense.gloss) {
                    if (typeof gls == "string")
                        arr.push(gls);
                    else {
                        arr.push(gls['_'])
                    }
                }
                gloss.push(arr)
            }    
    
    
        let word = { id, r_ele, k_ele, keb, pos, gloss: gloss };
    
        if (word.keb) {
            for (const keb of word.keb) {
                for (const cPos of word.pos)
                    textTrie.insert(keb, id, cPos)
            }
        }
        for (const r_el of word.r_ele) {
            for (const cPos of word.pos)
                textTrie.insert(r_el.reb[0], id, cPos)
        }
        idTrie.insert(id, word)
    }
    return [ textTrie, idTrie ]
}

export default tries;