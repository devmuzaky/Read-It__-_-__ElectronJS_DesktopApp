// Modules
const fs = require('fs')

// Dom Nodes
let items = document.getElementById('items')

// Get reader.js content
let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString()
})

// Track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || []

// Persist items in storage
exports.save = () => {
    // Only if storage isn't empty
    if (this.storage.length) {
        // Save storage
        localStorage.setItem('readit-items', JSON.stringify(this.storage))
    }
}

// Select item
exports.select = e => {
    // Remove current selected item
    document.getElementsByClassName('read-item selected')[0].classList.remove('selected')

    // Add selected class to clicked item
    e.currentTarget.classList.add('selected')
}

// Change selection with up/down keys
exports.changeSelection = direction => {
    // Get Currently selected item
    let currentItem = document.getElementsByClassName('read-item selected')[0]

    // Handle up/down
    if (direction === 'ArrowUp' && currentItem.previousSibling) {
        currentItem.classList.remove('selected')
        currentItem.previousSibling.classList.add('selected')
    }
    else if (direction === 'ArrowDown' && currentItem.nextSibling) {
        currentItem.classList.remove('selected')
        currentItem.nextSibling.classList.add('selected')
    }
}

// Open selected item
exports.open = () => {
    // Only if we have items
    if (!this.storage.length) return

    // Get selected item
    let selectedItem = document.getElementsByClassName('read-item selected')[0]

    // Get item's url
    let contentURL = selectedItem.dataset.url

    // Open item in proxy BrowserWindow
    let readerWin = window.open(contentURL, '', `
        maxWidth=2000,
        maxHeight=2000,
        width=1200,
        height=800,
        backgroundColor=#DEDEDE,
        nodeIntegration=0,
        contextIsolation=1
    ` )

    // inject javascript to reader window
    readerWin.eval(readerJS)

}

// Add new Item
exports.addItem = (item, isNew = false) => {
    // Create new DOM element
    let itemNode = document.createElement('div')

    // Assign "read-item" class
    itemNode.setAttribute('class', 'read-item')

    // Add item url as data attribute
    itemNode.setAttribute('data-url', item.url)

    // Add inner html
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    // Append new node to "items"
    items.appendChild(itemNode)

    // Attach click handler to select
    itemNode.addEventListener('click', this.select)

    // Attach double click handler to open
    itemNode.addEventListener('dblclick', this.open)

    // If this is the first item, select it
    if (document.getElementsByClassName('read-item').length === 1) {
        itemNode.classList.add('selected')
    }

    // Add item to storage and persist
    if (isNew) {
        this.storage.push(item)
        this.save()
    }
}

// Add items from Storage when app loads
this.storage.forEach(item => {
    this.addItem(item)
})